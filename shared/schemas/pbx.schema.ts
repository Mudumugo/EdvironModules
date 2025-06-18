import { pgTable, serial, varchar, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// PBX Extensions table - manages user phone extensions
export const pbxExtensions = pgTable("pbx_extensions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  extension: varchar("extension", { length: 10 }).notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  department: varchar("department", { length: 50 }),
  location: varchar("location", { length: 100 }),
  deviceType: varchar("device_type", { length: 30 }).default("softphone"), // softphone, desk_phone, mobile
  status: varchar("status", { length: 20 }).default("offline"), // online, offline, busy, dnd
  lastActivity: timestamp("last_activity").defaultNow(),
  isActive: boolean("is_active").default(true),
  permissions: jsonb("permissions").default({}), // call permissions, recording, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Call logs for tracking all calls
export const callLogs = pgTable("call_logs", {
  id: serial("id").primaryKey(),
  callId: varchar("call_id", { length: 50 }).notNull().unique(),
  fromExtension: varchar("from_extension", { length: 10 }),
  toExtension: varchar("to_extension", { length: 10 }),
  fromNumber: varchar("from_number", { length: 20 }),
  toNumber: varchar("to_number", { length: 20 }),
  callType: varchar("call_type", { length: 20 }).notNull(), // internal, external, emergency, broadcast
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in seconds
  status: varchar("status", { length: 20 }).notNull(), // answered, missed, busy, failed
  recordingUrl: varchar("recording_url", { length: 255 }),
  tenantId: varchar("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Emergency broadcasts and announcements
export const emergencyBroadcasts = pgTable("emergency_broadcasts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  message: text("message").notNull(),
  priority: varchar("priority", { length: 10 }).default("medium"), // low, medium, high, critical
  broadcastType: varchar("broadcast_type", { length: 20 }).notNull(), // announcement, emergency, page
  targetExtensions: jsonb("target_extensions").default([]), // specific extensions or "all"
  targetDepartments: jsonb("target_departments").default([]),
  initiatedBy: varchar("initiated_by").notNull(),
  status: varchar("status", { length: 20 }).default("pending"), // pending, active, completed, cancelled
  scheduledTime: timestamp("scheduled_time"),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  audioFileUrl: varchar("audio_file_url", { length: 255 }),
  tenantId: varchar("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// PBX system configuration
export const pbxConfig = pgTable("pbx_config", {
  id: serial("id").primaryKey(),
  tenantId: varchar("tenant_id").notNull().unique(),
  asteriskServerUrl: varchar("asterisk_server_url", { length: 255 }).notNull(),
  sipDomain: varchar("sip_domain", { length: 100 }).notNull(),
  emergencyNumber: varchar("emergency_number", { length: 20 }).default("911"),
  recordAllCalls: boolean("record_all_calls").default(false),
  maxExtensions: integer("max_extensions").default(1000),
  extensionRange: jsonb("extension_range").default({ start: 1000, end: 9999 }),
  dialPlan: jsonb("dial_plan").default({}),
  settings: jsonb("settings").default({}),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Conference rooms for group calls
export const conferenceRooms = pgTable("conference_rooms", {
  id: serial("id").primaryKey(),
  roomNumber: varchar("room_number", { length: 20 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  maxParticipants: integer("max_participants").default(10),
  requirePin: boolean("require_pin").default(false),
  pin: varchar("pin", { length: 10 }),
  isRecorded: boolean("is_recorded").default(false),
  createdBy: varchar("created_by").notNull(),
  status: varchar("status", { length: 20 }).default("inactive"), // active, inactive
  tenantId: varchar("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Import users table reference
import { users } from "../schema";

export type InsertPbxExtension = typeof pbxExtensions.$inferInsert;
export type PbxExtension = typeof pbxExtensions.$inferSelect;
export type InsertCallLog = typeof callLogs.$inferInsert;
export type CallLog = typeof callLogs.$inferSelect;
export type InsertEmergencyBroadcast = typeof emergencyBroadcasts.$inferInsert;
export type EmergencyBroadcast = typeof emergencyBroadcasts.$inferSelect;
export type InsertPbxConfig = typeof pbxConfig.$inferInsert;
export type PbxConfig = typeof pbxConfig.$inferSelect;
export type InsertConferenceRoom = typeof conferenceRooms.$inferInsert;
export type ConferenceRoom = typeof conferenceRooms.$inferSelect;

// Zod schemas for validation
export const insertPbxExtensionSchema = createInsertSchema(pbxExtensions);
export const insertCallLogSchema = createInsertSchema(callLogs);
export const insertEmergencyBroadcastSchema = createInsertSchema(emergencyBroadcasts);
export const insertPbxConfigSchema = createInsertSchema(pbxConfig);
export const insertConferenceRoomSchema = createInsertSchema(conferenceRooms);