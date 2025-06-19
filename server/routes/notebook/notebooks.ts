import type { Express, Response } from "express";
import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "../../db";
import { 
  notebooks, 
  notebookSections, 
  notebookPages, 
  pageComments,
  notebookActivity,
  insertNotebookSchema,
  insertNotebookSectionSchema,
  insertNotebookPageSchema 
} from "@shared/schema";
import { isAuthenticated } from "../../roleMiddleware";

export function registerNotebookRoutes(app: Express) {
  // Get all notebooks for user with section and page counts
  app.get('/api/notebooks', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Get notebooks with section and page counts
      const userNotebooks = await db
        .select({
          id: notebooks.id,
          title: notebooks.title,
          color: notebooks.color,
          isShared: notebooks.isShared,
          isFavorite: notebooks.isFavorite,
          collaborators: notebooks.collaborators,
          tags: notebooks.tags,
          lastAccessedAt: notebooks.lastAccessedAt,
          createdAt: notebooks.createdAt,
          updatedAt: notebooks.updatedAt,
          sectionCount: sql<number>`count(distinct ${notebookSections.id})`,
          pageCount: sql<number>`count(distinct ${notebookPages.id})`
        })
        .from(notebooks)
        .leftJoin(notebookSections, eq(notebooks.id, notebookSections.notebookId))
        .leftJoin(notebookPages, eq(notebookSections.id, notebookPages.sectionId))
        .where(eq(notebooks.userId, userId))
        .groupBy(notebooks.id)
        .orderBy(desc(notebooks.lastAccessedAt), desc(notebooks.updatedAt));

      res.json(userNotebooks);
    } catch (error) {
      console.error("Error fetching notebooks:", error);
      res.status(500).json({ message: "Failed to fetch notebooks" });
    }
  });

  // Get notebook with full hierarchy (sections and pages)
  app.get('/api/notebooks/:id', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user?.id;
      const notebookId = parseInt(req.params.id);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Get notebook details
      const [notebook] = await db
        .select()
        .from(notebooks)
        .where(and(
          eq(notebooks.id, notebookId),
          eq(notebooks.userId, userId)
        ));

      if (!notebook) {
        return res.status(404).json({ message: "Notebook not found" });
      }

      // Get sections with their pages
      const sections = await db
        .select({
          id: notebookSections.id,
          title: notebookSections.title,
          color: notebookSections.color,
          position: notebookSections.position,
          isExpanded: notebookSections.isExpanded,
          createdAt: notebookSections.createdAt,
          updatedAt: notebookSections.updatedAt,
        })
        .from(notebookSections)
        .where(eq(notebookSections.notebookId, notebookId))
        .orderBy(notebookSections.position);

      const pages = await db
        .select()
        .from(notebookPages)
        .where(eq(notebookPages.sectionId, sql`ANY(${sections.map(s => s.id)})`))
        .orderBy(notebookPages.position);

      // Group pages by section
      const sectionsWithPages = sections.map(section => ({
        ...section,
        pages: pages.filter(page => page.sectionId === section.id)
      }));

      // Update last accessed time
      await db
        .update(notebooks)
        .set({ lastAccessedAt: new Date() })
        .where(eq(notebooks.id, notebookId));

      res.json({
        ...notebook,
        sections: sectionsWithPages
      });
    } catch (error) {
      console.error("Error fetching notebook:", error);
      res.status(500).json({ message: "Failed to fetch notebook" });
    }
  });

  // Create new notebook
  app.post('/api/notebooks', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const validatedData = insertNotebookSchema.parse({
        ...req.body,
        userId,
        tenantId: req.user?.tenantId || 'default'
      });

      const [newNotebook] = await db
        .insert(notebooks)
        .values(validatedData)
        .returning();

      // Create default section
      await db
        .insert(notebookSections)
        .values({
          notebookId: newNotebook.id,
          title: "Quick Notes",
          color: "#10B981",
          position: 0
        });

      // Log activity
      await db
        .insert(notebookActivity)
        .values({
          notebookId: newNotebook.id,
          userId,
          actionType: "created",
          targetType: "notebook",
          targetId: newNotebook.id
        });

      res.status(201).json(newNotebook);
    } catch (error) {
      console.error("Error creating notebook:", error);
      res.status(500).json({ message: "Failed to create notebook" });
    }
  });

  // Update notebook
  app.patch('/api/notebooks/:id', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user?.id;
      const notebookId = parseInt(req.params.id);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const [updatedNotebook] = await db
        .update(notebooks)
        .set({ 
          ...req.body, 
          updatedAt: new Date() 
        })
        .where(and(
          eq(notebooks.id, notebookId),
          eq(notebooks.userId, userId)
        ))
        .returning();

      if (!updatedNotebook) {
        return res.status(404).json({ message: "Notebook not found" });
      }

      res.json(updatedNotebook);
    } catch (error) {
      console.error("Error updating notebook:", error);
      res.status(500).json({ message: "Failed to update notebook" });
    }
  });

  // Delete notebook
  app.delete('/api/notebooks/:id', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user?.id;
      const notebookId = parseInt(req.params.id);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const [deletedNotebook] = await db
        .delete(notebooks)
        .where(and(
          eq(notebooks.id, notebookId),
          eq(notebooks.userId, userId)
        ))
        .returning();

      if (!deletedNotebook) {
        return res.status(404).json({ message: "Notebook not found" });
      }

      res.json({ message: "Notebook deleted successfully" });
    } catch (error) {
      console.error("Error deleting notebook:", error);
      res.status(500).json({ message: "Failed to delete notebook" });
    }
  });
}