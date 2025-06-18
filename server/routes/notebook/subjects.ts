import type { Express, Request, Response } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db } from "../../db";
import { subjects, notebooks } from "@shared/schema";
import { isAuthenticated } from "../../replitAuth";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export function registerSubjectRoutes(app: Express) {
  // Get all subjects for a notebook
  app.get('/api/notebooks/:notebookId/subjects', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const notebookId = parseInt(req.params.notebookId);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Verify notebook ownership
      const notebook = await db
        .select()
        .from(notebooks)
        .where(and(
          eq(notebooks.id, notebookId),
          eq(notebooks.userId, userId)
        ))
        .limit(1);

      if (!notebook.length) {
        return res.status(404).json({ message: "Notebook not found" });
      }

      const notebookSubjects = await db
        .select()
        .from(subjects)
        .where(eq(subjects.notebookId, notebookId))
        .orderBy(desc(subjects.updatedAt));

      res.json(notebookSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });

  // Create new subject
  app.post('/api/notebooks/:notebookId/subjects', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims?.sub;
      const notebookId = parseInt(req.params.notebookId);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Verify notebook ownership
      const notebook = await db
        .select()
        .from(notebooks)
        .where(and(
          eq(notebooks.id, notebookId),
          eq(notebooks.userId, userId)
        ))
        .limit(1);

      if (!notebook.length) {
        return res.status(404).json({ message: "Notebook not found" });
      }

      const { name, description, color } = req.body;

      const [newSubject] = await db
        .insert(subjects)
        .values({
          notebookId,
          name,
          description,
          color,
        })
        .returning();

      res.status(201).json(newSubject);
    } catch (error) {
      console.error("Error creating subject:", error);
      res.status(500).json({ message: "Failed to create subject" });
    }
  });
}