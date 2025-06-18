import type { Express, Request, Response } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db } from "../../db";
import { notebooks, subjects } from "@shared/schema";
import { isAuthenticated } from "../../replitAuth";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export function registerNotebookRoutes(app: Express) {
  // Get all notebooks for user
  app.get('/api/notebooks', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const userNotebooks = await db
        .select()
        .from(notebooks)
        .where(eq(notebooks.userId, userId))
        .orderBy(desc(notebooks.updatedAt));

      res.json(userNotebooks);
    } catch (error) {
      console.error("Error fetching notebooks:", error);
      res.status(500).json({ message: "Failed to fetch notebooks" });
    }
  });

  // Get notebook with full hierarchy
  app.get('/api/notebooks/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const notebookId = parseInt(req.params.id);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const notebook = await db.query.notebooks.findFirst({
        where: and(
          eq(notebooks.id, notebookId),
          eq(notebooks.userId, userId)
        ),
        with: {
          subjects: {
            with: {
              chapters: {
                with: {
                  topics: {
                    with: {
                      pages: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!notebook) {
        return res.status(404).json({ message: "Notebook not found" });
      }

      res.json(notebook);
    } catch (error) {
      console.error("Error fetching notebook:", error);
      res.status(500).json({ message: "Failed to fetch notebook" });
    }
  });

  // Create new notebook
  app.post('/api/notebooks', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { name, description, color, gradeLevel } = req.body;

      const [newNotebook] = await db
        .insert(notebooks)
        .values({
          userId,
          title: name,
          description,
          color,
        })
        .returning();

      res.status(201).json(newNotebook);
    } catch (error) {
      console.error("Error creating notebook:", error);
      res.status(500).json({ message: "Failed to create notebook" });
    }
  });

  // Update notebook
  app.put('/api/notebooks/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const notebookId = parseInt(req.params.id);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { name, description, color, gradeLevel } = req.body;

      const [updatedNotebook] = await db
        .update(notebooks)
        .set({
          title: name,
          description,
          color,
          updatedAt: new Date(),
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
  app.delete('/api/notebooks/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
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