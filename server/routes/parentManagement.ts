import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";
import { db } from "../db";
import { users } from "@shared/schema";
import { parentChildRelationships, grades, attendance } from "@shared/schemas/education.schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

const createRelationshipSchema = z.object({
  childUserId: z.string(),
  relationship: z.enum(["parent", "guardian", "emergency_contact"]).default("parent"),
  isPrimary: z.boolean().default(false),
  canViewGrades: z.boolean().default(true),
  canViewAttendance: z.boolean().default(true),
  canReceiveNotifications: z.boolean().default(true)
});

export function registerParentManagementRoutes(app: Express) {
  // Create parent-child relationship (admin only)
  app.post('/api/admin/parent-relationships', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Check if user is admin
      const currentUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!currentUser[0] || !currentUser[0].role?.includes('admin')) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = createRelationshipSchema.parse(req.body);
      const { parentUserId } = req.body;

      // Verify parent and child users exist
      const [parent, child] = await Promise.all([
        db.select().from(users).where(eq(users.id, parentUserId)).limit(1),
        db.select().from(users).where(eq(users.id, validatedData.childUserId)).limit(1)
      ]);

      if (!parent[0] || !child[0]) {
        return res.status(404).json({ message: "Parent or child user not found" });
      }

      // Check if relationship already exists
      const existingRelationship = await db
        .select()
        .from(parentChildRelationships)
        .where(
          and(
            eq(parentChildRelationships.parentUserId, parentUserId),
            eq(parentChildRelationships.childUserId, validatedData.childUserId)
          )
        )
        .limit(1);

      if (existingRelationship.length > 0) {
        return res.status(409).json({ message: "Relationship already exists" });
      }

      const [relationship] = await db
        .insert(parentChildRelationships)
        .values({
          parentUserId,
          ...validatedData
        })
        .returning();

      res.status(201).json(relationship);
    } catch (error) {
      console.error("Error creating parent-child relationship:", error);
      res.status(500).json({ message: "Failed to create relationship" });
    }
  });

  // Get all parent-child relationships (admin only)
  app.get('/api/admin/parent-relationships', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Check if user is admin
      const currentUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!currentUser[0] || !currentUser[0].role?.includes('admin')) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const relationships = await db
        .select({
          id: parentChildRelationships.id,
          parentUserId: parentChildRelationships.parentUserId,
          childUserId: parentChildRelationships.childUserId,
          relationship: parentChildRelationships.relationship,
          isPrimary: parentChildRelationships.isPrimary,
          canViewGrades: parentChildRelationships.canViewGrades,
          canViewAttendance: parentChildRelationships.canViewAttendance,
          canReceiveNotifications: parentChildRelationships.canReceiveNotifications,
          parent: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email
          }
        })
        .from(parentChildRelationships)
        .innerJoin(users, eq(parentChildRelationships.parentUserId, users.id));

      res.json(relationships);
    } catch (error) {
      console.error("Error fetching parent-child relationships:", error);
      res.status(500).json({ message: "Failed to fetch relationships" });
    }
  });

  // Update parent-child relationship permissions
  app.put('/api/admin/parent-relationships/:relationshipId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { relationshipId } = req.params;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Check if user is admin
      const currentUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!currentUser[0] || !currentUser[0].role?.includes('admin')) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const updateData = {
        relationship: req.body.relationship,
        isPrimary: req.body.isPrimary,
        canViewGrades: req.body.canViewGrades,
        canViewAttendance: req.body.canViewAttendance,
        canReceiveNotifications: req.body.canReceiveNotifications,
        updatedAt: new Date()
      };

      const [updatedRelationship] = await db
        .update(parentChildRelationships)
        .set(updateData)
        .where(eq(parentChildRelationships.id, parseInt(relationshipId)))
        .returning();

      if (!updatedRelationship) {
        return res.status(404).json({ message: "Relationship not found" });
      }

      res.json(updatedRelationship);
    } catch (error) {
      console.error("Error updating parent-child relationship:", error);
      res.status(500).json({ message: "Failed to update relationship" });
    }
  });

  // Delete parent-child relationship
  app.delete('/api/admin/parent-relationships/:relationshipId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { relationshipId } = req.params;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Check if user is admin
      const currentUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!currentUser[0] || !currentUser[0].role?.includes('admin')) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const [deletedRelationship] = await db
        .delete(parentChildRelationships)
        .where(eq(parentChildRelationships.id, parseInt(relationshipId)))
        .returning();

      if (!deletedRelationship) {
        return res.status(404).json({ message: "Relationship not found" });
      }

      res.json({ message: "Relationship deleted successfully" });
    } catch (error) {
      console.error("Error deleting parent-child relationship:", error);
      res.status(500).json({ message: "Failed to delete relationship" });
    }
  });

  // Get detailed child progress for parents
  app.get('/api/parent/child/:childId/detailed-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { childId } = req.params;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Verify parent has access to this child
      const relationship = await db
        .select()
        .from(parentChildRelationships)
        .where(
          and(
            eq(parentChildRelationships.parentUserId, userId),
            eq(parentChildRelationships.childUserId, childId)
          )
        )
        .limit(1);

      if (relationship.length === 0) {
        return res.status(403).json({ message: "Access denied to this child's information" });
      }

      const childInfo = await db
        .select()
        .from(users)
        .where(eq(users.id, childId))
        .limit(1);

      if (!childInfo[0]) {
        return res.status(404).json({ message: "Child not found" });
      }

      // Get recent grades if parent can view them
      let recentGrades = [];
      if (relationship[0].canViewGrades) {
        recentGrades = await db
          .select()
          .from(grades)
          .where(eq(grades.studentId, childId))
          .orderBy(desc(grades.createdAt))
          .limit(10);
      }

      // Get recent attendance if parent can view it
      let recentAttendance = [];
      if (relationship[0].canViewAttendance) {
        recentAttendance = await db
          .select()
          .from(attendance)
          .where(eq(attendance.studentId, childId))
          .orderBy(desc(attendance.date))
          .limit(30);
      }

      res.json({
        child: childInfo[0],
        permissions: {
          canViewGrades: relationship[0].canViewGrades,
          canViewAttendance: relationship[0].canViewAttendance
        },
        recentGrades,
        recentAttendance,
        progressSummary: {
          attendanceRate: recentAttendance.length > 0 
            ? Math.round((recentAttendance.filter(a => a.status === 'present').length / recentAttendance.length) * 100)
            : null,
          averageGrade: recentGrades.length > 0
            ? Math.round(recentGrades.reduce((sum, g) => sum + (g.points || 0), 0) / recentGrades.length)
            : null,
          totalAssignments: recentGrades.length
        }
      });
    } catch (error) {
      console.error("Error fetching detailed child progress:", error);
      res.status(500).json({ message: "Failed to fetch child progress" });
    }
  });
}