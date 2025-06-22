import { pgTable, text, timestamp, boolean, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tenants = pgTable("tenants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'school', 'district', 'organization'
  domain: text("domain"),
  settings: json("settings").default({}),
  subscription: json("subscription").default({}),
  features: text("features").array().default([]),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  address: text("address"),
  county: text("county"),
  region: text("region"),
  country: text("country").default("Kenya"),
  timezone: text("timezone").default("Africa/Nairobi"),
  language: text("language").default("en"),
  currency: text("currency").default("KES"),
  logoUrl: text("logo_url"),
  website: text("website"),
  description: text("description"),
  studentCapacity: integer("student_capacity"),
  teacherCapacity: integer("teacher_capacity"),
  establishedYear: integer("established_year"),
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