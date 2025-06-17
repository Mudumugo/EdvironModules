import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
  date,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Tenants table for multi-tenant support
export const tenants = pgTable("tenants", {
  id: varchar("id").primaryKey().notNull(),
  subdomain: varchar("subdomain").unique().notNull(),
  name: varchar("name").notNull(),
  logo: varchar("logo"),
  primaryColor: varchar("primary_color").default("#3B82F6"),
  customDomain: varchar("custom_domain"),
  features: text("features").array().default(["dashboard", "settings"]),
  subscription: varchar("subscription").notNull().default("basic"), // basic, premium, enterprise
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User storage table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User settings table
export const userSettings = pgTable("user_settings", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  theme: varchar("theme").default("light"),
  language: varchar("language").default("en"),
  notifications: jsonb("notifications").default({}),
  preferences: jsonb("preferences").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Simple schema exports for immediate functionality
export type InsertTenant = typeof tenants.$inferInsert;
export type Tenant = typeof tenants.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUserSettings = typeof userSettings.$inferInsert;
export type UserSettings = typeof userSettings.$inferSelect;

// Insert schemas for validation
export const insertUserSettingsSchema = createInsertSchema(userSettings);

// Temporary simplified schemas to prevent compilation errors
export const insertStudentSchema = z.object({});
export const insertTeacherSchema = z.object({});
export const insertClassSchema = z.object({});
export const insertSubjectSchema = z.object({});
export const insertLibraryResourceSchema = z.object({});
export const insertScheduleSchema = z.object({});
export const insertAttendanceSchema = z.object({});
export const insertNotificationSchema = z.object({});