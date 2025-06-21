import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  jsonb,
  date,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "../user.schema";
import { institutions } from "./institutions";

// Classes
export const classes = pgTable("classes", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  institutionId: varchar("institution_id").notNull().references(() => institutions.id),
  name: varchar("name").notNull(),
  description: text("description"),
  grade: varchar("grade"),
  subject: varchar("subject"),
  teacherId: varchar("teacher_id").references(() => users.id),
  capacity: integer("capacity").default(30),
  schedule: jsonb("schedule").default([]),
  isActive: boolean("is_active").default(true),
  academicYear: varchar("academic_year"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  classNameIdx: index("class_name_idx").on(table.name),
  gradeSubjectIdx: index("grade_subject_idx").on(table.grade, table.subject),
}));

// Class enrollments
export const classEnrollments = pgTable("class_enrollments", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  classId: integer("class_id").notNull().references(() => classes.id),
  studentId: integer("student_id").notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  status: varchar("status").default("active"),
  finalGrade: varchar("final_grade"),
  attendance: jsonb("attendance").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  uniqueEnrollment: unique().on(table.classId, table.studentId),
  classStudentIdx: index("class_student_idx").on(table.classId, table.studentId),
}));

// Assignments
export const assignments = pgTable("assignments", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  classId: integer("class_id").notNull().references(() => classes.id),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type").notNull(),
  dueDate: timestamp("due_date"),
  maxPoints: integer("max_points").default(100),
  instructions: text("instructions"),
  attachments: jsonb("attachments").default([]),
  isPublished: boolean("is_published").default(false),
  allowLateSubmissions: boolean("allow_late_submissions").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  classDueDateIdx: index("class_due_date_idx").on(table.classId, table.dueDate),
}));

// Assignment submissions
export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  assignmentId: integer("assignment_id").notNull().references(() => assignments.id),
  studentId: integer("student_id").notNull(),
  content: text("content"),
  attachments: jsonb("attachments").default([]),
  submittedAt: timestamp("submitted_at").defaultNow(),
  grade: integer("grade"),
  feedback: text("feedback"),
  status: varchar("status").default("submitted"),
  isLate: boolean("is_late").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  assignmentStudentIdx: index("assignment_student_idx").on(table.assignmentId, table.studentId),
  uniqueSubmission: unique().on(table.assignmentId, table.studentId),
}));

// Insert schemas
export const insertClassSchema = createInsertSchema(classes);
export const insertClassEnrollmentSchema = createInsertSchema(classEnrollments);
export const insertAssignmentSchema = createInsertSchema(assignments);
export const insertAssignmentSubmissionSchema = createInsertSchema(assignmentSubmissions);