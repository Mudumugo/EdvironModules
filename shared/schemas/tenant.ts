import { pgTable, text, timestamp, boolean, integer, json, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;