import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  jsonb,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "./core";

// CRM Leads
export const leads = pgTable("leads", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  age: integer("age"),
  accountType: varchar("account_type").notNull(), // individual, family, school
  interests: text("interests").array().default([]),
  location: text("location"),
  source: varchar("source").notNull(), // website, referral, cold_call, etc.
  status: varchar("status").notNull().default("new"), // new, contacted, qualified, closed_won, closed_lost
  priority: varchar("priority").default("medium"), // low, medium, high
  notes: text("notes"),
  assignedTo: varchar("assigned_to").references(() => users.id),
  estimatedValue: decimal("estimated_value", { precision: 10, scale: 2 }),
  nextFollowUp: timestamp("next_follow_up"),
  lastContactDate: timestamp("last_contact_date"),
  metadata: jsonb("metadata").default({}),
  tenantId: varchar("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lead Activities
export const leadActivities = pgTable("lead_activities", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  leadId: integer("lead_id").notNull().references(() => leads.id),
  userId: varchar("user_id").references(() => users.id),
  type: varchar("type").notNull(), // call, email, meeting, note, task
  subject: varchar("subject").notNull(),
  description: text("description"),
  date: timestamp("date").defaultNow(),
  duration: integer("duration"), // in minutes
  outcome: varchar("outcome"), // completed, cancelled, rescheduled
  nextAction: varchar("next_action"),
  nextActionDate: timestamp("next_action_date"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Demo Requests
export const demoRequests = pgTable("demo_requests", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  organization: varchar("organization").notNull(),
  role: varchar("role").notNull(),
  numberOfStudents: integer("number_of_students"),
  preferredDate: timestamp("preferred_date"),
  preferredTime: varchar("preferred_time"),
  message: text("message"),
  status: varchar("status").default("pending"), // pending, scheduled, completed, cancelled
  priority: varchar("priority").default("medium"), // low, medium, high
  assignedTo: varchar("assigned_to").references(() => users.id),
  scheduledDate: timestamp("scheduled_date"),
  notes: text("notes"),
  tenantId: varchar("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertLeadSchema = createInsertSchema(leads);
export const insertLeadActivitySchema = createInsertSchema(leadActivities);
export const insertDemoRequestSchema = createInsertSchema(demoRequests);

// Export types
export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
export type LeadActivity = typeof leadActivities.$inferSelect;
export type InsertLeadActivity = typeof leadActivities.$inferInsert;
export type DemoRequest = typeof demoRequests.$inferSelect;
export type InsertDemoRequest = typeof demoRequests.$inferInsert;