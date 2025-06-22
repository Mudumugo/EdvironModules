import { pgTable, text, timestamp, boolean, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").notNull().default("student"),
  tenantId: text("tenant_id").notNull(),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  permissions: text("permissions").array(),
  preferences: json("preferences").default({}),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  passwordHash: text("password_hash"),
  emailVerified: boolean("email_verified").default(false),
  phoneNumber: text("phone_number"),
  dateOfBirth: text("date_of_birth"),
  county: text("county"),
  city: text("city"),
  institution: text("institution"),
  gradeLevel: text("grade_level"),
  parentEmail: text("parent_email"),
  parentPhone: text("parent_phone"),
  emergencyContact: text("emergency_contact"),
  address: text("address"),
  enrollmentDate: timestamp("enrollment_date"),
  graduationDate: timestamp("graduation_date"),
  studentId: text("student_id"),
  teacherLicense: text("teacher_license"),
  subjects: text("subjects").array(),
  qualifications: text("qualifications").array(),
  experience: integer("experience"),
  bio: text("bio"),
  socialLinks: json("social_links").default({}),
  achievements: json("achievements").default([]),
  certifications: json("certifications").default([]),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;