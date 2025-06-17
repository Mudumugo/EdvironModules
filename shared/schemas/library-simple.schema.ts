import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  decimal,
  jsonb,
} from "drizzle-orm/pg-core";

// Simple library resources schema matching actual database structure
export const libraryResources = pgTable("library_resources", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: varchar("title").notNull(),
  type: varchar("type").notNull(),
  subjectId: integer("subject_id"),
  grade: varchar("grade"),
  curriculum: varchar("curriculum"),
  content: text("content"),
  file_url: varchar("file_url"),
  thumbnail_url: varchar("thumbnail_url"),
  accessTier: varchar("access_tier"),
  isPublished: boolean("is_published").default(true),
  authorId: varchar("author_id").notNull(),
  viewCount: integer("view_count").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  tags: jsonb("tags").default([]),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  description: text("description"),
  difficulty: varchar("difficulty"),
  prerequisites: jsonb("prerequisites").default([]),
  learning_objectives: jsonb("learning_objectives").default([]),
  duration: integer("duration"),
  is_shared_globally: boolean("is_shared_globally").default(false),
  tenant_id: varchar("tenant_id").notNull(),
  approved_by: varchar("approved_by"),
  language: varchar("language").default("English"),
});

export type LibraryResource = typeof libraryResources.$inferSelect;
export type InsertLibraryResource = typeof libraryResources.$inferInsert;