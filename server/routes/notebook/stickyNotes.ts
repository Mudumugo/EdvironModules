import type { Express, Response } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db } from "../../db";
import { stickyNotes, pages } from "@shared/schema";
import { isAuthenticated } from "../../replitAuth";
import type { AuthenticatedRequest } from "../../types/auth";



export function registerStickyNoteRoutes(app: Express) {
  // Get all sticky notes for a page
  app.get('/api/pages/:pageId/sticky-notes', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const pageId = parseInt(req.params.pageId);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Verify page ownership through full hierarchy
      const page = await db.query.pages.findFirst({
        where: eq(pages.id, pageId),
        with: {
          topic: {
            with: {
              chapter: {
                with: {
                  subject: {
                    with: {
                      notebook: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!page || page.topic.chapter.subject.notebook.userId !== userId) {
        return res.status(404).json({ message: "Page not found" });
      }

      const pageStickyNotes = await db
        .select()
        .from(stickyNotes)
        .where(eq(stickyNotes.pageId, pageId))
        .orderBy(desc(stickyNotes.createdAt));

      res.json(pageStickyNotes);
    } catch (error) {
      console.error("Error fetching sticky notes:", error);
      res.status(500).json({ message: "Failed to fetch sticky notes" });
    }
  });

  // Create new sticky note
  app.post('/api/pages/:pageId/sticky-notes', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const pageId = parseInt(req.params.pageId);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Verify page ownership
      const page = await db.query.pages.findFirst({
        where: eq(pages.id, pageId),
        with: {
          topic: {
            with: {
              chapter: {
                with: {
                  subject: {
                    with: {
                      notebook: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!page || page.topic.chapter.subject.notebook.userId !== userId) {
        return res.status(404).json({ message: "Page not found" });
      }

      const { content, xPosition, yPosition, color } = req.body;

      const [newStickyNote] = await db
        .insert(stickyNotes)
        .values({
          pageId,
          userId,
          content,
          positionX: xPosition,
          positionY: yPosition,
          color,
        })
        .returning();

      res.status(201).json(newStickyNote);
    } catch (error) {
      console.error("Error creating sticky note:", error);
      res.status(500).json({ message: "Failed to create sticky note" });
    }
  });

  // Update sticky note
  app.put('/api/sticky-notes/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const stickyNoteId = parseInt(req.params.id);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { content, xPosition, yPosition, color } = req.body;

      const [updatedStickyNote] = await db
        .update(stickyNotes)
        .set({
          content,
          positionX: xPosition,
          positionY: yPosition,
          color,
          updatedAt: new Date(),
        })
        .where(and(
          eq(stickyNotes.id, stickyNoteId),
          eq(stickyNotes.userId, userId)
        ))
        .returning();

      if (!updatedStickyNote) {
        return res.status(404).json({ message: "Sticky note not found" });
      }

      res.json(updatedStickyNote);
    } catch (error) {
      console.error("Error updating sticky note:", error);
      res.status(500).json({ message: "Failed to update sticky note" });
    }
  });

  // Delete sticky note
  app.delete('/api/sticky-notes/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const stickyNoteId = parseInt(req.params.id);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const [deletedStickyNote] = await db
        .delete(stickyNotes)
        .where(and(
          eq(stickyNotes.id, stickyNoteId),
          eq(stickyNotes.userId, userId)
        ))
        .returning();

      if (!deletedStickyNote) {
        return res.status(404).json({ message: "Sticky note not found" });
      }

      res.json({ message: "Sticky note deleted successfully" });
    } catch (error) {
      console.error("Error deleting sticky note:", error);
      res.status(500).json({ message: "Failed to delete sticky note" });
    }
  });
}