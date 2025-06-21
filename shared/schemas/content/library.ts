import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  integer,
  boolean,
  decimal,
  unique,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "../core";

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
  tenantId: varchar("tenant_id").notNull(),
  authorId: varchar("author_id").references(() => users.id),
  gradeLevel: varchar("grade_level"),
  difficulty: varchar("difficulty").default("medium"), // easy, medium, hard
  language: varchar("language").default("en"),
  fileUrl: varchar("file_url"),
  fileSize: integer("file_size"),
  duration: integer("duration"), // in seconds for videos/audio
  thumbnailUrl: varchar("thumbnail_url"),
  metadata: jsonb("metadata").default({}),
  tags: jsonb("tags").default([]),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  viewCount: integer("view_count").default(0),
  downloadCount: integer("download_count").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  ratingCount: integer("rating_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  uniqueTitleSubject: unique().on(table.title, table.subjectId, table.tenantId),
}));

// Insert schemas
export const insertLibraryCategorySchema = createInsertSchema(libraryCategories);
export const insertLibrarySubjectSchema = createInsertSchema(librarySubjects);
export const insertLibraryItemSchema = createInsertSchema(libraryItems);