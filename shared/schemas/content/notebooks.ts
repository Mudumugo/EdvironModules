import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "../core";

// Digital notebooks
export const notebooks = pgTable("notebooks", {
  id: varchar("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  tenantId: varchar("tenant_id").notNull(),
  subject: varchar("subject"),
  gradeLevel: varchar("grade_level"),
  isShared: boolean("is_shared").default(false),
  shareSettings: jsonb("share_settings").default({}),
  template: varchar("template").default("blank"), // blank, lined, grid, template_name
  coverColor: varchar("cover_color").default("#3b82f6"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notebookSections = pgTable("notebook_sections", {
  id: varchar("id").primaryKey().notNull(),
  notebookId: varchar("notebook_id").references(() => notebooks.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  order: integer("order").default(0),
  sectionType: varchar("section_type").default("general"), // general, chapter, topic, assignment
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notebookPages = pgTable("notebook_pages", {
  id: varchar("id").primaryKey().notNull(),
  sectionId: varchar("section_id").references(() => notebookSections.id).notNull(),
  title: varchar("title"),
  content: text("content"),
  pageType: varchar("page_type").default("text"), // text, drawing, mixed, template
  order: integer("order").default(0),
  template: varchar("template"), // cornell, outline, grid, etc
  attachments: jsonb("attachments").default([]),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Personal locker/storage
export const lockerItems = pgTable("locker_items", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  tenantId: varchar("tenant_id").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // document, image, video, audio, link, note
  content: text("content"),
  fileUrl: varchar("file_url"),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type"),
  thumbnailUrl: varchar("thumbnail_url"),
  sourceId: varchar("source_id"), // reference to original library item
  sourceType: varchar("source_type"), // library_item, assignment, external
  folder: varchar("folder").default("General"),
  tags: jsonb("tags").default([]),
  isFavorite: boolean("is_favorite").default(false),
  isArchived: boolean("is_archived").default(false),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertNotebookSchema = createInsertSchema(notebooks);
export const insertNotebookSectionSchema = createInsertSchema(notebookSections);
export const insertNotebookPageSchema = createInsertSchema(notebookPages);
export const insertLockerItemSchema = createInsertSchema(lockerItems);