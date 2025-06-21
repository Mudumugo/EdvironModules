import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "../user.schema";

// Institution management
export const institutions = pgTable("institutions", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // school, university, training center
  address: text("address"),
  contactEmail: varchar("contact_email"),
  contactPhone: varchar("contact_phone"),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Students
export const students = pgTable("students", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id").references(() => users.id),
  institutionId: varchar("institution_id").notNull().references(() => institutions.id),
  studentId: varchar("student_id").notNull(),
  grade: varchar("grade"),
  classId: integer("class_id"),
  enrollmentDate: timestamp("enrollment_date").defaultNow(),
  status: varchar("status").default("active"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Parent-Child relationships
export const parentChildRelationships = pgTable("parent_child_relationships", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  parentUserId: varchar("parent_user_id").notNull().references(() => users.id),
  childUserId: varchar("child_user_id").notNull().references(() => users.id),
  relationship: varchar("relationship").notNull(),
  isPrimary: boolean("is_primary").default(false),
  canPickup: boolean("can_pickup").default(true),
  emergencyContact: boolean("emergency_contact").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertInstitutionSchema = createInsertSchema(institutions);
export const insertStudentSchema = createInsertSchema(students);
export const insertParentChildRelationshipSchema = createInsertSchema(parentChildRelationships);