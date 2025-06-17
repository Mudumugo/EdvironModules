import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { USER_ROLES } from "@shared/schema";

export function registerUserRoutes(app: Express) {
  // Get all users (temporarily bypass auth for testing)
  app.get('/api/users', async (req: any, res) => {
    try {
      const users = await storage.getUsersByTenant('demo-school');
      
      const publicUsers = users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || 'student',
        gradeLevel: user.gradeLevel,
        department: user.department,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt
      }));

      res.json(publicUsers);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Get available roles (temporarily bypass auth for testing)
  app.get('/api/users/available-roles', async (req: any, res) => {
    try {
      const roles = [
        { value: USER_ROLES.STUDENT_ELEMENTARY, label: "Elementary Student" },
        { value: USER_ROLES.STUDENT_MIDDLE, label: "Middle School Student" },
        { value: USER_ROLES.STUDENT_HIGH, label: "High School Student" },
        { value: USER_ROLES.TEACHER, label: "Teacher" },
        { value: USER_ROLES.SCHOOL_ADMIN, label: "School Administrator" },
        { value: USER_ROLES.PRINCIPAL, label: "Principal" }
      ];

      res.json(roles);
    } catch (error: any) {
      console.error("Error fetching available roles:", error);
      res.status(500).json({ message: "Failed to fetch available roles" });
    }
  });

  // Update user role (temporarily bypass auth for testing)
  app.patch('/api/users/:userId/role', async (req: any, res) => {
    try {
      const { userId } = req.params;
      const { role, gradeLevel, department } = req.body;

      const updatedUser = await storage.updateUserRole(userId, role, gradeLevel, department);
      
      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        gradeLevel: updatedUser.gradeLevel,
        department: updatedUser.department,
        isActive: updatedUser.isActive,
        updatedAt: updatedUser.updatedAt
      });
    } catch (error: any) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });
}