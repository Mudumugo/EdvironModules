import { pgTable, text, timestamp, boolean, integer, json, serial, varchar, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./user";

// School Calendar System
export const calendarEvents = pgTable("calendar_events", {
  id: text("id").primaryKey().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventType: varchar("event_type", { length: 50 }).notNull(), // 'meeting', 'holiday', 'exam', 'assembly', 'parent_conference', 'sports', 'cultural'
  startDateTime: timestamp("start_date_time").notNull(),
  endDateTime: timestamp("end_date_time").notNull(),
  isAllDay: boolean("is_all_day").default(false),
  location: varchar("location", { length: 255 }),
  organizerId: varchar("organizer_id", { length: 255 }).notNull(),
  tenantId: varchar("tenant_id", { length: 255 }).notNull(),
  
  // Visibility and targeting
  visibility: varchar("visibility", { length: 20 }).notNull().default("public"), // 'public', 'private', 'restricted'
  targetAudience: varchar("target_audience", { length: 50 }).notNull().default("all"), // 'all', 'staff', 'students', 'parents', 'specific_roles', 'specific_users'
  priority: varchar("priority", { length: 20 }).notNull().default("normal"), // 'low', 'normal', 'high', 'urgent'
  
  // Recurrence
  isRecurring: boolean("is_recurring").default(false),
  recurrencePattern: jsonb("recurrence_pattern"), // {type: 'daily|weekly|monthly|yearly', interval: 1, endDate: '2024-12-31', daysOfWeek: [1,2,3]}
  parentEventId: varchar("parent_event_id", { length: 255 }), // For recurring event instances
  
  // Metadata
  tags: jsonb("tags").default([]), // ['academic', 'sports', 'cultural', 'administrative']
  attachments: jsonb("attachments").default([]), // [{name: 'agenda.pdf', url: '/files/...', type: 'pdf'}]
  requiresRSVP: boolean("requires_rsvp").default(false),
  maxAttendees: integer("max_attendees"),
  
  // Status and approval
  status: varchar("status", { length: 20 }).notNull().default("active"), // 'draft', 'active', 'cancelled', 'completed'
  approvalStatus: varchar("approval_status", { length: 20 }).notNull().default("approved"), // 'pending', 'approved', 'rejected'
  approvedBy: varchar("approved_by", { length: 255 }),
  approvedAt: timestamp("approved_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
});

export const eventParticipants = pgTable("event_participants", {
  id: text("id").primaryKey().notNull(),
  eventId: varchar("event_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  participantType: varchar("participant_type", { length: 20 }).notNull(), // 'organizer', 'required', 'optional', 'attendee'
  rsvpStatus: varchar("rsvp_status", { length: 20 }).default("pending"), // 'pending', 'accepted', 'declined', 'tentative'
  rsvpResponse: text("rsvp_response"), // Optional message from participant
  rsvpAt: timestamp("rsvp_at"),
  remindersSent: jsonb("reminders_sent").default([]), // [{type: 'email', sentAt: '2024-01-01T10:00:00Z'}]
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const eventRoleTargets = pgTable("event_role_targets", {
  id: text("id").primaryKey().notNull(),
  eventId: varchar("event_id", { length: 255 }).notNull(),
  targetType: varchar("target_type", { length: 20 }).notNull(), // 'role', 'grade', 'department', 'class'
  targetValue: varchar("target_value", { length: 100 }).notNull(), // 'teacher', 'student', 'parent', 'grade_10', 'math_dept', 'class_10a'
  isRequired: boolean("is_required").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventReminders = pgTable("event_reminders", {
  id: text("id").primaryKey().notNull(),
  eventId: varchar("event_id", { length: 255 }).notNull(),
  reminderType: varchar("reminder_type", { length: 20 }).notNull(), // 'email', 'sms', 'push', 'in_app'
  reminderTime: varchar("reminder_time", { length: 50 }).notNull(), // '15_minutes', '1_hour', '1_day', '1_week'
  isActive: boolean("is_active").default(true),
  customMessage: text("custom_message"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventTemplates = pgTable("event_templates", {
  id: text("id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  defaultDuration: integer("default_duration").notNull(), // in minutes
  defaultLocation: varchar("default_location", { length: 255 }),
  defaultTargetAudience: varchar("default_target_audience", { length: 50 }).notNull(),
  defaultPriority: varchar("default_priority", { length: 20 }).notNull(),
  defaultTags: jsonb("default_tags").default([]),
  requiresApproval: boolean("requires_approval").default(false),
  tenantId: varchar("tenant_id", { length: 255 }).notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
});

// Relations
export const calendarEventsRelations = relations(calendarEvents, ({ one, many }) => ({
  organizer: one(users, {
    fields: [calendarEvents.organizerId],
    references: [users.id],
  }),
  participants: many(eventParticipants),
  roleTargets: many(eventRoleTargets),
  reminders: many(eventReminders),
  parentEvent: one(calendarEvents, {
    fields: [calendarEvents.parentEventId],
    references: [calendarEvents.id],
  }),
  childEvents: many(calendarEvents),
}));

export const eventParticipantsRelations = relations(eventParticipants, ({ one }) => ({
  event: one(calendarEvents, {
    fields: [eventParticipants.eventId],
    references: [calendarEvents.id],
  }),
  user: one(users, {
    fields: [eventParticipants.userId],
    references: [users.id],
  }),
}));

export const eventRoleTargetsRelations = relations(eventRoleTargets, ({ one }) => ({
  event: one(calendarEvents, {
    fields: [eventRoleTargets.eventId],
    references: [calendarEvents.id],
  }),
}));

export const eventRemindersRelations = relations(eventReminders, ({ one }) => ({
  event: one(calendarEvents, {
    fields: [eventReminders.eventId],
    references: [calendarEvents.id],
  }),
}));

export const eventTemplatesRelations = relations(eventTemplates, ({ one }) => ({
  creator: one(users, {
    fields: [eventTemplates.createdBy],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertEventParticipantSchema = createInsertSchema(eventParticipants).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertEventRoleTargetSchema = createInsertSchema(eventRoleTargets).omit({
  createdAt: true,
});

export const insertEventReminderSchema = createInsertSchema(eventReminders).omit({
  createdAt: true,
});

export const insertEventTemplateSchema = createInsertSchema(eventTemplates).omit({
  createdAt: true,
  updatedAt: true,
});

// Types
export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
export type EventParticipant = typeof eventParticipants.$inferSelect;
export type InsertEventParticipant = z.infer<typeof insertEventParticipantSchema>;
export type EventRoleTarget = typeof eventRoleTargets.$inferSelect;
export type InsertEventRoleTarget = z.infer<typeof insertEventRoleTargetSchema>;
export type EventReminder = typeof eventReminders.$inferSelect;
export type InsertEventReminder = z.infer<typeof insertEventReminderSchema>;
export type EventTemplate = typeof eventTemplates.$inferSelect;
export type InsertEventTemplate = z.infer<typeof insertEventTemplateSchema>;