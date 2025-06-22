import { pgTable, text, timestamp, boolean, integer, json, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").default("info"), // 'info', 'success', 'warning', 'error', 'announcement'
  category: text("category"), // 'academic', 'administrative', 'social', 'system'
  priority: text("priority").default("normal"), // 'low', 'normal', 'high', 'urgent'
  recipientId: text("recipient_id"),
  recipientType: text("recipient_type"), // 'user', 'role', 'class', 'tenant'
  senderId: text("sender_id"),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  actionUrl: text("action_url"),
  actionLabel: text("action_label"),
  expiresAt: timestamp("expires_at"),
  metadata: json("metadata").default({}),
  tenantId: text("tenant_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  subject: text("subject"),
  content: text("content").notNull(),
  type: text("type").default("direct"), // 'direct', 'broadcast', 'class', 'group'
  senderId: text("sender_id").notNull(),
  recipientId: text("recipient_id"),
  recipientType: text("recipient_type"), // 'user', 'class', 'group', 'tenant'
  parentMessageId: integer("parent_message_id"), // for replies
  attachments: json("attachments").default([]),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  isArchived: boolean("is_archived").default(false),
  isImportant: boolean("is_important").default(false),
  deliveryStatus: text("delivery_status").default("sent"), // 'sent', 'delivered', 'read', 'failed'
  tenantId: text("tenant_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").default("general"), // 'general', 'academic', 'event', 'emergency'
  priority: text("priority").default("normal"), // 'low', 'normal', 'high', 'urgent'
  targetAudience: text("target_audience").array().default([]), // roles, classes, groups
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  expiresAt: timestamp("expires_at"),
  attachments: json("attachments").default([]),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  comments: json("comments").default([]),
  authorId: text("author_id").notNull(),
  tenantId: text("tenant_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").default("academic"), // 'academic', 'social', 'administrative', 'sports', 'cultural'
  location: text("location"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isAllDay: boolean("is_all_day").default(false),
  recurrence: json("recurrence").default({}),
  attendees: text("attendees").array().default([]),
  requiredFor: text("required_for").array().default([]), // roles, classes, groups
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  registrationRequired: boolean("registration_required").default(false),
  registrationDeadline: timestamp("registration_deadline"),
  status: text("status").default("scheduled"), // 'scheduled', 'ongoing', 'completed', 'cancelled'
  organizerId: text("organizer_id").notNull(),
  tenantId: text("tenant_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;