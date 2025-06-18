import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";
import { db } from "../db";
import { lockerItems } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    claims?: any;
  };
}

export function registerLockerRoutes(app: Express) {
  // Get user's locker items
  app.get('/api/locker/items', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const items = await db
        .select()
        .from(lockerItems)
        .where(eq(lockerItems.userId, userId))
        .orderBy(desc(lockerItems.createdAt));
      
      res.json(items);
    } catch (error) {
      console.error("Error fetching locker items:", error);
      res.status(500).json({ message: "Failed to fetch locker items" });
    }
  });

  // Save item to locker
  app.post('/api/locker/items', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const itemData = req.body;
      
      const [newItem] = await db
        .insert(lockerItems)
        .values({
          ...itemData,
          userId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      res.json(newItem);
    } catch (error) {
      console.error("Error saving locker item:", error);
      res.status(500).json({ message: "Failed to save locker item" });
    }
  });

  // Delete locker item
  app.delete('/api/locker/items/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const itemId = parseInt(req.params.id);
      
      await db
        .delete(lockerItems)
        .where(and(
          eq(lockerItems.id, itemId),
          eq(lockerItems.userId, userId)
        ));
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting locker item:", error);
      res.status(500).json({ message: "Failed to delete locker item" });
    }
  });

  // Update locker item
  app.put('/api/locker/items/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const itemId = parseInt(req.params.id);
      const updateData = req.body;
      
      const [updatedItem] = await db
        .update(lockerItems)
        .set({
          ...updateData,
          updatedAt: new Date()
        })
        .where(and(
          eq(lockerItems.id, itemId),
          eq(lockerItems.userId, userId)
        ))
        .returning();
      
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating locker item:", error);
      res.status(500).json({ message: "Failed to update locker item" });
    }
  });
}