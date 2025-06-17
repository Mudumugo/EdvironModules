import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  decimal,
  jsonb,
  date,
  serial,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "./user.schema";

// Institution management
export const institutions = pgTable("institutions", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // school, university, training center
  address: text("address"),
  contactEmail: varchar("contact_email"),
  contactPhone: varchar("contact_phone"),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Students
export const students = pgTable("students", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id").references(() => users.id),
  institutionId: varchar("institution_id").notNull().references(() => institutions.id),
  studentId: varchar("student_id").notNull(),
  grade: varchar("grade"),
  classId: integer("class_id"),
  enrollmentDate: timestamp("enrollment_date").defaultNow(),
  status: varchar("status").default("active"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Teachers
export const teachers = pgTable("teachers", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id").references(() => users.id),
  institutionId: varchar("institution_id").notNull().references(() => institutions.id),
  employeeId: varchar("employee_id").notNull(),
  department: varchar("department"),
  position: varchar("position"),
  hireDate: timestamp("hire_date").defaultNow(),
  status: varchar("status").default("active"),
  qualifications: jsonb("qualifications").default([]),
  subjects: jsonb("subjects").default([]),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Classes
export const classes = pgTable("classes", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  institutionId: varchar("institution_id").notNull().references(() => institutions.id),
  name: varchar("name").notNull(),
  grade: varchar("grade"),
  section: varchar("section"),
  teacherId: integer("teacher_id").references(() => teachers.id),
  capacity: integer("capacity"),
  schedule: jsonb("schedule").default({}),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subjects
export const subjects = pgTable("subjects", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  institutionId: varchar("institution_id").notNull().references(() => institutions.id),
  name: varchar("name").notNull(),
  code: varchar("code"),
  description: text("description"),
  credits: integer("credits"),
  category: varchar("category"),
  prerequisites: jsonb("prerequisites").default([]),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Library Resources - Enhanced for comprehensive library management
export const libraryResources = pgTable("library_resources", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  isbn: varchar("isbn").unique(), // For books
  title: varchar("title").notNull(),
  type: varchar("type").notNull(), // book, ebook, video, audio, document, interactive, journal
  author: varchar("author"),
  publisher: varchar("publisher"),
  publicationYear: integer("publication_year"),
  edition: varchar("edition"),
  language: varchar("language").default("en"),
  subject: varchar("subject"),
  category: varchar("category"), // Fiction, Non-Fiction, Reference, Textbook, etc.
  grade: varchar("grade"),
  curriculum: varchar("curriculum"),
  difficulty: varchar("difficulty"),
  description: text("description"),
  summary: text("summary"),
  tableOfContents: text("table_of_contents"),
  content: text("content"),
  url: varchar("url"),
  fileUrl: varchar("file_url"),
  thumbnailUrl: varchar("thumbnail_url"),
  coverImageUrl: varchar("cover_image_url"),
  duration: integer("duration"), // in minutes for videos/audio
  pageCount: integer("page_count"), // for books
  fileSize: integer("file_size"), // in bytes
  format: varchar("format"), // PDF, EPUB, MP4, etc.
  deweyDecimal: varchar("dewey_decimal"), // Library classification
  location: varchar("location"), // Physical location in library
  barcode: varchar("barcode").unique(), // For physical items
  totalCopies: integer("total_copies").default(1),
  availableCopies: integer("available_copies").default(1),
  tags: jsonb("tags").default([]),
  keywords: jsonb("keywords").default([]),
  learningObjectives: jsonb("learning_objectives").default([]),
  prerequisites: jsonb("prerequisites").default([]),
  metadata: jsonb("metadata").default({}),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  viewCount: integer("view_count").default(0),
  downloadCount: integer("download_count").default(0),
  isPhysical: boolean("is_physical").default(false),
  isDigital: boolean("is_digital").default(true),
  isPublic: boolean("is_public").default(true),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  isRestricted: boolean("is_restricted").default(false), // Requires special permissions
  tenantId: varchar("tenant_id").notNull(),
  addedBy: varchar("added_by").notNull(), // User who added the resource
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Library Borrowing System
export const libraryBorrowings = pgTable("library_borrowings", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  resourceId: integer("resource_id").notNull().references(() => libraryResources.id),
  borrowerId: varchar("borrower_id").notNull().references(() => users.id),
  borrowedAt: timestamp("borrowed_at").defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  returnedAt: timestamp("returned_at"),
  renewalCount: integer("renewal_count").default(0),
  maxRenewals: integer("max_renewals").default(2),
  status: varchar("status").notNull().default("active"), // active, returned, overdue, lost
  fineAmount: decimal("fine_amount", { precision: 10, scale: 2 }).default("0.00"),
  notes: text("notes"),
  tenantId: varchar("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Library Reservations
export const libraryReservations = pgTable("library_reservations", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  resourceId: integer("resource_id").notNull().references(() => libraryResources.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  reservedAt: timestamp("reserved_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  notifiedAt: timestamp("notified_at"),
  status: varchar("status").notNull().default("pending"), // pending, ready, fulfilled, expired, cancelled
  priority: integer("priority").default(1), // Queue position
  tenantId: varchar("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Library Reviews and Ratings
export const libraryReviews = pgTable("library_reviews", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  resourceId: integer("resource_id").notNull().references(() => libraryResources.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  isRecommended: boolean("is_recommended").default(false),
  helpfulVotes: integer("helpful_votes").default(0),
  tenantId: varchar("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Library Categories for organization  
export const libraryCategories: any = pgTable("library_categories", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name").notNull(),
  description: text("description"),
  parentId: integer("parent_id"),
  slug: varchar("slug").notNull().unique(),
  icon: varchar("icon"),
  color: varchar("color"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  tenantId: varchar("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reading Lists and Collections
export const libraryCollections = pgTable("library_collections", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // reading_list, curriculum, recommended, featured
  createdBy: varchar("created_by").notNull().references(() => users.id),
  isPublic: boolean("is_public").default(true),
  isActive: boolean("is_active").default(true),
  tags: jsonb("tags").default([]),
  tenantId: varchar("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Collection Items (many-to-many relationship)
export const libraryCollectionItems = pgTable("library_collection_items", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  collectionId: integer("collection_id").notNull().references(() => libraryCollections.id),
  resourceId: integer("resource_id").notNull().references(() => libraryResources.id),
  order: integer("order").default(0),
  notes: text("notes"),
  addedAt: timestamp("added_at").defaultNow(),
});

// Schedules
export const schedules = pgTable("schedules", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  institutionId: varchar("institution_id").notNull().references(() => institutions.id),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // class, exam, event, meeting
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: varchar("location"),
  classId: integer("class_id").references(() => classes.id),
  teacherId: integer("teacher_id").references(() => teachers.id),
  isRecurring: boolean("is_recurring").default(false),
  recurrenceRule: jsonb("recurrence_rule"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Attendance
export const attendance = pgTable("attendance", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  studentId: integer("student_id").notNull().references(() => students.id),
  scheduleId: integer("schedule_id").notNull().references(() => schedules.id),
  status: varchar("status").notNull(), // present, absent, late, excused
  checkInTime: timestamp("check_in_time"),
  checkOutTime: timestamp("check_out_time"),
  notes: text("notes"),
  recordedBy: varchar("recorded_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User progress tracking for library resources
export const libraryProgress = pgTable("library_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  contentId: text("content_id").notNull(),
  contentType: text("content_type").notNull(),
  currentPosition: integer("current_position").default(0), // current page/question
  totalItems: integer("total_items").notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).default("0"),
  timeSpent: integer("time_spent").default(0), // in minutes
  sessionsCount: integer("sessions_count").default(0),
  completed: boolean("completed").default(false),
  competenciesAchieved: text("competencies_achieved").array(),
  lastAccessed: timestamp("last_accessed").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  tenantId: text("tenant_id").notNull(),
});

// Library learning analytics and insights
export const libraryAnalytics = pgTable("library_analytics", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  date: timestamp("date").defaultNow(),
  subjectBreakdown: jsonb("subject_breakdown"), // subject progress data
  learningVelocity: decimal("learning_velocity", { precision: 5, scale: 2 }), // pages/questions per hour
  focusAreas: text("focus_areas").array(),
  strugglingAreas: text("struggling_areas").array(),
  strongAreas: text("strong_areas").array(),
  totalTimeSpent: integer("total_time_spent").default(0), // in minutes
  streakDays: integer("streak_days").default(0),
  achievements: jsonb("achievements"), // earned achievements
  recommendations: jsonb("recommendations"), // AI recommendations
  lastActiveDate: timestamp("last_active_date"),
  completionRate: decimal("completion_rate", { precision: 5, scale: 2 }),
  resourcesAccessed: integer("resources_accessed").default(0),
  progressData: jsonb("progress_data"), // detailed progress tracking
  createdAt: timestamp("created_at").defaultNow(),
  tenantId: text("tenant_id").notNull(),
});

// Library personalized recommendations
export const libraryRecommendations = pgTable("library_recommendations", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  contentId: text("content_id").notNull(),
  type: text("type").notNull(), // "next_step", "reinforcement", "challenge", "review"
  priority: integer("priority").default(1), // 1-5 priority scale
  reason: text("reason").notNull(), // explanation for recommendation
  confidence: decimal("confidence", { precision: 3, scale: 2 }), // AI confidence 0-1
  metadata: jsonb("metadata"), // additional recommendation data
  viewed: boolean("viewed").default(false),
  accepted: boolean("accepted").default(false),
  dismissedAt: timestamp("dismissed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  tenantId: text("tenant_id").notNull(),
});

// Export types
export type InsertInstitution = typeof institutions.$inferInsert;
export type Institution = typeof institutions.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;
export type Student = typeof students.$inferSelect;
export type InsertTeacher = typeof teachers.$inferInsert;
export type Teacher = typeof teachers.$inferSelect;
export type InsertClass = typeof classes.$inferInsert;
export type Class = typeof classes.$inferSelect;
export type InsertSubject = typeof subjects.$inferInsert;
export type Subject = typeof subjects.$inferSelect;
export type InsertLibraryResource = typeof libraryResources.$inferInsert;
export type LibraryResource = typeof libraryResources.$inferSelect;
export type InsertLibraryBorrowing = typeof libraryBorrowings.$inferInsert;
export type LibraryBorrowing = typeof libraryBorrowings.$inferSelect;
export type InsertLibraryReservation = typeof libraryReservations.$inferInsert;
export type LibraryReservation = typeof libraryReservations.$inferSelect;
export type InsertLibraryReview = typeof libraryReviews.$inferInsert;
export type LibraryReview = typeof libraryReviews.$inferSelect;
export type InsertLibraryCategory = typeof libraryCategories.$inferInsert;
export type LibraryCategory = typeof libraryCategories.$inferSelect;
export type InsertLibraryCollection = typeof libraryCollections.$inferInsert;
export type LibraryCollection = typeof libraryCollections.$inferSelect;
export type InsertLibraryCollectionItem = typeof libraryCollectionItems.$inferInsert;
export type LibraryCollectionItem = typeof libraryCollectionItems.$inferSelect;
export type InsertSchedule = typeof schedules.$inferInsert;
export type Schedule = typeof schedules.$inferSelect;
export type InsertAttendance = typeof attendance.$inferInsert;
export type Attendance = typeof attendance.$inferSelect;
export type InsertLibraryProgress = typeof libraryProgress.$inferInsert;
export type LibraryProgress = typeof libraryProgress.$inferSelect;
export type InsertLibraryAnalytics = typeof libraryAnalytics.$inferInsert;
export type LibraryAnalytics = typeof libraryAnalytics.$inferSelect;
export type InsertLibraryRecommendation = typeof libraryRecommendations.$inferInsert;
export type LibraryRecommendation = typeof libraryRecommendations.$inferSelect;

// Insert schemas for validation
export const insertStudentSchema = createInsertSchema(students);
export const insertTeacherSchema = createInsertSchema(teachers);
export const insertClassSchema = createInsertSchema(classes);
export const insertSubjectSchema = createInsertSchema(subjects);
export const insertLibraryResourceSchema = createInsertSchema(libraryResources);
export const insertLibraryBorrowingSchema = createInsertSchema(libraryBorrowings);
export const insertLibraryReservationSchema = createInsertSchema(libraryReservations);
export const insertLibraryReviewSchema = createInsertSchema(libraryReviews);
export const insertLibraryCategorySchema = createInsertSchema(libraryCategories);
export const insertLibraryCollectionSchema = createInsertSchema(libraryCollections);
export const insertScheduleSchema = createInsertSchema(schedules);
export const insertAttendanceSchema = createInsertSchema(attendance);
export const insertLibraryProgressSchema = createInsertSchema(libraryProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertLibraryAnalyticsSchema = createInsertSchema(libraryAnalytics).omit({
  id: true,
  createdAt: true,
});
export const insertLibraryRecommendationSchema = createInsertSchema(libraryRecommendations).omit({
  id: true,
  viewed: true,
  accepted: true,
  dismissedAt: true,
  createdAt: true,
});