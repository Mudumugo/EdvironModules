import { pgTable, text, timestamp, boolean, integer, json, serial, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// CRM - Leads management
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  company: varchar("company"),
  position: varchar("position"),
  source: varchar("source").default("website"), // website, referral, event, cold_call, etc.
  status: varchar("status").default("new"), // new, contacted, qualified, proposal, negotiation, closed_won, closed_lost
  score: integer("score").default(0), // Lead scoring 0-100
  notes: text("notes"),
  lastContactDate: timestamp("last_contact_date"),
  nextFollowUpDate: timestamp("next_follow_up_date"),
  estimatedValue: integer("estimated_value"), // in cents
  probability: integer("probability").default(50), // 0-100%
  assignedTo: varchar("assigned_to"),
  tags: text("tags").array().default([]),
  customFields: json("custom_fields").default({}),
  tenantId: varchar("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CRM - Lead activities tracking
export const leadActivities = pgTable("lead_activities", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(),
  type: varchar("type").notNull(), // call, email, meeting, note, task, etc.
  subject: varchar("subject"),
  description: text("description"),
  outcome: varchar("outcome"), // completed, scheduled, cancelled, no_answer, etc.
  duration: integer("duration"), // in minutes
  scheduledFor: timestamp("scheduled_for"),
  completedAt: timestamp("completed_at"),
  createdBy: varchar("created_by").notNull(),
  metadata: json("metadata").default({}),
  tenantId: varchar("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CRM - Demo requests table
export const demoRequests = pgTable("demo_requests", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  organization: varchar("organization"),
  role: varchar("role"),
  numberOfStudents: integer("number_of_students"),
  preferredDate: timestamp("preferred_date"),
  preferredTime: varchar("preferred_time"),
  message: text("message"),
  status: varchar("status").default("pending"), // pending, scheduled, completed, cancelled
  assignedTo: varchar("assigned_to"),
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  tenantId: varchar("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CRM Relations
export const leadsRelations = relations(leads, ({ many }) => ({
  activities: many(leadActivities),
}));

export const leadActivitiesRelations = relations(leadActivities, ({ one }) => ({
  lead: one(leads, {
    fields: [leadActivities.leadId],
    references: [leads.id],
  }),
}));

// CRM Insert schemas
export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadActivitySchema = createInsertSchema(leadActivities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDemoRequestSchema = createInsertSchema(demoRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// CRM Types
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type LeadActivity = typeof leadActivities.$inferSelect;
export type InsertLeadActivity = z.infer<typeof insertLeadActivitySchema>;
export type DemoRequest = typeof demoRequests.$inferSelect;
export type InsertDemoRequest = z.infer<typeof insertDemoRequestSchema>;