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
  role: varchar("role").notNull().default("student"),
  institutionId: varchar("institution_id"),
  tenantId: varchar("tenant_id").notNull(),
  gradeLevel: varchar("grade_level"),
  department: varchar("department"),
  permissions: text("permissions").array().default([]),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
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
  
  // Non-teaching staff
  OFFICE_STAFF: "office_staff",
  RECEPTIONIST: "receptionist",
  SECRETARY: "secretary",
  REGISTRAR: "registrar",
  ACCOUNTANT: "accountant",
  FINANCE_OFFICER: "finance_officer",
  CUSTODIAN: "custodian",
  MAINTENANCE_STAFF: "maintenance_staff",
  GROUNDSKEEPER: "groundskeeper",
  CAFETERIA_STAFF: "cafeteria_staff",
  KITCHEN_MANAGER: "kitchen_manager",
  BUS_DRIVER: "bus_driver",
  TRANSPORT_COORDINATOR: "transport_coordinator",
  NURSE: "nurse",
  HEALTH_AIDE: "health_aide",
  PSYCHOLOGIST: "psychologist",
  SOCIAL_WORKER: "social_worker",
  SPEECH_THERAPIST: "speech_therapist",
  OCCUPATIONAL_THERAPIST: "occupational_therapist",
  SPECIAL_EDUCATION_AIDE: "special_education_aide",
  TEACHING_ASSISTANT: "teaching_assistant",
  PARAPROFESSIONAL: "paraprofessional",
  MEDIA_SPECIALIST: "media_specialist",
  TECHNOLOGY_COORDINATOR: "technology_coordinator",
  ATHLETIC_DIRECTOR: "athletic_director",
  COACH: "coach",
  ACTIVITY_COORDINATOR: "activity_coordinator",
  
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
  CONFIGURE_SYSTEMS: "configure_systems",
  MANAGE_NETWORK: "manage_network",
  INSTALL_SOFTWARE: "install_software",
  
  // Security permissions
  VIEW_ACCESS_LOGS: "view_access_logs",
  MANAGE_SECURITY_POLICIES: "manage_security_policies",
  MONITOR_ACTIVITIES: "monitor_activities",
  MANAGE_SECURITY: "manage_security",
  
  // PBX Communication permissions
  MANAGE_PBX: "manage_pbx",
  EMERGENCY_BROADCAST: "emergency_broadcast",
  PAGE_DEVICES: "page_devices",
  VIEW_CALL_LOGS: "view_call_logs",
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

// Timetable schema
export const timetableEntries = pgTable("timetable_entries", {
  id: serial("id").primaryKey(),
  subjectName: varchar("subject_name", { length: 255 }).notNull(),
  teacherId: varchar("teacher_id", { length: 255 }).notNull(),
  teacherName: varchar("teacher_name", { length: 255 }).notNull(),
  classId: varchar("class_id", { length: 255 }).notNull(),
  className: varchar("class_name", { length: 255 }).notNull(),
  room: varchar("room", { length: 100 }).notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0=Sunday, 1=Monday, etc.
  startTime: varchar("start_time", { length: 10 }).notNull(), // HH:MM format
  endTime: varchar("end_time", { length: 10 }).notNull(), // HH:MM format
  duration: integer("duration").notNull(), // in minutes
  semester: varchar("semester", { length: 50 }).notNull(),
  academicYear: varchar("academic_year", { length: 20 }).notNull(),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  tenantId: varchar("tenant_id", { length: 255 }).default("default"),
});

// Classes schema
export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  grade: varchar("grade", { length: 20 }),
  section: varchar("section", { length: 10 }),
  capacity: integer("capacity").default(30),
  teacherId: varchar("teacher_id", { length: 255 }),
  teacherName: varchar("teacher_name", { length: 255 }),
  academicYear: varchar("academic_year", { length: 20 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  tenantId: varchar("tenant_id", { length: 255 }).default("default"),
});

export type InsertTimetableEntry = typeof timetableEntries.$inferInsert;
export type TimetableEntry = typeof timetableEntries.$inferSelect;
export type InsertClass = typeof classes.$inferInsert;
export type Class = typeof classes.$inferSelect;

export const insertTimetableEntrySchema = createInsertSchema(timetableEntries);
export const insertClassSchema = createInsertSchema(classes);

