import {
  pgTable,
  text,
  varchar,
  timestamp,
  serial,
  integer,
  boolean,
  decimal,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users";
import { tenants } from "./core";

// Library Categories
export const libraryCategories = pgTable("library_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon"),
  color: varchar("color"),
  gradeLevel: varchar("grade_level"), // primary, junior_secondary, senior_secondary
  parentCategoryId: integer("parent_category_id"),
  isActive: boolean("is_active").default(true),
  tenantId: varchar("tenant_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Library Subjects
export const librarySubjects = pgTable("library_subjects", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  competency: text("competency"),
  categoryId: integer("category_id").references(() => libraryCategories.id),
  gradeLevel: varchar("grade_level"),
  isActive: boolean("is_active").default(true),
  tenantId: varchar("tenant_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Library Resources
export const libraryResources = pgTable("library_resources", {
  id: serial("id").primaryKey(),
  isbn: varchar("isbn"),
  title: varchar("title").notNull(),
  type: varchar("type").notNull(), // book, worksheet, quiz, video, audio, document
  author: varchar("author"),
  publisher: varchar("publisher"),
  publicationYear: integer("publication_year"),
  edition: varchar("edition"),
  language: varchar("language").default("English"),
  description: text("description"),
  subject: varchar("subject"),
  category: varchar("category"),
  keywords: text("keywords").array(),
  gradeLevel: varchar("grade_level"),
  difficulty: varchar("difficulty"), // beginner, intermediate, advanced
  thumbnailUrl: varchar("thumbnail_url"),
  fileUrl: varchar("file_url"),
  fileSize: integer("file_size"),
  duration: integer("duration"), // for videos/audio in seconds
  pageCount: integer("page_count"),
  isPublished: boolean("is_published").default(false),
  isGlobal: boolean("is_global").default(false), // accessible across tenants
  accessLevel: varchar("access_level").default("public"), // public, restricted, private
  downloadCount: integer("download_count").default(0),
  viewCount: integer("view_count").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  ratingCount: integer("rating_count").default(0),
  tags: text("tags").array(),
  metadata: text("metadata"), // JSON string for additional metadata
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  tenantId: varchar("tenant_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Library Resource Access Log
export const libraryResourceAccess = pgTable("library_resource_access", {
  id: serial("id").primaryKey(),
  resourceId: integer("resource_id").references(() => libraryResources.id),
  userId: varchar("user_id").references(() => users.id),
  accessType: varchar("access_type").notNull(), // view, download, bookmark
  accessedAt: timestamp("accessed_at").defaultNow(),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  tenantId: varchar("tenant_id"),
});

// Relations
export const libraryCategoriesRelations = relations(libraryCategories, ({ many, one }) => ({
  subjects: many(librarySubjects),
  resources: many(libraryResources),
  parentCategory: one(libraryCategories, {
    fields: [libraryCategories.parentCategoryId],
    references: [libraryCategories.id],
  }),
  childCategories: many(libraryCategories),
  tenant: one(tenants, {
    fields: [libraryCategories.tenantId],
    references: [tenants.id],
  }),
}));

export const librarySubjectsRelations = relations(librarySubjects, ({ one, many }) => ({
  category: one(libraryCategories, {
    fields: [librarySubjects.categoryId],
    references: [libraryCategories.id],
  }),
  resources: many(libraryResources),
  tenant: one(tenants, {
    fields: [librarySubjects.tenantId],
    references: [tenants.id],
  }),
}));

export const libraryResourcesRelations = relations(libraryResources, ({ one, many }) => ({
  uploader: one(users, {
    fields: [libraryResources.uploadedBy],
    references: [users.id],
  }),
  accessLogs: many(libraryResourceAccess),
  tenant: one(tenants, {
    fields: [libraryResources.tenantId],
    references: [tenants.id],
  }),
}));

export const libraryResourceAccessRelations = relations(libraryResourceAccess, ({ one }) => ({
  resource: one(libraryResources, {
    fields: [libraryResourceAccess.resourceId],
    references: [libraryResources.id],
  }),
  user: one(users, {
    fields: [libraryResourceAccess.userId],
    references: [users.id],
  }),
  tenant: one(tenants, {
    fields: [libraryResourceAccess.tenantId],
    references: [tenants.id],
  }),
}));

// Types
export type LibraryCategory = typeof libraryCategories.$inferSelect;
export type InsertLibraryCategory = typeof libraryCategories.$inferInsert;
export type LibrarySubject = typeof librarySubjects.$inferSelect;
export type InsertLibrarySubject = typeof librarySubjects.$inferInsert;
export type LibraryResource = typeof libraryResources.$inferSelect;
export type InsertLibraryResource = typeof libraryResources.$inferInsert;
export type LibraryResourceAccess = typeof libraryResourceAccess.$inferSelect;
export type InsertLibraryResourceAccess = typeof libraryResourceAccess.$inferInsert;

// Zod schemas
export const insertLibraryCategorySchema = createInsertSchema(libraryCategories);
export const insertLibrarySubjectSchema = createInsertSchema(librarySubjects);
export const insertLibraryResourceSchema = createInsertSchema(libraryResources);
export const insertLibraryResourceAccessSchema = createInsertSchema(libraryResourceAccess);