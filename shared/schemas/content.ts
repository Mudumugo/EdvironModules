import { pgTable, text, timestamp, boolean, integer, json, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const lessonPlans = pgTable("lesson_plans", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  subject: text("subject").notNull(),
  gradeLevel: text("grade_level").notNull(),
  curriculum: text("curriculum").default("CBC"),
  objectives: text("objectives").array().default([]),
  activities: json("activities").default([]),
  resources: json("resources").default([]),
  assessment: json("assessment").default({}),
  duration: integer("duration"), // in minutes
  difficulty: text("difficulty"),
  standards: text("standards").array().default([]),
  keywords: text("keywords").array().default([]),
  isTemplate: boolean("is_template").default(false),
  isPublic: boolean("is_public").default(false),
  status: text("status").default("draft"), // 'draft', 'published', 'archived'
  tenantId: text("tenant_id"),
  authorId: text("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  instructions: text("instructions"),
  subject: text("subject").notNull(),
  gradeLevel: text("grade_level").notNull(),
  type: text("type").default("homework"), // 'homework', 'project', 'quiz', 'exam'
  totalPoints: integer("total_points").default(100),
  dueDate: timestamp("due_date"),
  startDate: timestamp("start_date"),
  isPublished: boolean("is_published").default(false),
  allowLateSubmission: boolean("allow_late_submission").default(true),
  latePenalty: integer("late_penalty").default(0), // percentage
  requirements: json("requirements").default({}),
  rubric: json("rubric").default({}),
  resources: json("resources").default([]),
  tenantId: text("tenant_id"),
  teacherId: text("teacher_id").notNull(),
  classId: text("class_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull(),
  studentId: text("student_id").notNull(),
  content: text("content"),
  attachments: json("attachments").default([]),
  status: text("status").default("draft"), // 'draft', 'submitted', 'graded', 'returned'
  submittedAt: timestamp("submitted_at"),
  gradedAt: timestamp("graded_at"),
  score: integer("score"),
  maxScore: integer("max_score"),
  feedback: text("feedback"),
  rubricScores: json("rubric_scores").default({}),
  isLate: boolean("is_late").default(false),
  attempts: integer("attempts").default(1),
  timeSpent: integer("time_spent").default(0), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  subject: text("subject").notNull(),
  gradeLevel: text("grade_level").notNull(),
  questions: json("questions").default([]),
  timeLimit: integer("time_limit"), // in minutes
  attempts: integer("attempts").default(1),
  showResults: boolean("show_results").default(true),
  shuffleQuestions: boolean("shuffle_questions").default(false),
  isPublished: boolean("is_published").default(false),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  passingScore: integer("passing_score").default(70),
  totalPoints: integer("total_points").default(100),
  tenantId: text("tenant_id"),
  teacherId: text("teacher_id").notNull(),
  classId: text("class_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLessonPlanSchema = createInsertSchema(lessonPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type LessonPlan = typeof lessonPlans.$inferSelect;
export type InsertLessonPlan = z.infer<typeof insertLessonPlanSchema>;
export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;