// Digital Notebook Schema
export const notebooks = pgTable("notebooks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  userId: varchar("user_id", { length: 255 }).notNull(),
  isShared: boolean("is_shared").default(false),
  sharedWith: text("shared_with").array(), // Array of user IDs who can access
  color: varchar("color", { length: 20 }).default("#3b82f6"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  tenantId: varchar("tenant_id", { length: 255 }).default("default"),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  notebookId: integer("notebook_id").notNull().references(() => notebooks.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 20 }).default("#3b82f6"),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  chapterId: integer("chapter_id").notNull().references(() => chapters.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull().references(() => topics.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"), // Rich text content
  contentType: varchar("content_type", { length: 50 }).default("richtext"), // richtext, markdown, plain
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const stickyNotes = pgTable("sticky_notes", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").notNull().references(() => pages.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  color: varchar("color", { length: 20 }).default("#fbbf24"),
  positionX: integer("position_x").default(0),
  positionY: integer("position_y").default(0),
  width: integer("width").default(200),
  height: integer("height").default(150),
  userId: varchar("user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Locker items for saving annotated library resources
export const lockerItems = pgTable("locker_items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  itemType: varchar("item_type", { length: 50 }).notNull(), // 'notebook', 'resource', 'bookmark'
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  originalResourceId: integer("original_resource_id"),
  content: text("content"),
  annotations: jsonb("annotations"),
  metadata: jsonb("metadata"),
  fileUrl: varchar("file_url", { length: 500 }),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  tags: text("tags").array(),
  category: varchar("category", { length: 100 }),
  subject: varchar("subject", { length: 100 }),
  gradeLevel: varchar("grade_level", { length: 50 }),
  isPrivate: boolean("is_private").default(true),
  isOfflineAvailable: boolean("is_offline_available").default(false),
  sizeMb: decimal("size_mb", { precision: 10, scale: 2 }),
  views: integer("views").default(0),
  lastAccessed: timestamp("last_accessed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  tenantId: varchar("tenant_id", { length: 255 }).default("default"),
});

// Relations
export const notebooksRelations = relations(notebooks, ({ many }) => ({
  subjects: many(subjects),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  notebook: one(notebooks, {
    fields: [subjects.notebookId],
    references: [notebooks.id],
  }),
  chapters: many(chapters),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [chapters.subjectId],
    references: [subjects.id],
  }),
  topics: many(topics),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [topics.chapterId],
    references: [chapters.id],
  }),
  pages: many(pages),
}));

export const pagesRelations = relations(pages, ({ one, many }) => ({
  topic: one(topics, {
    fields: [pages.topicId],
    references: [topics.id],
  }),
  stickyNotes: many(stickyNotes),
}));

export const stickyNotesRelations = relations(stickyNotes, ({ one }) => ({
  page: one(pages, {
    fields: [stickyNotes.pageId],
    references: [pages.id],
  }),
}));

// Types
export type InsertNotebook = typeof notebooks.$inferInsert;
export type Notebook = typeof notebooks.$inferSelect;
export type InsertSubject = typeof subjects.$inferInsert;
export type Subject = typeof subjects.$inferSelect;
export type InsertChapter = typeof chapters.$inferInsert;
export type Chapter = typeof chapters.$inferSelect;
export type InsertTopic = typeof topics.$inferInsert;
export type Topic = typeof topics.$inferSelect;
export type InsertPage = typeof pages.$inferInsert;
export type Page = typeof pages.$inferSelect;
export type InsertStickyNote = typeof stickyNotes.$inferInsert;
export type StickyNote = typeof stickyNotes.$inferSelect;
export type InsertLockerItem = typeof lockerItems.$inferInsert;
export type LockerItem = typeof lockerItems.$inferSelect;

// Schemas
export const insertNotebookSchema = createInsertSchema(notebooks);
export const insertSubjectSchema = createInsertSchema(subjects);
export const insertChapterSchema = createInsertSchema(chapters);
export const insertTopicSchema = createInsertSchema(topics);
export const insertPageSchema = createInsertSchema(pages);
export const insertStickyNoteSchema = createInsertSchema(stickyNotes);

export const insertLibraryResourceSchema = z.object({});
export const insertScheduleSchema = z.object({});
export const insertAttendanceSchema = z.object({});
export const insertNotificationSchema = z.object({});