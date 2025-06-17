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

// Library Resources
export const libraryResources = pgTable("library_resources", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: varchar("title").notNull(),
  type: varchar("type").notNull(), // book, video, audio, document, interactive
  author: varchar("author"),
  subject: varchar("subject"),
  grade: varchar("grade"),
  curriculum: varchar("curriculum"),
  difficulty: varchar("difficulty"),
  description: text("description"),
  content: text("content"),
  url: varchar("url"),
  fileUrl: varchar("file_url"),
  thumbnailUrl: varchar("thumbnail_url"),
  duration: integer("duration"), // in minutes
  fileSize: integer("file_size"), // in bytes
  tags: jsonb("tags").default([]),
  metadata: jsonb("metadata").default({}),
  isPublic: boolean("is_public").default(true),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
export type InsertSchedule = typeof schedules.$inferInsert;
export type Schedule = typeof schedules.$inferSelect;
export type InsertAttendance = typeof attendance.$inferInsert;
export type Attendance = typeof attendance.$inferSelect;

// Insert schemas for validation
export const insertStudentSchema = createInsertSchema(students);
export const insertTeacherSchema = createInsertSchema(teachers);
export const insertClassSchema = createInsertSchema(classes);
export const insertSubjectSchema = createInsertSchema(subjects);
export const insertLibraryResourceSchema = createInsertSchema(libraryResources);
export const insertScheduleSchema = createInsertSchema(schedules);
export const insertAttendanceSchema = createInsertSchema(attendance);