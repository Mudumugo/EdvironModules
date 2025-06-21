import type { Express, Response } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db } from "../../db";
// Note: topics, chapters, and subjects removed as they're not part of modular schema
import { isAuthenticated } from "../../replitAuth";



export function registerTopicRoutes(app: Express) {
  // Get all topics for a chapter
  app.get('/api/chapters/:chapterId/topics', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const chapterId = parseInt(req.params.chapterId);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Verify chapter ownership through subject and notebook
      const chapter = await db.query.chapters.findFirst({
        where: eq(chapters.id, chapterId),
        with: {
          subject: {
            with: {
              notebook: true
            }
          }
        }
      });

      if (!chapter || ((chapter as any)?.subject?.notebook?.userId) !== userId) {
        return res.status(404).json({ message: "Chapter not found" });
      }

      const chapterTopics = await db
        .select()
        .from(topics)
        .where(eq(topics.chapterId, chapterId))
        .orderBy(desc(topics.updatedAt));

      res.json(chapterTopics);
    } catch (error) {
      console.error("Error fetching topics:", error);
      res.status(500).json({ message: "Failed to fetch topics" });
    }
  });

  // Create new topic
  app.post('/api/chapters/:chapterId/topics', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const chapterId = parseInt(req.params.chapterId);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Verify chapter ownership
      const chapter = await db.query.chapters.findFirst({
        where: eq(chapters.id, chapterId),
        with: {
          subject: {
            with: {
              notebook: true
            }
          }
        }
      });

      if (!chapter || ((chapter as any)?.subject?.notebook?.userId) !== userId) {
        return res.status(404).json({ message: "Chapter not found" });
      }

      const { name, description, orderIndex } = req.body;

      const [newTopic] = await db
        .insert(topics)
        .values({
          chapterId,
          name,
          description,
          orderIndex,
        })
        .returning();

      res.status(201).json(newTopic);
    } catch (error) {
      console.error("Error creating topic:", error);
      res.status(500).json({ message: "Failed to create topic" });
    }
  });
}