import { pgTable, varchar, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Family accounts table for managing multiple children under one parent account
export const familyAccounts = pgTable("family_accounts", {
  id: varchar("id").primaryKey().notNull(),
  parentId: varchar("parent_id").notNull(), // References users.id
  familyName: varchar("family_name").notNull(),
  subscriptionPlan: varchar("subscription_plan").default("basic"), // basic, premium, family
  maxChildren: integer("max_children").default(3),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Child profiles within family accounts
export const childProfiles = pgTable("child_profiles", {
  id: varchar("id").primaryKey().notNull(),
  familyAccountId: varchar("family_account_id").references(() => familyAccounts.id).notNull(),
  childUserId: varchar("child_user_id").references(() => users.id),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  birthDate: varchar("birth_date").notNull(),
  gradeLevel: varchar("grade_level"),
  avatar: varchar("avatar"),
  preferences: jsonb("preferences").default({}),
  parentalControls: jsonb("parental_controls").default({}),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Verification requests for age-restricted signups
export const verificationRequests = pgTable("verification_requests", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  verificationType: varchar("verification_type").notNull(), // "parent_phone", "phone", "email"
  contactMethod: varchar("contact_method").notNull(), // phone number or email
  verificationCode: varchar("verification_code").notNull(),
  isVerified: boolean("is_verified").default(false),
  expiresAt: timestamp("expires_at").notNull(),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// School demonstration requests
export const schoolDemoRequests = pgTable("school_demo_requests", {
  id: varchar("id").primaryKey().notNull(),
  schoolName: varchar("school_name").notNull(),
  contactName: varchar("contact_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone").notNull(),
  role: varchar("role").notNull(),
  schoolType: varchar("school_type").notNull(),
  location: varchar("location").notNull(),
  studentPopulation: varchar("student_population").notNull(),
  gradeRange: varchar("grade_range").notNull(),
  hasComputerLab: varchar("has_computer_lab").notNull(),
  currentTechnology: varchar("current_technology").notNull(),
  curriculum: varchar("curriculum").notNull(),
  painPoints: text("pain_points").notNull(),
  budget: varchar("budget").notNull(),
  timeline: varchar("timeline").notNull(),
  status: varchar("status").default("pending"), // pending, contacted, scheduled, completed
  priority: varchar("priority").default("medium"), // low, medium, high
  assignedTo: varchar("assigned_to"), // sales rep ID
  scheduledDate: timestamp("scheduled_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Account signup requests (pending verification)
export const signupRequests = pgTable("signup_requests", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").notNull(),
  hashedPassword: varchar("hashed_password").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  birthDate: varchar("birth_date"),
  accountType: varchar("account_type").notNull(), // "student", "parent", "tutor", "family"
  gradeLevel: varchar("grade_level"),
  phone: varchar("phone"),
  parentName: varchar("parent_name"),
  parentPhone: varchar("parent_phone"),
  childData: jsonb("child_data"), // For family accounts
  verificationRequired: boolean("verification_required").default(true),
  isVerified: boolean("is_verified").default(false),
  tenantId: varchar("tenant_id").default("default"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

// Import users table reference (assuming it exists)
import { users } from "../schema";

export type FamilyAccount = typeof familyAccounts.$inferSelect;
export type InsertFamilyAccount = typeof familyAccounts.$inferInsert;

export type ChildProfile = typeof childProfiles.$inferSelect;
export type InsertChildProfile = typeof childProfiles.$inferInsert;

export type VerificationRequest = typeof verificationRequests.$inferSelect;
export type InsertVerificationRequest = typeof verificationRequests.$inferInsert;

export type SchoolDemoRequest = typeof schoolDemoRequests.$inferSelect;
export type InsertSchoolDemoRequest = typeof schoolDemoRequests.$inferInsert;

export type SignupRequest = typeof signupRequests.$inferSelect;
export type InsertSignupRequest = typeof signupRequests.$inferInsert;

// Validation schemas
export const familyAccountSchema = createInsertSchema(familyAccounts);
export const childProfileSchema = createInsertSchema(childProfiles);
export const verificationRequestSchema = createInsertSchema(verificationRequests);
export const schoolDemoRequestSchema = createInsertSchema(schoolDemoRequests);
export const signupRequestSchema = createInsertSchema(signupRequests);

// Age verification schema
export const ageVerificationSchema = z.object({
  birthDate: z.string().min(1, "Birth date is required"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
});

// Student signup schema (13-17)
export const studentSignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  parentPhone: z.string().min(10, "Valid parent phone number required"),
  parentName: z.string().min(2, "Parent name is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  birthDate: z.string().min(1, "Birth date is required"),
  agreeToTerms: z.boolean().refine(val => val, "You must agree to the terms"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Adult signup schema (18+)
export const adultSignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  phone: z.string().min(10, "Valid phone number required"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  birthDate: z.string().min(1, "Birth date is required"),
  accountType: z.enum(["student", "parent", "tutor"]),
  agreeToTerms: z.boolean().refine(val => val, "You must agree to the terms"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Parent signup for child schema
export const parentChildSignupSchema = z.object({
  parentEmail: z.string().email("Invalid email address"),
  parentPassword: z.string().min(8, "Password must be at least 8 characters"),
  parentPhone: z.string().min(10, "Valid phone number required"),
  parentFirstName: z.string().min(2, "First name is required"),
  parentLastName: z.string().min(2, "Last name is required"),
  childFirstName: z.string().min(2, "Child's first name is required"),
  childLastName: z.string().min(2, "Child's last name is required"),
  childBirthDate: z.string().min(1, "Child's birth date is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  agreeToTerms: z.boolean().refine(val => val, "You must agree to the terms"),
});

// School demo request schema
export const schoolDemoRequestValidationSchema = z.object({
  schoolName: z.string().min(2, "School name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  role: z.string().min(1, "Please select your role"),
  schoolType: z.string().min(1, "Please select school type"),
  location: z.string().min(2, "Location is required"),
  studentPopulation: z.string().min(1, "Student population is required"),
  gradeRange: z.string().min(1, "Grade range is required"),
  hasComputerLab: z.string().min(1, "Please specify if you have a computer lab"),
  currentTechnology: z.string().min(1, "Please describe current technology"),
  curriculum: z.string().min(1, "Curriculum type is required"),
  painPoints: z.string().min(10, "Please describe your main challenges"),
  budget: z.string().min(1, "Budget range is required"),
  timeline: z.string().min(1, "Implementation timeline is required"),
});

export type AgeVerificationForm = z.infer<typeof ageVerificationSchema>;
export type StudentSignupForm = z.infer<typeof studentSignupSchema>;
export type AdultSignupForm = z.infer<typeof adultSignupSchema>;
export type ParentChildSignupForm = z.infer<typeof parentChildSignupSchema>;
export type SchoolDemoForm = z.infer<typeof schoolDemoRequestValidationSchema>;