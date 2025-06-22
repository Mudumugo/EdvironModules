import { pgTable, text, timestamp, boolean, integer, json, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Timetable schema
export const timetableEntries = pgTable("timetable_entries", {
  id: serial("id").primaryKey(),
  subjectName: varchar("subject_name", { length: 255 }).notNull(),
  teacherId: varchar("teacher_id", { length: 255 }).notNull(),
  teacherName: varchar("teacher_name", { length: 255 }).notNull(),
  classId: varchar("class_id", { length: 255 }).notNull(),
  className: varchar("class_name", { length: 255 }).notNull(),
  room: varchar("room", { length: 100 }).notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0=Sunday, 1=Monday, etc.
  startTime: varchar("start_time", { length: 10 }).notNull(), // HH:MM format
  endTime: varchar("end_time", { length: 10 }).notNull(), // HH:MM format
  duration: integer("duration").notNull(), // in minutes
  semester: varchar("semester", { length: 50 }).notNull(),
  academicYear: varchar("academic_year", { length: 20 }).notNull(),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  tenantId: varchar("tenant_id", { length: 255 }).default("default"),
});

// Academic Classes schema
export const academicClasses = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  grade: varchar("grade", { length: 20 }),
  section: varchar("section", { length: 10 }),
  capacity: integer("capacity").default(30),
  teacherId: varchar("teacher_id", { length: 255 }),
  teacherName: varchar("teacher_name", { length: 255 }),
  academicYear: varchar("academic_year", { length: 20 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  tenantId: varchar("tenant_id", { length: 255 }).default("default"),
});

// Insert schemas
export const insertTimetableEntrySchema = createInsertSchema(timetableEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAcademicClassSchema = createInsertSchema(academicClasses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type TimetableEntry = typeof timetableEntries.$inferSelect;
export type InsertTimetableEntry = z.infer<typeof insertTimetableEntrySchema>;
export type AcademicClass = typeof academicClasses.$inferSelect;
export type InsertAcademicClass = z.infer<typeof insertAcademicClassSchema>;

// Note: Removed legacy 'classes' export to avoid conflicts with education.schema.ts
// Use 'academicClasses' directly instead