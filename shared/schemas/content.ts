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