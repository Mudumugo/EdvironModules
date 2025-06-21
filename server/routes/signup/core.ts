import type { Express, Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "../../db";
import { users, tenants } from "@shared/schema";
import { eq } from "drizzle-orm";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['student', 'teacher', 'admin', 'parent']),
  schoolName: z.string().optional(),
  tenantId: z.string().optional()
});

export function registerSignupCoreRoutes(app: Express) {
  // Basic user signup
  app.post('/api/auth/signup', async (req: Request, res: Response) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, validatedData.email))
        .limit(1);

      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);

      // Create user
      const newUser = await db
        .insert(users)
        .values({
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email: validatedData.email,
          password: hashedPassword,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          role: validatedData.role,
          tenantId: validatedData.tenantId || 'default_tenant',
          isActive: true,
          emailVerified: false
        })
        .returning();

      res.status(201).json({
        success: true,
        user: {
          id: newUser[0].id,
          email: newUser[0].email,
          firstName: newUser[0].firstName,
          lastName: newUser[0].lastName,
          role: newUser[0].role
        }
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Check email availability
  app.post('/api/auth/check-email', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      res.json({
        available: existingUser.length === 0
      });
    } catch (error) {
      console.error('Email check error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}