import type { Express, Request, Response } from "express";
import { z } from "zod";
import { db } from "../../db";
import { tenants, users } from "@shared/schema";
import { eq } from "drizzle-orm";

const schoolSignupSchema = z.object({
  schoolName: z.string().min(2),
  adminEmail: z.string().email(),
  adminFirstName: z.string().min(1),
  adminLastName: z.string().min(1),
  adminPassword: z.string().min(8),
  county: z.string().min(1),
  subcounty: z.string().optional(),
  schoolType: z.enum(['primary', 'secondary', 'tertiary']),
  studentCount: z.number().min(1),
  phoneNumber: z.string().min(10)
});

export function registerSchoolSignupRoutes(app: Express) {
  // School registration
  app.post('/api/auth/school-signup', async (req: Request, res: Response) => {
    try {
      const validatedData = schoolSignupSchema.parse(req.body);
      
      // Check if school or admin email already exists
      const [existingTenant, existingUser] = await Promise.all([
        db.select().from(tenants).where(eq(tenants.name, validatedData.schoolName)).limit(1),
        db.select().from(users).where(eq(users.email, validatedData.adminEmail)).limit(1)
      ]);

      if (existingTenant.length > 0) {
        return res.status(400).json({ error: 'School already registered' });
      }

      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Admin email already in use' });
      }

      // Create tenant (school)
      const tenantId = `school_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newTenant = await db
        .insert(tenants)
        .values({
          id: tenantId,
          name: validatedData.schoolName,
          subdomain: validatedData.schoolName.toLowerCase().replace(/\s+/g, '-'),
          features: ['digital_library', 'calendar', 'assignments', 'analytics'],
          subscription: 'trial',
          settings: {
            county: validatedData.county,
            subcounty: validatedData.subcounty,
            schoolType: validatedData.schoolType,
            studentCount: validatedData.studentCount,
            phoneNumber: validatedData.phoneNumber
          }
        })
        .returning();

      res.status(201).json({
        success: true,
        school: {
          id: newTenant[0].id,
          name: newTenant[0].name,
          subdomain: newTenant[0].subdomain
        },
        message: 'School registration initiated. Admin account will be created next.'
      });
    } catch (error) {
      console.error('School signup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get available counties
  app.get('/api/auth/counties', (req: Request, res: Response) => {
    const kenyanCounties = [
      'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu',
      'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
      'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
      'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
      'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
      'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
      'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
      'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
    ];

    res.json({ counties: kenyanCounties });
  });
}