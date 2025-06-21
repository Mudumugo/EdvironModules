import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  serial,
  integer,
  boolean,
  decimal,
  date,
  unique,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "./core";

// Notification system
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  tenantId: varchar("tenant_id").notNull(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type").notNull(), // info, warning, error, success
  category: varchar("category"), // assignment, announcement, system, etc.
  data: jsonb("data").default({}),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  priority: varchar("priority").default("normal"), // low, normal, high, urgent
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Calendar and events
export const events = pgTable("events", {
  id: varchar("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  allDay: boolean("all_day").default(false),
  location: varchar("location"),
  organizerId: varchar("organizer_id").references(() => users.id),
  tenantId: varchar("tenant_id").notNull(),
  type: varchar("type").notNull(), // class, meeting, deadline, holiday, etc.
  category: varchar("category"), // academic, administrative, social, etc.
  isRecurring: boolean("is_recurring").default(false),
  recurrenceRule: jsonb("recurrence_rule"),
  attendees: text("attendees").array().default([]),
  tags: text("tags").array().default([]),
  color: varchar("color").default("#3B82F6"),
  isPublic: boolean("is_public").default(false),
  reminders: jsonb("reminders").default([]),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Apps hub
export const apps = pgTable("apps", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  subcategory: varchar("subcategory"),
  icon: varchar("icon"),
  url: varchar("url"),
  isInternal: boolean("is_internal").default(false),
  isActive: boolean("is_active").default(true),
  requiredPermissions: text("required_permissions").array().default([]),
  targetAudience: text("target_audience").array().default([]), // students, teachers, admins
  gradeLevel: varchar("grade_level"),
  pricing: varchar("pricing"), // free, freemium, paid
  developer: varchar("developer"),
  version: varchar("version"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  installCount: integer("install_count").default(0),
  tags: text("tags").array().default([]),
  screenshots: text("screenshots").array().default([]),
  features: text("features").array().default([]),
  systemRequirements: jsonb("system_requirements").default({}),
  privacyPolicy: varchar("privacy_policy"),
  termsOfService: varchar("terms_of_service"),
  supportContact: varchar("support_contact"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Communication system
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().notNull(),
  title: varchar("title"),
  type: varchar("type").notNull(), // direct, group, broadcast
  tenantId: varchar("tenant_id").notNull(),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  participants: text("participants").array().default([]),
  isActive: boolean("is_active").default(true),
  lastMessageAt: timestamp("last_message_at"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().notNull(),
  conversationId: varchar("conversation_id").references(() => conversations.id).notNull(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  type: varchar("type").default("text"), // text, image, file, system
  attachments: text("attachments").array().default([]),
  metadata: jsonb("metadata").default({}),
  isEdited: boolean("is_edited").default(false),
  editedAt: timestamp("edited_at"),
  replyToId: varchar("reply_to_id"),
  reactions: jsonb("reactions").default({}),
  readBy: jsonb("read_by").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics and tracking
export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id),
  tenantId: varchar("tenant_id").notNull(),
  sessionId: varchar("session_id"),
  eventType: varchar("event_type").notNull(),
  eventName: varchar("event_name").notNull(),
  properties: jsonb("properties").default({}),
  page: varchar("page"),
  referrer: varchar("referrer"),
  userAgent: varchar("user_agent"),
  ipAddress: varchar("ip_address"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Device management
export const devices = pgTable("devices", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id),
  tenantId: varchar("tenant_id").notNull(),
  deviceId: varchar("device_id").notNull(),
  deviceName: varchar("device_name"),
  deviceType: varchar("device_type"), // mobile, tablet, desktop
  platform: varchar("platform"), // ios, android, web, windows, mac
  browserName: varchar("browser_name"),
  browserVersion: varchar("browser_version"),
  osName: varchar("os_name"),
  osVersion: varchar("os_version"),
  isActive: boolean("is_active").default(true),
  lastSeenAt: timestamp("last_seen_at").defaultNow(),
  firstSeenAt: timestamp("first_seen_at").defaultNow(),
  location: jsonb("location").default({}),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export types
export type Notification = typeof notifications.$inferSelect;
export type Event = typeof events.$inferSelect;
export type App = typeof apps.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type Device = typeof devices.$inferSelect;

// Insert types
export type InsertNotification = typeof notifications.$inferInsert;
export type InsertEvent = typeof events.$inferInsert;
export type InsertApp = typeof apps.$inferInsert;
export type InsertConversation = typeof conversations.$inferInsert;
export type InsertMessage = typeof messages.$inferInsert;
export type InsertAnalyticsEvent = typeof analyticsEvents.$inferInsert;
export type InsertDevice = typeof devices.$inferInsert;

// Zod schemas
export const insertNotificationSchema = createInsertSchema(notifications);
export const insertEventSchema = createInsertSchema(events);
export const insertAppSchema = createInsertSchema(apps);
export const insertConversationSchema = createInsertSchema(conversations);
export const insertMessageSchema = createInsertSchema(messages);
export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents);
export const insertDeviceSchema = createInsertSchema(devices);