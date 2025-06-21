import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  serial,
  integer,
  boolean,
  decimal,
  date,
  unique,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "./core";

// Library content tables
export const libraryCategories = pgTable("library_categories", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  parentId: varchar("parent_id"),
  tenantId: varchar("tenant_id").notNull(),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const librarySubjects = pgTable("library_subjects", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  categoryId: varchar("category_id").references(() => libraryCategories.id),
  tenantId: varchar("tenant_id").notNull(),
  gradeLevel: varchar("grade_level"),
  curriculum: varchar("curriculum").default("CBC"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const libraryItems = pgTable("library_items", {
  id: varchar("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  content: text("content"),
  type: varchar("type").notNull(), // document, video, audio, image, interactive
  subjectId: varchar("subject_id").references(() => librarySubjects.id),
  categoryId: varchar("category_id").references(() => libraryCategories.id),
  tenantId: varchar("tenant_id").notNull(),
  authorId: varchar("author_id").references(() => users.id),
  fileUrl: varchar("file_url"),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type"),
  thumbnailUrl: varchar("thumbnail_url"),
  tags: text("tags").array().default([]),
  metadata: jsonb("metadata").default({}),
  gradeLevel: varchar("grade_level"),
  curriculum: varchar("curriculum").default("CBC"),
  difficulty: varchar("difficulty"), // beginner, intermediate, advanced
  language: varchar("language").default("en"),
  isPublic: boolean("is_public").default(false),
  isApproved: boolean("is_approved").default(false),
  downloadCount: integer("download_count").default(0),
  viewCount: integer("view_count").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  ratingCount: integer("rating_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Assignment system tables
export const assignments = pgTable("assignments", {
  id: varchar("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  instructions: text("instructions"),
  teacherId: varchar("teacher_id").references(() => users.id).notNull(),
  subjectId: varchar("subject_id").references(() => librarySubjects.id),
  tenantId: varchar("tenant_id").notNull(),
  dueDate: timestamp("due_date"),
  maxPoints: integer("max_points").default(100),
  type: varchar("type").notNull(), // homework, quiz, project, exam
  status: varchar("status").default("draft"), // draft, published, closed
  attachments: text("attachments").array().default([]),
  rubric: jsonb("rubric").default({}),
  allowLateSubmission: boolean("allow_late_submission").default(true),
  isGroupWork: boolean("is_group_work").default(false),
  estimatedDuration: integer("estimated_duration"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: varchar("id").primaryKey().notNull(),
  assignmentId: varchar("assignment_id").references(() => assignments.id).notNull(),
  studentId: varchar("student_id").references(() => users.id).notNull(),
  content: text("content"),
  attachments: text("attachments").array().default([]),
  grade: decimal("grade", { precision: 5, scale: 2 }),
  feedback: text("feedback"),
  status: varchar("status").default("submitted"), // submitted, graded, returned
  submittedAt: timestamp("submitted_at").defaultNow(),
  gradedAt: timestamp("graded_at"),
  gradedBy: varchar("graded_by").references(() => users.id),
  isLate: boolean("is_late").default(false),
  attemptNumber: integer("attempt_number").default(1),
  timeSpent: integer("time_spent"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notebook system tables
export const notebooks = pgTable("notebooks", {
  id: varchar("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  tenantId: varchar("tenant_id").notNull(),
  subjectId: varchar("subject_id").references(() => librarySubjects.id),
  type: varchar("type").default("personal"), // personal, shared, class
  isPublic: boolean("is_public").default(false),
  tags: text("tags").array().default([]),
  color: varchar("color").default("#3B82F6"),
  coverImage: varchar("cover_image"),
  pageCount: integer("page_count").default(0),
  lastEditedAt: timestamp("last_edited_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notebookSections = pgTable("notebook_sections", {
  id: varchar("id").primaryKey().notNull(),
  notebookId: varchar("notebook_id").references(() => notebooks.id).notNull(),
  title: varchar("title").notNull(),
  order: integer("order").default(0),
  color: varchar("color"),
  isCollapsed: boolean("is_collapsed").default(false),
  pageCount: integer("page_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notebookPages = pgTable("notebook_pages", {
  id: varchar("id").primaryKey().notNull(),
  notebookId: varchar("notebook_id").references(() => notebooks.id).notNull(),
  sectionId: varchar("section_id").references(() => notebookSections.id),
  title: varchar("title").notNull(),
  content: jsonb("content").default({}), // Rich content structure
  order: integer("order").default(0),
  type: varchar("type").default("note"), // note, drawing, document, media
  tags: text("tags").array().default([]),
  attachments: text("attachments").array().default([]),
  lastEditedBy: varchar("last_edited_by").references(() => users.id),
  lastEditedAt: timestamp("last_edited_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Locker system tables
export const lockerItems = pgTable("locker_items", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // file, folder, link, note
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  tenantId: varchar("tenant_id").notNull(),
  parentId: varchar("parent_id"), // For folder structure
  fileUrl: varchar("file_url"),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type"),
  thumbnailUrl: varchar("thumbnail_url"),
  content: text("content"), // For notes and text content
  tags: text("tags").array().default([]),
  isPublic: boolean("is_public").default(false),
  isStarred: boolean("is_starred").default(false),
  downloadCount: integer("download_count").default(0),
  lastAccessedAt: timestamp("last_accessed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export types
export type LibraryCategory = typeof libraryCategories.$inferSelect;
export type LibrarySubject = typeof librarySubjects.$inferSelect;
export type LibraryItem = typeof libraryItems.$inferSelect;
export type Assignment = typeof assignments.$inferSelect;
export type AssignmentSubmission = typeof assignmentSubmissions.$inferSelect;
export type Notebook = typeof notebooks.$inferSelect;
export type NotebookSection = typeof notebookSections.$inferSelect;
export type NotebookPage = typeof notebookPages.$inferSelect;
export type LockerItem = typeof lockerItems.$inferSelect;

// Insert types
export type InsertLibraryCategory = typeof libraryCategories.$inferInsert;
export type InsertLibrarySubject = typeof librarySubjects.$inferInsert;
export type InsertLibraryItem = typeof libraryItems.$inferInsert;
export type InsertAssignment = typeof assignments.$inferInsert;
export type InsertAssignmentSubmission = typeof assignmentSubmissions.$inferInsert;
export type InsertNotebook = typeof notebooks.$inferInsert;
export type InsertNotebookSection = typeof notebookSections.$inferInsert;
export type InsertNotebookPage = typeof notebookPages.$inferInsert;
export type InsertLockerItem = typeof lockerItems.$inferInsert;

// Zod schemas
export const insertLibraryCategorySchema = createInsertSchema(libraryCategories);
export const insertLibrarySubjectSchema = createInsertSchema(librarySubjects);
export const insertLibraryItemSchema = createInsertSchema(libraryItems);
export const insertAssignmentSchema = createInsertSchema(assignments);
export const insertAssignmentSubmissionSchema = createInsertSchema(assignmentSubmissions);
export const insertNotebookSchema = createInsertSchema(notebooks);
export const insertNotebookSectionSchema = createInsertSchema(notebookSections);
export const insertNotebookPageSchema = createInsertSchema(notebookPages);
export const insertLockerItemSchema = createInsertSchema(lockerItems);

// Additional tables that might be referenced elsewhere
export const classes = pgTable("classes", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  teacherId: varchar("teacher_id").references(() => users.id),
  tenantId: varchar("tenant_id").notNull(),
  gradeLevel: varchar("grade_level"),
  subject: varchar("subject"),
  capacity: integer("capacity").default(30),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const timetableEntries = pgTable("timetable_entries", {
  id: varchar("id").primaryKey().notNull(),
  classId: varchar("class_id").references(() => classes.id).notNull(),
  teacherId: varchar("teacher_id").references(() => users.id).notNull(),
  tenantId: varchar("tenant_id").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: varchar("start_time").notNull(), // HH:MM format
  endTime: varchar("end_time").notNull(), // HH:MM format
  subject: varchar("subject"),
  room: varchar("room"),
  isRecurring: boolean("is_recurring").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Class = typeof classes.$inferSelect;
export type InsertClass = typeof classes.$inferInsert;
export type TimetableEntry = typeof timetableEntries.$inferSelect;
export type InsertTimetableEntry = typeof timetableEntries.$inferInsert;

export const insertClassSchema = createInsertSchema(classes);
export const insertTimetableEntrySchema = createInsertSchema(timetableEntries);

// Additional schema tables for notebook activity tracking
export const notebookActivity = pgTable("notebook_activity", {
  id: varchar("id").primaryKey().notNull(),
  notebookId: varchar("notebook_id").references(() => notebooks.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  activityType: varchar("activity_type").notNull(), // created, edited, shared, deleted
  description: text("description"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export type NotebookActivity = typeof notebookActivity.$inferSelect;
export type InsertNotebookActivity = typeof notebookActivity.$inferInsert;
export const insertNotebookActivitySchema = createInsertSchema(notebookActivity);

// Legacy alias for backward compatibility
export const subjects = librarySubjects;

// Additional schema tables for backward compatibility
export const chapters = pgTable("chapters", {
  id: varchar("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  subjectId: varchar("subject_id").references(() => librarySubjects.id),
  notebookId: varchar("notebook_id").references(() => notebooks.id),
  order: integer("order").default(0),
  content: jsonb("content").default({}),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  company: varchar("company"),
  source: varchar("source"),
  status: varchar("status").default("new"),
  notes: text("notes"),
  tenantId: varchar("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const leadActivities = pgTable("lead_activities", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id).notNull(),
  activityType: varchar("activity_type").notNull(),
  description: text("description"),
  performedBy: varchar("performed_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const demoRequests = pgTable("demo_requests", {
  id: serial("id").primaryKey(),
  schoolName: varchar("school_name").notNull(),
  contactName: varchar("contact_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  status: varchar("status").default("pending"),
  scheduledDate: timestamp("scheduled_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const topics = pgTable("topics", {
  id: varchar("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  chapterId: varchar("chapter_id").references(() => chapters.id),
  subjectId: varchar("subject_id").references(() => librarySubjects.id),
  order: integer("order").default(0),
  content: jsonb("content").default({}),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Chapter = typeof chapters.$inferSelect;
export type InsertChapter = typeof chapters.$inferInsert;
export type Topic = typeof topics.$inferSelect;
export type InsertTopic = typeof topics.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
export type LeadActivity = typeof leadActivities.$inferSelect;
export type InsertLeadActivity = typeof leadActivities.$inferInsert;
export type DemoRequest = typeof demoRequests.$inferSelect;
export type InsertDemoRequest = typeof demoRequests.$inferInsert;

// Legacy alias for notebookPages
export const pages = notebookPages;

// Additional schema for sticky notes
export const stickyNotes = pgTable("sticky_notes", {
  id: varchar("id").primaryKey().notNull(),
  pageId: varchar("page_id").references(() => notebookPages.id),
  userId: varchar("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  position: jsonb("position").default({}), // x, y coordinates
  color: varchar("color").default("#ffeb3b"),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type StickyNote = typeof stickyNotes.$inferSelect;
export type InsertStickyNote = typeof stickyNotes.$inferInsert;

// Zod schemas for CRM entities
export const insertLeadSchema = createInsertSchema(leads);
export const insertLeadActivitySchema = createInsertSchema(leadActivities);
export const insertDemoRequestSchema = createInsertSchema(demoRequests);
export const insertChapterSchema = createInsertSchema(chapters);
export const insertTopicSchema = createInsertSchema(topics);
export const insertStickyNoteSchema = createInsertSchema(stickyNotes);