import type { Express, Response } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db } from "../../db";
import { chapters, subjects, notebooks } from "@shared/schema";
import { isAuthenticated } from "../../replitAuth";



export function registerChapterRoutes(app: Express) {
  // Get all chapters for a subject
  app.get('/api/subjects/:subjectId/chapters', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const subjectId = parseInt(req.params.subjectId);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Verify subject ownership through notebook
      const subject = await db.query.subjects.findFirst({
        where: eq(subjects.id, subjectId),
        with: {
          notebook: true
        }
      });

      if (!subject || ((subject as any)?.notebook?.userId || null) !== userId) {
        return res.status(404).json({ message: "Subject not found" });
      }

      const subjectChapters = await db
        .select()
        .from(chapters)
        .where(eq(chapters.subjectId, subjectId))
        .orderBy(desc(chapters.updatedAt));

      res.json(subjectChapters);
    } catch (error) {
      console.error("Error fetching chapters:", error);
      res.status(500).json({ message: "Failed to fetch chapters" });
    }
  });

  // Create new chapter
  app.post('/api/subjects/:subjectId/chapters', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const subjectId = parseInt(req.params.subjectId);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Verify subject ownership
      const subject = await db.query.subjects.findFirst({
        where: eq(subjects.id, subjectId),
        with: {
          notebook: true
        }
      });

      if (!subject || ((subject as any)?.notebook?.userId || null) !== userId) {
        return res.status(404).json({ message: "Subject not found" });
      }

      const { name, description, orderIndex } = req.body;

      const [newChapter] = await db
        .insert(chapters)
        .values({
          subjectId,
          name,
          description,
          orderIndex,
        })
        .returning();

      res.status(201).json(newChapter);
    } catch (error) {
      console.error("Error creating chapter:", error);
      res.status(500).json({ message: "Failed to create chapter" });
    }
  });
}