import type { Express, Request, Response } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db } from "../../db";
import { pages, topics, chapters } from "@shared/schema";
import { isAuthenticated } from "../../replitAuth";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export function registerPageRoutes(app: Express) {
  // Get all pages for a topic
  app.get('/api/topics/:topicId/pages', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const topicId = parseInt(req.params.topicId);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Verify topic ownership through full hierarchy
      const topic = await db.query.topics.findFirst({
        where: eq(topics.id, topicId),
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
      });

      if (!topic || topic.chapter.subject.notebook.userId !== userId) {
        return res.status(404).json({ message: "Topic not found" });
      }

      const topicPages = await db
        .select()
        .from(pages)
        .where(eq(pages.topicId, topicId))
        .orderBy(desc(pages.updatedAt));

      res.json(topicPages);
    } catch (error) {
      console.error("Error fetching pages:", error);
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  // Create new page
  app.post('/api/topics/:topicId/pages', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const topicId = parseInt(req.params.topicId);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Verify topic ownership
      const topic = await db.query.topics.findFirst({
        where: eq(topics.id, topicId),
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
      });

      if (!topic || topic.chapter.subject.notebook.userId !== userId) {
        return res.status(404).json({ message: "Topic not found" });
      }

      const { title, content, contentType, orderIndex } = req.body;

      const [newPage] = await db
        .insert(pages)
        .values({
          topicId,
          title,
          content,
          contentType,
          orderIndex,
        })
        .returning();

      res.status(201).json(newPage);
    } catch (error) {
      console.error("Error creating page:", error);
      res.status(500).json({ message: "Failed to create page" });
    }
  });

  // Update page
  app.put('/api/pages/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const pageId = parseInt(req.params.id);

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

      const { title, content, contentType } = req.body;

      const [updatedPage] = await db
        .update(pages)
        .set({
          title,
          content,
          contentType,
          updatedAt: new Date(),
        })
        .where(eq(pages.id, pageId))
        .returning();

      res.json(updatedPage);
    } catch (error) {
      console.error("Error updating page:", error);
      res.status(500).json({ message: "Failed to update page" });
    }
  });
}