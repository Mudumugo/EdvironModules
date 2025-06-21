import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { devices } from "./devices";
import { users } from "../user.schema";

// Device compliance checks
export const deviceComplianceChecks = pgTable("device_compliance_checks", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  checkType: varchar("check_type").notNull(), // passcode, encryption, jailbreak, app_compliance
  result: varchar("result").notNull(), // compliant, non_compliant, unknown
  details: jsonb("details").default({}),
  checkedAt: timestamp("checked_at").defaultNow(),
  nextCheckDue: timestamp("next_check_due"),
  remediation: text("remediation"),
  severity: varchar("severity").default("medium"), // low, medium, high, critical
});

// Device location history
export const deviceLocationHistory = pgTable("device_location_history", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  latitude: varchar("latitude").notNull(),
  longitude: varchar("longitude").notNull(),
  accuracy: integer("accuracy"),
  source: varchar("source").default("gps"), // gps, wifi, cellular, manual
  recordedAt: timestamp("recorded_at").defaultNow(),
  isWithinGeofence: boolean("is_within_geofence").default(true),
  geofenceId: varchar("geofence_id"),
});

// App installation history
export const appInstallationHistory = pgTable("app_installation_history", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  appId: varchar("app_id").notNull(),
  appName: varchar("app_name").notNull(),
  appVersion: varchar("app_version"),
  bundleId: varchar("bundle_id"),
  action: varchar("action").notNull(), // installed, uninstalled, updated
  triggeredBy: varchar("triggered_by").default("user"), // user, policy, admin
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata").default({}),
});

// Remote actions
export const deviceRemoteActions = pgTable("device_remote_actions", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  actionType: varchar("action_type").notNull(), // lock, unlock, wipe, locate, ring
  requestedBy: varchar("requested_by").references(() => users.id).notNull(),
  requestedAt: timestamp("requested_at").defaultNow(),
  executedAt: timestamp("executed_at"),
  status: varchar("status").default("pending"), // pending, executing, completed, failed
  result: jsonb("result").default({}),
  errorMessage: text("error_message"),
  metadata: jsonb("metadata").default({}),
});

// Insert schemas
export const insertDeviceComplianceCheckSchema = createInsertSchema(deviceComplianceChecks);
export const insertDeviceLocationHistorySchema = createInsertSchema(deviceLocationHistory);
export const insertAppInstallationHistorySchema = createInsertSchema(appInstallationHistory);
export const insertDeviceRemoteActionSchema = createInsertSchema(deviceRemoteActions);