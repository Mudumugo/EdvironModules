import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { tenants } from "./core";

// User storage table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  institutionId: varchar("institution_id"),
  tenantId: varchar("tenant_id").notNull(),
  role: varchar("role").notNull().default("student"),
  gradeLevel: varchar("grade_level"),
  department: varchar("department"),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User settings table
export const userSettings = pgTable("user_settings", {
  id: varchar("id").primaryKey().notNull().default("gen_random_uuid()"),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  notifications: text("notifications").default("{}"),
  privacy: text("privacy").default("{}"),
  preferences: text("preferences").default("{}"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  unique().on(table.userId),
]);

// User relations
export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
  settings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = typeof userSettings.$inferInsert;

// Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const insertUserSettingsSchema = createInsertSchema(userSettings);