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
  notifications: jsonb("notifications").default({}),
  privacy: jsonb("privacy").default({}),
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
  IT_STAFF: "it_staff",
  SECURITY_STAFF: "security_staff",
  
  // Demo accounts
  DEMO_STUDENT_ELEMENTARY: "demo_student_elementary",
  
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
  SECURITY_VIEW: "security_view",
  SECURITY_MANAGE: "security_manage",
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

// Library schemas removed from here - using education.schema instead
export type InsertUserSettings = typeof userSettings.$inferInsert;
export type UserSettings = typeof userSettings.$inferSelect;

// Insert schemas for validation
export const insertUserSettingsSchema = createInsertSchema(userSettings);

// Remove duplicate library definitions - they're imported from education.schema

// Re-export schemas
export * from "./schemas/xapi.schema";
export * from "./schemas/education.schema";
export * from "./schemas/mdm.schema";
export * from "./schemas/activity.schema";
export * from "./schemas/signup.schema";

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

// School Calendar System
export const calendarEvents = pgTable("calendar_events", {
  id: text("id").primaryKey().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventType: varchar("event_type", { length: 50 }).notNull(), // 'meeting', 'holiday', 'exam', 'assembly', 'parent_conference', 'sports', 'cultural'
  startDateTime: timestamp("start_date_time").notNull(),
  endDateTime: timestamp("end_date_time").notNull(),
  isAllDay: boolean("is_all_day").default(false),
  location: varchar("location", { length: 255 }),
  organizerId: varchar("organizer_id", { length: 255 }).notNull(),
  tenantId: varchar("tenant_id", { length: 255 }).notNull(),
  
  // Visibility and targeting
  visibility: varchar("visibility", { length: 20 }).notNull().default("public"), // 'public', 'private', 'restricted'
  targetAudience: varchar("target_audience", { length: 50 }).notNull().default("all"), // 'all', 'staff', 'students', 'parents', 'specific_roles', 'specific_users'
  priority: varchar("priority", { length: 20 }).notNull().default("normal"), // 'low', 'normal', 'high', 'urgent'
  
  // Recurrence
  isRecurring: boolean("is_recurring").default(false),
  recurrencePattern: jsonb("recurrence_pattern"), // {type: 'daily|weekly|monthly|yearly', interval: 1, endDate: '2024-12-31', daysOfWeek: [1,2,3]}
  parentEventId: varchar("parent_event_id", { length: 255 }), // For recurring event instances
  
  // Metadata
  tags: jsonb("tags").default([]), // ['academic', 'sports', 'cultural', 'administrative']
  attachments: jsonb("attachments").default([]), // [{name: 'agenda.pdf', url: '/files/...', type: 'pdf'}]
  requiresRSVP: boolean("requires_rsvp").default(false),
  maxAttendees: integer("max_attendees"),
  
  // Status and approval
  status: varchar("status", { length: 20 }).notNull().default("active"), // 'draft', 'active', 'cancelled', 'completed'
  approvalStatus: varchar("approval_status", { length: 20 }).notNull().default("approved"), // 'pending', 'approved', 'rejected'
  approvedBy: varchar("approved_by", { length: 255 }),
  approvedAt: timestamp("approved_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
});

export const eventParticipants = pgTable("event_participants", {
  id: text("id").primaryKey().notNull(),
  eventId: varchar("event_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  participantType: varchar("participant_type", { length: 20 }).notNull(), // 'organizer', 'required', 'optional', 'attendee'
  rsvpStatus: varchar("rsvp_status", { length: 20 }).default("pending"), // 'pending', 'accepted', 'declined', 'tentative'
  rsvpResponse: text("rsvp_response"), // Optional message from participant
  rsvpAt: timestamp("rsvp_at"),
  remindersSent: jsonb("reminders_sent").default([]), // [{type: 'email', sentAt: '2024-01-01T10:00:00Z'}]
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const eventRoleTargets = pgTable("event_role_targets", {
  id: text("id").primaryKey().notNull(),
  eventId: varchar("event_id", { length: 255 }).notNull(),
  targetType: varchar("target_type", { length: 20 }).notNull(), // 'role', 'grade', 'department', 'class'
  targetValue: varchar("target_value", { length: 100 }).notNull(), // 'teacher', 'student', 'parent', 'grade_10', 'math_dept', 'class_10a'
  isRequired: boolean("is_required").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventReminders = pgTable("event_reminders", {
  id: text("id").primaryKey().notNull(),
  eventId: varchar("event_id", { length: 255 }).notNull(),
  reminderType: varchar("reminder_type", { length: 20 }).notNull(), // 'email', 'sms', 'push', 'in_app'
  reminderTime: varchar("reminder_time", { length: 50 }).notNull(), // '15_minutes', '1_hour', '1_day', '1_week'
  isActive: boolean("is_active").default(true),
  customMessage: text("custom_message"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventTemplates = pgTable("event_templates", {
  id: text("id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  defaultDuration: integer("default_duration").notNull(), // in minutes
  defaultLocation: varchar("default_location", { length: 255 }),
  defaultTargetAudience: varchar("default_target_audience", { length: 50 }).notNull(),
  defaultPriority: varchar("default_priority", { length: 20 }).notNull(),
  defaultTags: jsonb("default_tags").default([]),
  requiresApproval: boolean("requires_approval").default(false),
  tenantId: varchar("tenant_id", { length: 255 }).notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
});

// Relations
export const calendarEventsRelations = relations(calendarEvents, ({ one, many }) => ({
  organizer: one(users, {
    fields: [calendarEvents.organizerId],
    references: [users.id],
  }),
  participants: many(eventParticipants),
  roleTargets: many(eventRoleTargets),
  reminders: many(eventReminders),
  parentEvent: one(calendarEvents, {
    fields: [calendarEvents.parentEventId],
    references: [calendarEvents.id],
  }),
  childEvents: many(calendarEvents),
}));

export const eventParticipantsRelations = relations(eventParticipants, ({ one }) => ({
  event: one(calendarEvents, {
    fields: [eventParticipants.eventId],
    references: [calendarEvents.id],
  }),
  user: one(users, {
    fields: [eventParticipants.userId],
    references: [users.id],
  }),
}));

export const eventRoleTargetsRelations = relations(eventRoleTargets, ({ one }) => ({
  event: one(calendarEvents, {
    fields: [eventRoleTargets.eventId],
    references: [calendarEvents.id],
  }),
}));

export const eventRemindersRelations = relations(eventReminders, ({ one }) => ({
  event: one(calendarEvents, {
    fields: [eventReminders.eventId],
    references: [calendarEvents.id],
  }),
}));

export const eventTemplatesRelations = relations(eventTemplates, ({ one }) => ({
  creator: one(users, {
    fields: [eventTemplates.createdBy],
    references: [users.id],
  }),
}));

// Types
export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = typeof calendarEvents.$inferInsert;
export type EventParticipant = typeof eventParticipants.$inferSelect;
export type InsertEventParticipant = typeof eventParticipants.$inferInsert;
export type EventRoleTarget = typeof eventRoleTargets.$inferSelect;
export type InsertEventRoleTarget = typeof eventRoleTargets.$inferInsert;
export type EventReminder = typeof eventReminders.$inferSelect;
export type InsertEventReminder = typeof eventReminders.$inferInsert;
export type EventTemplate = typeof eventTemplates.$inferSelect;
export type InsertEventTemplate = typeof eventTemplates.$inferInsert;

// Validation schemas
export const insertCalendarEventSchema = createInsertSchema(calendarEvents).extend({
  recurrencePattern: z.object({
    type: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    interval: z.number().min(1),
    endDate: z.string().optional(),
    daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
    dayOfMonth: z.number().min(1).max(31).optional(),
    monthOfYear: z.number().min(1).max(12).optional(),
  }).optional(),
  tags: z.array(z.string()).default([]),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string(),
    type: z.string(),
    size: z.number().optional(),
  })).default([]),
});

export const insertEventParticipantSchema = createInsertSchema(eventParticipants);
export const insertEventRoleTargetSchema = createInsertSchema(eventRoleTargets);
export const insertEventReminderSchema = createInsertSchema(eventReminders);
export const insertEventTemplateSchema = createInsertSchema(eventTemplates);

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

// Re-export activity logs from dedicated schema
export { activityLogs, type InsertActivityLog, type ActivityLog } from "@shared/schemas/activity.schema";

// Library insert schemas will be imported from education.schema
export const insertScheduleSchema = z.object({});
export const insertAttendanceSchema = z.object({});
export const insertNotificationSchema = z.object({});

// Security and Surveillance schemas
export const securityZones = pgTable("security_zones", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  location: varchar("location").notNull(),
  isActive: boolean("is_active").default(true),
  riskLevel: varchar("risk_level").notNull().default("low"), // low, medium, high, critical
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const securityCameras = pgTable("security_cameras", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  zoneId: varchar("zone_id").references(() => securityZones.id),
  ipAddress: varchar("ip_address").notNull(),
  streamUrl: varchar("stream_url"),
  isOnline: boolean("is_online").default(false),
  isRecording: boolean("is_recording").default(false),
  resolution: varchar("resolution").default("1080p"),
  orientation: varchar("orientation").default("horizontal"), // horizontal, vertical
  hasAudio: boolean("has_audio").default(false),
  lastPing: timestamp("last_ping"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const securityEvents = pgTable("security_events", {
  id: varchar("id").primaryKey(),
  type: varchar("type").notNull(), // intrusion, violence, theft, vandalism, suspicious_activity
  title: varchar("title").notNull(),
  severity: varchar("severity").notNull(), // low, medium, high, critical
  status: varchar("status").notNull().default("active"), // active, investigating, resolved, false_alarm
  zoneId: varchar("zone_id").references(() => securityZones.id),
  cameraId: varchar("camera_id").references(() => securityCameras.id),
  description: text("description").notNull(),
  reportedBy: varchar("reported_by").notNull(),
  occurredAt: timestamp("occurred_at").defaultNow(),
  detectedAt: timestamp("detected_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  assignedTo: varchar("assigned_to"),
  imageUrl: varchar("image_url"),
  videoUrl: varchar("video_url"),
  metadata: jsonb("metadata"), // AI detection confidence, person count, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const visitorRegistrations = pgTable("visitor_registrations", {
  id: varchar("id").primaryKey(),
  visitorName: varchar("visitor_name").notNull(),
  visitorPhone: varchar("visitor_phone"),
  visitorEmail: varchar("visitor_email"),
  visitPurpose: varchar("visit_purpose").notNull(),
  hostName: varchar("host_name").notNull(),
  hostDepartment: varchar("host_department"),
  checkInTime: timestamp("check_in_time").defaultNow(),
  checkOutTime: timestamp("check_out_time"),
  expectedDuration: integer("expected_duration"), // in minutes
  status: varchar("status").notNull().default("checked_in"), // checked_in, checked_out, overstayed
  idType: varchar("id_type"), // drivers_license, passport, etc.
  idNumber: varchar("id_number"),
  photoUrl: varchar("photo_url"),
  badgeNumber: varchar("badge_number"),
  gateUsed: varchar("gate_used").notNull(),
  securityNotes: text("security_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const securityCalls = pgTable("security_calls", {
  id: varchar("id").primaryKey(),
  callType: varchar("call_type").notNull(), // emergency, routine, maintenance
  fromExtension: varchar("from_extension"),
  toExtension: varchar("to_extension"),
  fromZone: varchar("from_zone").references(() => securityZones.id),
  toZone: varchar("to_zone").references(() => securityZones.id),
  duration: integer("duration"), // in seconds
  status: varchar("status").notNull(), // ringing, active, completed, missed, busy
  priority: varchar("priority").notNull().default("normal"), // low, normal, high, emergency
  notes: text("notes"),
  recordingUrl: varchar("recording_url"),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const securityZonesRelations = relations(securityZones, ({ many }) => ({
  cameras: many(securityCameras),
  events: many(securityEvents),
}));

export const securityCamerasRelations = relations(securityCameras, ({ one, many }) => ({
  zone: one(securityZones, {
    fields: [securityCameras.zoneId],
    references: [securityZones.id],
  }),
  events: many(securityEvents),
}));

export const securityEventsRelations = relations(securityEvents, ({ one }) => ({
  zone: one(securityZones, {
    fields: [securityEvents.zoneId],
    references: [securityZones.id],
  }),
  camera: one(securityCameras, {
    fields: [securityEvents.cameraId],
    references: [securityCameras.id],
  }),
}));

// Types
export type SecurityZone = typeof securityZones.$inferSelect;
export type InsertSecurityZone = typeof securityZones.$inferInsert;
export type SecurityCamera = typeof securityCameras.$inferSelect;
export type InsertSecurityCamera = typeof securityCameras.$inferInsert;
export type SecurityEvent = typeof securityEvents.$inferSelect;
export type InsertSecurityEvent = typeof securityEvents.$inferInsert;
export type VisitorRegistration = typeof visitorRegistrations.$inferSelect;
export type InsertVisitorRegistration = typeof visitorRegistrations.$inferInsert;
export type SecurityCall = typeof securityCalls.$inferSelect;
export type InsertSecurityCall = typeof securityCalls.$inferInsert;

// Zod schemas
export const insertSecurityZoneSchema = createInsertSchema(securityZones);
export const insertSecurityCameraSchema = createInsertSchema(securityCameras);
export const insertSecurityEventSchema = createInsertSchema(securityEvents);
export const insertVisitorRegistrationSchema = createInsertSchema(visitorRegistrations);
export const insertSecurityCallSchema = createInsertSchema(securityCalls);

// Live class session management tables
export const liveSessions = pgTable("live_sessions", {
  id: varchar("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  teacherId: varchar("teacher_id").notNull().references(() => users.id),
  classId: varchar("class_id").notNull(),
  sessionType: varchar("session_type").notNull().default("lecture"), // lecture, review, lab, discussion, office-hours
  status: varchar("status").notNull().default("scheduled"), // scheduled, live, paused, ended, cancelled
  scheduledTime: timestamp("scheduled_time").notNull(),
  actualStartTime: timestamp("actual_start_time"),
  actualEndTime: timestamp("actual_end_time"),
  duration: integer("duration").notNull().default(60), // in minutes
  maxParticipants: integer("max_participants").default(50),
  currentParticipants: integer("current_participants").default(0),
  recordingEnabled: boolean("recording_enabled").default(true),
  recordingUrl: varchar("recording_url"),
  screenSharingEnabled: boolean("screen_sharing_enabled").default(true),
  deviceControlEnabled: boolean("device_control_enabled").default(true),
  chatEnabled: boolean("chat_enabled").default(true),
  settings: jsonb("settings").default({}), // session-specific settings
  tenantId: varchar("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sessionParticipants = pgTable("session_participants", {
  id: varchar("id").primaryKey().notNull(),
  sessionId: varchar("session_id").notNull().references(() => liveSessions.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id),
  deviceId: varchar("device_id").notNull(),
  role: varchar("role").notNull().default("student"), // teacher, student, observer
  status: varchar("status").notNull().default("offline"), // online, offline, away, disconnected
  joinedAt: timestamp("joined_at"),
  leftAt: timestamp("left_at"),
  totalDuration: integer("total_duration").default(0), // in seconds
  deviceInfo: jsonb("device_info").default({}), // browser, OS, screen resolution, etc.
  connectionQuality: varchar("connection_quality").default("good"), // excellent, good, fair, poor
  isAudioMuted: boolean("is_audio_muted").default(true),
  isVideoMuted: boolean("is_video_muted").default(true),
  isScreenSharing: boolean("is_screen_sharing").default(false),
  canBeControlled: boolean("can_be_controlled").default(false), // for device control
  lastActivity: timestamp("last_activity").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deviceSessions = pgTable("device_sessions", {
  id: varchar("id").primaryKey().notNull(),
  deviceId: varchar("device_id").notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: varchar("session_id").references(() => liveSessions.id),
  deviceType: varchar("device_type").notNull(), // desktop, tablet, mobile, smart_board
  platform: varchar("platform").notNull(), // windows, macos, ios, android, chromeos
  browser: varchar("browser"), // chrome, firefox, safari, edge
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  screenResolution: varchar("screen_resolution"),
  capabilities: jsonb("capabilities").default({}), // screen sharing, camera, microphone, etc.
  isControlled: boolean("is_controlled").default(false),
  controlledBy: varchar("controlled_by").references(() => users.id),
  lastHeartbeat: timestamp("last_heartbeat").defaultNow(),
  status: varchar("status").notNull().default("active"), // active, inactive, suspended
  tenantId: varchar("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const screenSharingSessions = pgTable("screen_sharing_sessions", {
  id: varchar("id").primaryKey().notNull(),
  sessionId: varchar("session_id").notNull().references(() => liveSessions.id, { onDelete: "cascade" }),
  presenterId: varchar("presenter_id").notNull().references(() => users.id),
  presenterDeviceId: varchar("presenter_device_id").notNull(),
  shareType: varchar("share_type").notNull(), // screen, window, application, whiteboard
  isActive: boolean("is_active").default(true),
  viewers: text("viewers").array().default([]), // array of user IDs
  quality: varchar("quality").default("medium"), // low, medium, high, ultra
  streamUrl: varchar("stream_url"),
  recordingEnabled: boolean("recording_enabled").default(false),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  metadata: jsonb("metadata").default({}), // resolution, fps, bitrate, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const deviceControlActions = pgTable("device_control_actions", {
  id: varchar("id").primaryKey().notNull(),
  sessionId: varchar("session_id").notNull().references(() => liveSessions.id, { onDelete: "cascade" }),
  controllerId: varchar("controller_id").notNull().references(() => users.id),
  targetDeviceId: varchar("target_device_id").notNull(),
  targetUserId: varchar("target_user_id").notNull().references(() => users.id),
  actionType: varchar("action_type").notNull(), // lock_screen, unlock_screen, restrict_apps, allow_apps, send_message, remote_control
  actionData: jsonb("action_data").default({}), // specific action parameters
  status: varchar("status").notNull().default("pending"), // pending, executed, failed, cancelled
  executedAt: timestamp("executed_at"),
  responseData: jsonb("response_data").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations for live sessions
export const liveSessionsRelations = relations(liveSessions, ({ one, many }) => ({
  teacher: one(users, {
    fields: [liveSessions.teacherId],
    references: [users.id],
  }),
  participants: many(sessionParticipants),
  screenSharingSessions: many(screenSharingSessions),
  deviceControlActions: many(deviceControlActions),
}));

export const sessionParticipantsRelations = relations(sessionParticipants, ({ one }) => ({
  session: one(liveSessions, {
    fields: [sessionParticipants.sessionId],
    references: [liveSessions.id],
  }),
  user: one(users, {
    fields: [sessionParticipants.userId],
    references: [users.id],
  }),
}));

export const deviceSessionsRelations = relations(deviceSessions, ({ one }) => ({
  user: one(users, {
    fields: [deviceSessions.userId],
    references: [users.id],
  }),
  session: one(liveSessions, {
    fields: [deviceSessions.sessionId],
    references: [liveSessions.id],
  }),
  controller: one(users, {
    fields: [deviceSessions.controlledBy],
    references: [users.id],
  }),
}));

export const screenSharingSessionsRelations = relations(screenSharingSessions, ({ one }) => ({
  session: one(liveSessions, {
    fields: [screenSharingSessions.sessionId],
    references: [liveSessions.id],
  }),
  presenter: one(users, {
    fields: [screenSharingSessions.presenterId],
    references: [users.id],
  }),
}));

export const deviceControlActionsRelations = relations(deviceControlActions, ({ one }) => ({
  session: one(liveSessions, {
    fields: [deviceControlActions.sessionId],
    references: [liveSessions.id],
  }),
  controller: one(users, {
    fields: [deviceControlActions.controllerId],
    references: [users.id],
  }),
  targetUser: one(users, {
    fields: [deviceControlActions.targetUserId],
    references: [users.id],
  }),
}));

// Types for live sessions
export type LiveSession = typeof liveSessions.$inferSelect;
export type InsertLiveSession = typeof liveSessions.$inferInsert;
export type SessionParticipant = typeof sessionParticipants.$inferSelect;
export type InsertSessionParticipant = typeof sessionParticipants.$inferInsert;
export type DeviceSession = typeof deviceSessions.$inferSelect;
export type InsertDeviceSession = typeof deviceSessions.$inferInsert;
export type ScreenSharingSession = typeof screenSharingSessions.$inferSelect;
export type InsertScreenSharingSession = typeof screenSharingSessions.$inferInsert;
export type DeviceControlAction = typeof deviceControlActions.$inferSelect;
export type InsertDeviceControlAction = typeof deviceControlActions.$inferInsert;

// Zod schemas for live sessions
export const insertLiveSessionSchema = createInsertSchema(liveSessions);
export const insertSessionParticipantSchema = createInsertSchema(sessionParticipants);
export const insertDeviceSessionSchema = createInsertSchema(deviceSessions);
export const insertScreenSharingSessionSchema = createInsertSchema(screenSharingSessions);
export const insertDeviceControlActionSchema = createInsertSchema(deviceControlActions);

// CRM - Leads table for managing signups and potential customers
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  age: integer("age"),
  accountType: varchar("account_type").notNull(), // individual, family, school
  interests: jsonb("interests"), // array of interest strings
  location: varchar("location"), // location string
  source: varchar("source").default("website"), // website, referral, social, etc
  status: varchar("status").default("new"), // new, contacted, qualified, converted, lost
  priority: varchar("priority").default("medium"), // low, medium, high
  assignedTo: varchar("assigned_to"), // user ID of assigned sales rep
  notes: text("notes"),
  lastContactDate: timestamp("last_contact_date"),
  nextFollowUpDate: timestamp("next_follow_up_date"),
  convertedAt: timestamp("converted_at"),
  tenantId: varchar("tenant_id").notNull(),
  metadata: jsonb("metadata"), // Additional form data from signup
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CRM - Activities table for tracking interactions with leads
export const leadActivities = pgTable("lead_activities", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  type: varchar("type").notNull(), // call, email, meeting, note, status_change
  subject: varchar("subject").notNull(),
  description: text("description"),
  outcome: varchar("outcome"), // successful, no_answer, left_message, etc
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  createdBy: varchar("created_by").notNull(), // user ID
  tenantId: varchar("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// CRM - Demo requests table
export const demoRequests = pgTable("demo_requests", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  organization: varchar("organization"),
  role: varchar("role"),
  numberOfStudents: integer("number_of_students"),
  preferredDate: timestamp("preferred_date"),
  preferredTime: varchar("preferred_time"),
  message: text("message"),
  status: varchar("status").default("pending"), // pending, scheduled, completed, cancelled
  assignedTo: varchar("assigned_to"),
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  tenantId: varchar("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CRM Relations
export const leadsRelations = relations(leads, ({ many }) => ({
  activities: many(leadActivities),
}));

export const leadActivitiesRelations = relations(leadActivities, ({ one }) => ({
  lead: one(leads, {
    fields: [leadActivities.leadId],
    references: [leads.id],
  }),
}));

// CRM Types
export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
export type LeadActivity = typeof leadActivities.$inferSelect;
export type InsertLeadActivity = typeof leadActivities.$inferInsert;
export type DemoRequest = typeof demoRequests.$inferSelect;
export type InsertDemoRequest = typeof demoRequests.$inferInsert;

// CRM Zod schemas for validation
export const insertLeadSchema = createInsertSchema(leads);
export const insertLeadActivitySchema = createInsertSchema(leadActivities);
export const insertDemoRequestSchema = createInsertSchema(demoRequests);