import { pgTable, text, timestamp, boolean, integer, json, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author"),
  isbn: text("isbn"),
  description: text("description"),
  category: text("category"),
  subject: text("subject"),
  gradeLevel: text("grade_level"),
  language: text("language").default("en"),
  format: text("format").default("html5"), // 'pdf', 'html5', 'epub', 'video', 'audio'
  fileUrl: text("file_url"),
  thumbnailUrl: text("thumbnail_url"),
  fileSize: integer("file_size"),
  pageCount: integer("page_count"),
  duration: integer("duration"), // for video/audio content
  tags: text("tags").array().default([]),
  keywords: text("keywords").array().default([]),
  difficulty: text("difficulty"), // 'beginner', 'intermediate', 'advanced'
  publisher: text("publisher"),
  publishedDate: timestamp("published_date"),
  curriculum: text("curriculum").default("CBC"), // CBC, KCSE, etc.
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  isPublic: boolean("is_public").default(true),
  downloadCount: integer("download_count").default(0),
  viewCount: integer("view_count").default(0),
  rating: integer("rating").default(0),
  reviews: json("reviews").default([]),
  metadata: json("metadata").default({}),
  tenantId: text("tenant_id"),
  authorId: text("author_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bookCollections = pgTable("book_collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").default("manual"), // 'manual', 'smart', 'curriculum'
  criteria: json("criteria").default({}),
  bookIds: integer("book_ids").array().default([]),
  coverImageUrl: text("cover_image_url"),
  isPublic: boolean("is_public").default(true),
  isSystem: boolean("is_system").default(false),
  tenantId: text("tenant_id"),
  creatorId: text("creator_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userBookmarks = pgTable("user_bookmarks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  bookId: integer("book_id").notNull(),
  page: integer("page").default(1),
  position: json("position").default({}),
  notes: text("notes"),
  isPrivate: boolean("is_private").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const readingProgress = pgTable("reading_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  bookId: integer("book_id").notNull(),
  currentPage: integer("current_page").default(1),
  totalPages: integer("total_pages"),
  progressPercentage: integer("progress_percentage").default(0),
  timeSpent: integer("time_spent").default(0), // in minutes
  lastReadAt: timestamp("last_read_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  bookmarkedPages: integer("bookmarked_pages").array().default([]),
  notes: json("notes").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookCollectionSchema = createInsertSchema(bookCollections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserBookmarkSchema = createInsertSchema(userBookmarks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReadingProgressSchema = createInsertSchema(readingProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Book = typeof books.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;
export type BookCollection = typeof bookCollections.$inferSelect;
export type InsertBookCollection = z.infer<typeof insertBookCollectionSchema>;
export type UserBookmark = typeof userBookmarks.$inferSelect;
export type InsertUserBookmark = z.infer<typeof insertUserBookmarkSchema>;
export type ReadingProgress = typeof readingProgress.$inferSelect;
export type InsertReadingProgress = z.infer<typeof insertReadingProgressSchema>;