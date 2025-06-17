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
import { users } from "./user.schema";
import { institutions } from "./education.schema";

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
  targetType: varchar("target_type").notNull(), // user, group, device_type, all
  targetIds: jsonb("target_ids").default([]),
  policyType: varchar("policy_type").notNull(), // app_restriction, content_filter, screen_time, location
  rules: jsonb("rules").notNull(),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(1),
  effectiveFrom: timestamp("effective_from"),
  effectiveTo: timestamp("effective_to"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Device compliance violations
export const complianceViolations = pgTable("compliance_violations", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  policyId: integer("policy_id").references(() => devicePolicies.id),
  violationType: varchar("violation_type").notNull(), // unauthorized_app, location_violation, usage_exceeded
  severity: varchar("severity").notNull(), // low, medium, high, critical
  description: text("description"),
  detectedAt: timestamp("detected_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  status: varchar("status").default("open"), // open, acknowledged, resolved, false_positive
  resolvedBy: varchar("resolved_by").references(() => users.id),
  actionTaken: text("action_taken"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Device activities/audit log
export const deviceActivities = pgTable("device_activities", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  activityType: varchar("activity_type").notNull(), // app_usage, location_change, policy_violation, login, logout
  appName: varchar("app_name"),
  category: varchar("category"),
  duration: integer("duration"), // in minutes
  dataUsed: decimal("data_used"), // in MB
  location: jsonb("location").default({}),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata").default({}),
});

// Screen time tracking
export const screenTimeRecords = pgTable("screen_time_records", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  date: timestamp("date").notNull(),
  totalScreenTime: integer("total_screen_time"), // in minutes
  educationalTime: integer("educational_time"), // in minutes
  entertainmentTime: integer("entertainment_time"), // in minutes
  socialTime: integer("social_time"), // in minutes
  appBreakdown: jsonb("app_breakdown").default({}),
  categoryBreakdown: jsonb("category_breakdown").default({}),
  peakUsageHours: jsonb("peak_usage_hours").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content filtering logs
export const contentFilterLogs = pgTable("content_filter_logs", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  url: text("url"),
  domain: varchar("domain"),
  category: varchar("category"),
  action: varchar("action").notNull(), // allowed, blocked, warned
  reason: text("reason"),
  riskScore: integer("risk_score"),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata").default({}),
});

// Remote actions log
export const remoteActions = pgTable("remote_actions", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  actionType: varchar("action_type").notNull(), // lock, wipe, locate, install_app, remove_app, push_policy
  initiatedBy: varchar("initiated_by").references(() => users.id).notNull(),
  status: varchar("status").default("pending"), // pending, success, failed, timeout
  parameters: jsonb("parameters").default({}),
  result: text("result"),
  error: text("error"),
  initiatedAt: timestamp("initiated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Export types
export type Device = typeof devices.$inferSelect;
export type InsertDevice = typeof devices.$inferInsert;
export type DevicePolicy = typeof devicePolicies.$inferSelect;
export type InsertDevicePolicy = typeof devicePolicies.$inferInsert;
export type ComplianceViolation = typeof complianceViolations.$inferSelect;
export type InsertComplianceViolation = typeof complianceViolations.$inferInsert;
export type DeviceActivity = typeof deviceActivities.$inferSelect;
export type InsertDeviceActivity = typeof deviceActivities.$inferInsert;
export type ScreenTimeRecord = typeof screenTimeRecords.$inferSelect;
export type InsertScreenTimeRecord = typeof screenTimeRecords.$inferInsert;
export type ContentFilterLog = typeof contentFilterLogs.$inferSelect;
export type InsertContentFilterLog = typeof contentFilterLogs.$inferInsert;
export type RemoteAction = typeof remoteActions.$inferSelect;
export type InsertRemoteAction = typeof remoteActions.$inferInsert;

// Insert schemas for validation
export const insertDeviceSchema = createInsertSchema(devices);
export const insertDevicePolicySchema = createInsertSchema(devicePolicies);
export const insertComplianceViolationSchema = createInsertSchema(complianceViolations);
export const insertDeviceActivitySchema = createInsertSchema(deviceActivities);
export const insertScreenTimeRecordSchema = createInsertSchema(screenTimeRecords);
export const insertContentFilterLogSchema = createInsertSchema(contentFilterLogs);
export const insertRemoteActionSchema = createInsertSchema(remoteActions);