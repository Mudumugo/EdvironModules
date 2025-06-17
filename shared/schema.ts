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
// User role definitions
export const USER_ROLES = {
  // Student roles by education level
  STUDENT_ELEMENTARY: "student_elementary",
  STUDENT_MIDDLE: "student_middle", 
  STUDENT_HIGH: "student_high",
  STUDENT_COLLEGE: "student_college",
  
  // Educational staff
  TEACHER: "teacher",
  TUTOR: "tutor",
  PRINCIPAL: "principal",
  VICE_PRINCIPAL: "vice_principal",
  COUNSELOR: "counselor",
  LIBRARIAN: "librarian",
  
  // Administrative staff
  SCHOOL_ADMIN: "school_admin",
  SCHOOL_SECURITY: "school_security",
  SCHOOL_IT_STAFF: "school_it_staff",
  
  // Family
  PARENT: "parent"
} as const;

export const GRADE_LEVELS = {
  // Elementary
  KINDERGARTEN: "K",
  GRADE_1: "1", GRADE_2: "2", GRADE_3: "3", GRADE_4: "4", GRADE_5: "5",
  
  // Middle School
  GRADE_6: "6", GRADE_7: "7", GRADE_8: "8",
  
  // High School
  GRADE_9: "9", GRADE_10: "10", GRADE_11: "11", GRADE_12: "12",
  
  // College
  COLLEGE_YEAR_1: "College Year 1",
  COLLEGE_YEAR_2: "College Year 2", 
  COLLEGE_YEAR_3: "College Year 3",
  COLLEGE_YEAR_4: "College Year 4",
  GRADUATE: "Graduate"
} as const;

export const PERMISSIONS = {
  // Student permissions
  VIEW_OWN_GRADES: "view_own_grades",
  SUBMIT_ASSIGNMENTS: "submit_assignments",
  JOIN_VIRTUAL_CLASSES: "join_virtual_classes",
  ACCESS_LIBRARY: "access_library",
  VIEW_SCHEDULE: "view_schedule",
  
  // Teacher permissions
  MANAGE_CLASSES: "manage_classes",
  GRADE_ASSIGNMENTS: "grade_assignments",
  CREATE_ASSIGNMENTS: "create_assignments",
  MANAGE_ATTENDANCE: "manage_attendance",
  VIEW_STUDENT_RECORDS: "view_student_records",
  CONDUCT_LIVE_SESSIONS: "conduct_live_sessions",
  
  // Admin permissions
  MANAGE_USERS: "manage_users",
  MANAGE_SCHOOL_SETTINGS: "manage_school_settings",
  VIEW_ALL_ANALYTICS: "view_all_analytics",
  MANAGE_DEVICES: "manage_devices",
  MANAGE_LICENSING: "manage_licensing",
  
  // IT Staff permissions
  MANAGE_DEVICES: "manage_devices",
  CONFIGURE_SYSTEMS: "configure_systems",
  MANAGE_NETWORK: "manage_network",
  INSTALL_SOFTWARE: "install_software",
  
  // Security permissions
  VIEW_ACCESS_LOGS: "view_access_logs",
  MANAGE_SECURITY_POLICIES: "manage_security_policies",
  MONITOR_ACTIVITIES: "monitor_activities",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type GradeLevel = typeof GRADE_LEVELS[keyof typeof GRADE_LEVELS];
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUserSettings = typeof userSettings.$inferInsert;
export type UserSettings = typeof userSettings.$inferSelect;

// Insert schemas for validation
export const insertUserSettingsSchema = createInsertSchema(userSettings);

// Temporary simplified schemas to prevent compilation errors
// Re-export xAPI schemas
export * from "./schemas/xapi.schema";
export * from "./schemas/education.schema";
export * from "./schemas/mdm.schema";
export * from "./schemas/activity.schema";

export const insertStudentSchema = z.object({});
export const insertTeacherSchema = z.object({});
export const insertClassSchema = z.object({});
export const insertSubjectSchema = z.object({});
export const insertLibraryResourceSchema = z.object({});
export const insertScheduleSchema = z.object({});
export const insertAttendanceSchema = z.object({});
export const insertNotificationSchema = z.object({});