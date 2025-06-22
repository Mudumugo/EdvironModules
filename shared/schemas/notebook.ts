import { pgTable, text, timestamp, boolean, integer, json, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Notebooks table
export const notebooks = pgTable("notebooks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  tags: text("tags").array().default([]),
  subject: varchar("subject", { length: 100 }),
  isPublic: boolean("is_public").default(false),
  isShared: boolean("is_shared").default(false),
  userId: varchar("user_id", { length: 255 }).notNull(),
  tenantId: varchar("tenant_id", { length: 255 }).default("default"),
  template: varchar("template", { length: 100 }),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notebook sections table
export const notebookSections = pgTable("notebook_sections", {
  id: serial("id").primaryKey(),
  notebookId: integer("notebook_id").notNull().references(() => notebooks.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notebook pages table
export const notebookPages = pgTable("notebook_pages", {
  id: serial("id").primaryKey(),
  notebookId: integer("notebook_id").notNull().references(() => notebooks.id, { onDelete: "cascade" }),
  sectionId: integer("section_id").references(() => notebookSections.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  content: json("content").default([]),
  order: integer("order").notNull().default(0),
  isLocked: boolean("is_locked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Page comments table
export const pageComments = pgTable("page_comments", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").notNull().references(() => notebookPages.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  authorId: varchar("author_id", { length: 255 }).notNull(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  position: json("position"), // { x: number, y: number }
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notebook activity table
export const notebookActivity = pgTable("notebook_activity", {
  id: serial("id").primaryKey(),
  notebookId: integer("notebook_id").notNull().references(() => notebooks.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(), // created, updated, shared, etc.
  description: text("description"),
  metadata: json("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notebook subjects table (for notebook organization)
export const notebookSubjects = pgTable("notebook_subjects", {
  id: serial("id").primaryKey(),
  notebookId: integer("notebook_id").notNull().references(() => notebooks.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Note: Using notebookSubjects instead of subjects to avoid conflicts with education.schema.ts

// Chapters table (for notebook organization)
export const chapters = pgTable("notebook_chapters", {
  id: serial("id").primaryKey(),
  notebookId: integer("notebook_id").notNull().references(() => notebooks.id, { onDelete: "cascade" }),
  subjectId: integer("subject_id").references(() => notebookSubjects.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Topics table (for notebook organization)
export const topics = pgTable("notebook_topics", {
  id: serial("id").primaryKey(),
  notebookId: integer("notebook_id").notNull().references(() => notebooks.id, { onDelete: "cascade" }),
  chapterId: integer("chapter_id").references(() => chapters.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pages table (alias for notebookPages for backwards compatibility)
export const pages = notebookPages;

// Sticky notes table
export const stickyNotes = pgTable("sticky_notes", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").notNull().references(() => notebookPages.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  position: json("position").notNull(), // { x: number, y: number }
  size: json("size").notNull(), // { width: number, height: number }
  color: varchar("color", { length: 20 }).default("#ffeb3b"),
  authorId: varchar("author_id", { length: 255 }).notNull(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertNotebookSchema = createInsertSchema(notebooks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotebookSectionSchema = createInsertSchema(notebookSections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotebookPageSchema = createInsertSchema(notebookPages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPageCommentSchema = createInsertSchema(pageComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotebookSubjectSchema = createInsertSchema(notebookSubjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChapterSchema = createInsertSchema(chapters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTopicSchema = createInsertSchema(topics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStickyNoteSchema = createInsertSchema(stickyNotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Notebook = typeof notebooks.$inferSelect;
export type InsertNotebook = z.infer<typeof insertNotebookSchema>;
export type NotebookSection = typeof notebookSections.$inferSelect;
export type InsertNotebookSection = z.infer<typeof insertNotebookSectionSchema>;
export type NotebookPage = typeof notebookPages.$inferSelect;
export type InsertNotebookPage = z.infer<typeof insertNotebookPageSchema>;
export type PageComment = typeof pageComments.$inferSelect;
export type InsertPageComment = z.infer<typeof insertPageCommentSchema>;
export type NotebookSubject = typeof notebookSubjects.$inferSelect;
export type InsertNotebookSubject = z.infer<typeof insertNotebookSubjectSchema>;
export type Chapter = typeof chapters.$inferSelect;
export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type Topic = typeof topics.$inferSelect;
export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type StickyNote = typeof stickyNotes.$inferSelect;
export type InsertStickyNote = z.infer<typeof insertStickyNoteSchema>;