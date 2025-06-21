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
import { users } from "../user.schema";
import { institutions } from "../education.schema";

// Device management
export const devices = pgTable("devices", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id),
  institutionId: varchar("institution_id").references(() => institutions.id),
  deviceName: varchar("device_name").notNull(),
  deviceType: varchar("device_type").notNull(), // tablet, laptop, smartphone, desktop
  platform: varchar("platform").notNull(), // ios, android, windows, macos, linux
  osVersion: varchar("os_version"),
  model: varchar("model"),
  serialNumber: varchar("serial_number"),
  macAddress: varchar("mac_address"),
  imei: varchar("imei"),
  udid: varchar("udid"),
  status: varchar("status").notNull().default("active"), // active, inactive, lost, stolen, wiped
  enrollmentDate: timestamp("enrollment_date").defaultNow(),
  lastSeen: timestamp("last_seen"),
  location: jsonb("location").default({}), // { lat, lng, accuracy, timestamp }
  batteryLevel: integer("battery_level"),
  storageUsed: decimal("storage_used"),
  storageTotal: decimal("storage_total"),
  isSupervised: boolean("is_supervised").default(false),
  isCompliant: boolean("is_compliant").default(true),
  complianceIssues: jsonb("compliance_issues").default([]),
  installedApps: jsonb("installed_apps").default([]),
  restrictedApps: jsonb("restricted_apps").default([]),
  allowedApps: jsonb("allowed_apps").default([]),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Device policies
export const devicePolicies = pgTable("device_policies", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  institutionId: varchar("institution_id").references(() => institutions.id).notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  policyType: varchar("policy_type").notNull(), // security, app_control, content_filter, screen_time
  targetPlatforms: jsonb("target_platforms").default([]), // ios, android, windows, etc
  rules: jsonb("rules").notNull(),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(1),
  effectiveFrom: timestamp("effective_from").defaultNow(),
  effectiveTo: timestamp("effective_to"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Device policy assignments
export const devicePolicyAssignments = pgTable("device_policy_assignments", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  policyId: integer("policy_id").references(() => devicePolicies.id).notNull(),
  deviceId: varchar("device_id").references(() => devices.id),
  userId: varchar("user_id").references(() => users.id),
  groupId: varchar("group_id"), // For group-based assignments
  assignedAt: timestamp("assigned_at").defaultNow(),
  assignedBy: varchar("assigned_by").references(() => users.id),
  status: varchar("status").default("active"), // active, pending, failed
  lastApplied: timestamp("last_applied"),
  metadata: jsonb("metadata").default({}),
});

// Insert schemas
export const insertDeviceSchema = createInsertSchema(devices);
export const insertDevicePolicySchema = createInsertSchema(devicePolicies);
export const insertDevicePolicyAssignmentSchema = createInsertSchema(devicePolicyAssignments);