import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  decimal,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "./user.schema";
import { institutions } from "./education.schema";

// Subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  institutionId: varchar("institution_id").notNull().references(() => institutions.id),
  planName: varchar("plan_name").notNull(),
  planType: varchar("plan_type").notNull(), // basic, premium, enterprise
  status: varchar("status").notNull(), // active, inactive, suspended
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  maxUsers: integer("max_users"),
  maxStorage: integer("max_storage"), // in GB
  features: jsonb("features").default([]),
  billing: jsonb("billing").default({}),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Activity logs
export const activityLogs = pgTable("activity_logs", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id").references(() => users.id),
  institutionId: varchar("institution_id").references(() => institutions.id),
  action: varchar("action").notNull(),
  entityType: varchar("entity_type"), // user, class, resource, etc.
  entityId: varchar("entity_id"),
  details: jsonb("details").default({}),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // info, warning, success, error
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  data: jsonb("data").default({}),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Locker items for personal workspace
export const lockerItems = pgTable("locker_items", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id),
  collectionId: integer("collection_id"),
  title: varchar("title").notNull(),
  type: varchar("type").notNull(), // note, bookmark, file, resource
  content: text("content"),
  url: varchar("url"),
  fileUrl: varchar("file_url"),
  thumbnailUrl: varchar("thumbnail_url"),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type"),
  tags: jsonb("tags").default([]),
  isPrivate: boolean("is_private").default(false),
  isFavorite: boolean("is_favorite").default(false),
  isArchived: boolean("is_archived").default(false),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Locker collections
export const lockerCollections = pgTable("locker_collections", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  description: text("description"),
  color: varchar("color"),
  icon: varchar("icon"),
  isPrivate: boolean("is_private").default(false),
  sortOrder: integer("sort_order").default(0),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export types
export type InsertSubscription = typeof subscriptions.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type InsertLockerItem = typeof lockerItems.$inferInsert;
export type LockerItem = typeof lockerItems.$inferSelect;
export type InsertLockerCollection = typeof lockerCollections.$inferInsert;
export type LockerCollection = typeof lockerCollections.$inferSelect;

// Insert schemas for validation
export const insertNotificationSchema = createInsertSchema(notifications);