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
  tenantId: varchar("tenant_id").references(() => tenants.id).notNull(),
  email: varchar("email"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("student"), // admin, teacher, student, parent, tutor
  institutionId: varchar("institution_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User settings table for storing payment keys and preferences
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  stripePublishableKey: varchar("stripe_publishable_key"),
  stripeSecretKey: varchar("stripe_secret_key"),
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(false),
  pushNotifications: boolean("push_notifications").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Institutions table
export const institutions = pgTable("institutions", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // school, university, training_center
  address: text("address"),
  phone: varchar("phone"),
  email: varchar("email"),
  website: varchar("website"),
  subscriptionTier: varchar("subscription_tier").notNull().default("basic"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Students table
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  institutionId: varchar("institution_id").notNull().references(() => institutions.id),
  studentId: varchar("student_id").notNull(), // school-assigned ID
  grade: varchar("grade"),
  class: varchar("class"),
  enrollmentDate: date("enrollment_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Teachers table
export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  institutionId: varchar("institution_id").notNull().references(() => institutions.id),
  employeeId: varchar("employee_id").notNull(),
  subjects: text("subjects").array(),
  qualifications: text("qualifications"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Classes table
export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  institutionId: varchar("institution_id").notNull().references(() => institutions.id),
  name: varchar("name").notNull(),
  grade: varchar("grade").notNull(),
  section: varchar("section"),
  teacherId: integer("teacher_id").references(() => teachers.id),
  maxStudents: integer("max_students").default(30),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subjects table
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  institutionId: varchar("institution_id").notNull().references(() => institutions.id),
  name: varchar("name").notNull(),
  code: varchar("code").notNull(),
  grade: varchar("grade"),
  curriculum: varchar("curriculum"), // CBC, IGCSE, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Digital Library Resources - Shared across tenants with curriculum-based filtering
export const libraryResources = pgTable("library_resources", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // book, video, quiz, simulation, etc.
  subjectId: integer("subject_id").references(() => subjects.id),
  grade: varchar("grade").notNull(), // K, 1-12, University, Adult
  curriculum: varchar("curriculum").notNull(), // CBC, IGCSE, IB, Common Core, etc.
  content: text("content"),
  fileUrl: varchar("file_url"),
  thumbnailUrl: varchar("thumbnail_url"),
  difficulty: varchar("difficulty").default("intermediate"), // beginner, intermediate, advanced
  prerequisites: text("prerequisites").array().default([]), // Required prior knowledge
  learningObjectives: text("learning_objectives").array().default([]), // What students will learn
  duration: integer("duration"), // Time in minutes
  accessTier: varchar("access_tier").notNull().default("basic"), // basic, premium, institutional
  isPublished: boolean("is_published").default(false),
  isSharedGlobally: boolean("is_shared_globally").default(true), // Available across all tenants
  tenantId: varchar("tenant_id").references(() => tenants.id), // Original creating tenant
  authorId: varchar("author_id").references(() => users.id),
  approvedBy: varchar("approved_by").references(() => users.id), // For quality control
  viewCount: integer("view_count").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  tags: text("tags").array().default([]),
  language: varchar("language").default("en"), // Content language
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schedules/Events table
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // class, exam, event, maintenance
  institutionId: varchar("institution_id").references(() => institutions.id),
  classId: integer("class_id").references(() => classes.id),
  subjectId: integer("subject_id").references(() => subjects.id),
  teacherId: integer("teacher_id").references(() => teachers.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: varchar("location"),
  isRecurring: boolean("is_recurring").default(false),
  recurrencePattern: varchar("recurrence_pattern"), // daily, weekly, monthly
  status: varchar("status").default("scheduled"), // scheduled, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Attendance table
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  scheduleId: integer("schedule_id").notNull().references(() => schedules.id),
  status: varchar("status").notNull(), // present, absent, late, excused
  checkedInAt: timestamp("checked_in_at"),
  checkedOutAt: timestamp("checked_out_at"),
  notes: text("notes"),
  recordedBy: varchar("recorded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subscriptions and Licensing
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  institutionId: varchar("institution_id").references(() => institutions.id),
  userId: varchar("user_id").references(() => users.id),
  planType: varchar("plan_type").notNull(), // institution, tutor, family, individual
  tier: varchar("tier").notNull(), // basic, premium, enterprise
  status: varchar("status").notNull().default("active"), // active, cancelled, expired, suspended
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  currency: varchar("currency").default("USD"),
  paymentMethod: varchar("payment_method"), // stripe, mpesa, etc.
  autoRenew: boolean("auto_renew").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics and Activity Tracking
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  institutionId: varchar("institution_id").references(() => institutions.id),
  action: varchar("action").notNull(),
  module: varchar("module").notNull(),
  resourceId: varchar("resource_id"),
  resourceType: varchar("resource_type"),
  metadata: jsonb("metadata"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// System notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  institutionId: varchar("institution_id").references(() => institutions.id),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type").notNull(), // info, warning, error, success
  module: varchar("module"),
  isRead: boolean("is_read").default(false),
  actionUrl: varchar("action_url"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// My Locker - Personal workspace for students and teachers
export const lockerItems = pgTable("locker_items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id),
  type: varchar("type").notNull(), // resource, note, bookmark, file
  title: varchar("title").notNull(),
  content: text("content"), // For notes or custom content
  resourceId: integer("resource_id").references(() => libraryResources.id), // For saved library resources
  metadata: jsonb("metadata"), // Additional data like tags, categories, etc.
  isOfflineAvailable: boolean("is_offline_available").default(false),
  tags: text("tags").array().default([]),
  category: varchar("category"), // personal, course, project, etc.
  isPrivate: boolean("is_private").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Locker collections - organize locker items into folders/collections
export const lockerCollections = pgTable("locker_collections", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id),
  name: varchar("name").notNull(),
  description: text("description"),
  color: varchar("color").default("#3B82F6"),
  icon: varchar("icon").default("folder"),
  isPrivate: boolean("is_private").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Junction table for items in collections
export const lockerItemCollections = pgTable("locker_item_collections", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull().references(() => lockerItems.id),
  collectionId: integer("collection_id").notNull().references(() => lockerCollections.id),
  addedAt: timestamp("added_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [users.institutionId],
    references: [institutions.id],
  }),
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
  teacher: one(teachers, {
    fields: [users.id],
    references: [teachers.userId],
  }),
  settings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
  libraryResources: many(libraryResources),
  subscriptions: many(subscriptions),
  activityLogs: many(activityLogs),
  notifications: many(notifications),
  lockerItems: many(lockerItems),
  lockerCollections: many(lockerCollections),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

export const institutionsRelations = relations(institutions, ({ many }) => ({
  users: many(users),
  students: many(students),
  teachers: many(teachers),
  classes: many(classes),
  subjects: many(subjects),
  schedules: many(schedules),
  subscriptions: many(subscriptions),
  activityLogs: many(activityLogs),
  notifications: many(notifications),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  institution: one(institutions, {
    fields: [students.institutionId],
    references: [institutions.id],
  }),
  attendance: many(attendance),
}));

export const teachersRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, {
    fields: [teachers.userId],
    references: [users.id],
  }),
  institution: one(institutions, {
    fields: [teachers.institutionId],
    references: [institutions.id],
  }),
  classes: many(classes),
  schedules: many(schedules),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [classes.institutionId],
    references: [institutions.id],
  }),
  teacher: one(teachers, {
    fields: [classes.teacherId],
    references: [teachers.id],
  }),
  schedules: many(schedules),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [subjects.institutionId],
    references: [institutions.id],
  }),
  libraryResources: many(libraryResources),
  schedules: many(schedules),
}));

export const libraryResourcesRelations = relations(libraryResources, ({ one }) => ({
  subject: one(subjects, {
    fields: [libraryResources.subjectId],
    references: [subjects.id],
  }),
  author: one(users, {
    fields: [libraryResources.authorId],
    references: [users.id],
  }),
}));

export const schedulesRelations = relations(schedules, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [schedules.institutionId],
    references: [institutions.id],
  }),
  class: one(classes, {
    fields: [schedules.classId],
    references: [classes.id],
  }),
  subject: one(subjects, {
    fields: [schedules.subjectId],
    references: [subjects.id],
  }),
  teacher: one(teachers, {
    fields: [schedules.teacherId],
    references: [teachers.id],
  }),
  attendance: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.id],
  }),
  schedule: one(schedules, {
    fields: [attendance.scheduleId],
    references: [schedules.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  institution: one(institutions, {
    fields: [subscriptions.institutionId],
    references: [institutions.id],
  }),
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

// My Locker Relations
export const lockerItemsRelations = relations(lockerItems, ({ one, many }) => ({
  user: one(users, {
    fields: [lockerItems.userId],
    references: [users.id],
  }),
  tenant: one(tenants, {
    fields: [lockerItems.tenantId],
    references: [tenants.id],
  }),
  resource: one(libraryResources, {
    fields: [lockerItems.resourceId],
    references: [libraryResources.id],
  }),
  collections: many(lockerItemCollections),
}));

export const lockerCollectionsRelations = relations(lockerCollections, ({ one, many }) => ({
  user: one(users, {
    fields: [lockerCollections.userId],
    references: [users.id],
  }),
  tenant: one(tenants, {
    fields: [lockerCollections.tenantId],
    references: [tenants.id],
  }),
  items: many(lockerItemCollections),
}));

export const lockerItemCollectionsRelations = relations(lockerItemCollections, ({ one }) => ({
  item: one(lockerItems, {
    fields: [lockerItemCollections.itemId],
    references: [lockerItems.id],
  }),
  collection: one(lockerCollections, {
    fields: [lockerItemCollections.collectionId],
    references: [lockerCollections.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInstitutionSchema = createInsertSchema(institutions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeacherSchema = createInsertSchema(teachers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLibraryResourceSchema = createInsertSchema(libraryResources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLockerItemSchema = createInsertSchema(lockerItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLockerCollectionSchema = createInsertSchema(lockerCollections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLockerItemCollectionSchema = createInsertSchema(lockerItemCollections).omit({
  id: true,
  addedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type Institution = typeof institutions.$inferSelect;
export type InsertInstitution = z.infer<typeof insertInstitutionSchema>;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Teacher = typeof teachers.$inferSelect;
export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type LibraryResource = typeof libraryResources.$inferSelect;
export type InsertLibraryResource = z.infer<typeof insertLibraryResourceSchema>;
export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type LockerItem = typeof lockerItems.$inferSelect;
export type InsertLockerItem = z.infer<typeof insertLockerItemSchema>;
export type LockerCollection = typeof lockerCollections.$inferSelect;
export type InsertLockerCollection = z.infer<typeof insertLockerCollectionSchema>;
export type LockerItemCollection = typeof lockerItemCollections.$inferSelect;
export type InsertLockerItemCollection = z.infer<typeof insertLockerItemCollectionSchema>;
