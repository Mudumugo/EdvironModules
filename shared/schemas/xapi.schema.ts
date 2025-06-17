import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
  decimal
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// xAPI Statement storage - core learning analytics
export const xapiStatements = pgTable("xapi_statements", {
  id: serial("id").primaryKey(),
  statementId: varchar("statement_id", { length: 255 }).unique().notNull(),
  actor: jsonb("actor").notNull(), // learner/student performing the action
  verb: jsonb("verb").notNull(), // action performed (experienced, completed, passed, etc.)
  object: jsonb("object").notNull(), // learning activity/content interacted with
  result: jsonb("result"), // outcome of the interaction (score, completion, duration)
  context: jsonb("context"), // additional context (instructor, platform, session)
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  stored: timestamp("stored").defaultNow().notNull(),
  authority: jsonb("authority"), // system or person asserting this statement
  version: varchar("version", { length: 10 }).default("1.0.3"),
  attachments: jsonb("attachments"), // any file attachments
  voided: boolean("voided").default(false),
  tenantId: varchar("tenant_id", { length: 255 }).notNull()
}, (table) => [
  index("idx_xapi_actor").on(table.actor),
  index("idx_xapi_verb").on(table.verb),
  index("idx_xapi_timestamp").on(table.timestamp),
  index("idx_xapi_tenant").on(table.tenantId)
]);

// Learning Record Store (LRS) configuration
export const learningRecordStores = pgTable("learning_record_stores", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  endpoint: varchar("endpoint", { length: 500 }).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  version: varchar("version", { length: 10 }).default("1.0.3"),
  isActive: boolean("is_active").default(true),
  tenantId: varchar("tenant_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Learning activity definitions
export const learningActivities = pgTable("learning_activities", {
  id: serial("id").primaryKey(),
  activityId: varchar("activity_id", { length: 255 }).unique().notNull(),
  name: jsonb("name").notNull(), // multilingual name
  description: jsonb("description"), // multilingual description
  type: varchar("type", { length: 255 }).notNull(), // course, lesson, quiz, video, etc.
  moreInfo: varchar("more_info", { length: 500 }),
  extensions: jsonb("extensions"), // custom properties
  tenantId: varchar("tenant_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_activity_type").on(table.type),
  index("idx_activity_tenant").on(table.tenantId)
]);

// Learner profiles with xAPI agents
export const learnerProfiles = pgTable("learner_profiles", {
  id: serial("id").primaryKey(),
  agentId: varchar("agent_id", { length: 255 }).unique().notNull(), // xAPI agent identifier
  userId: varchar("user_id", { length: 255 }).notNull(), // reference to users table
  name: varchar("name", { length: 255 }).notNull(),
  mbox: varchar("mbox", { length: 255 }), // email
  mboxSha1Sum: varchar("mbox_sha1_sum", { length: 255 }),
  openId: varchar("open_id", { length: 255 }),
  account: jsonb("account"), // platform account info
  tenantId: varchar("tenant_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_learner_user").on(table.userId),
  index("idx_learner_tenant").on(table.tenantId)
]);

// Learning analytics aggregations
export const learningAnalytics = pgTable("learning_analytics", {
  id: serial("id").primaryKey(),
  learnerId: varchar("learner_id", { length: 255 }).notNull(),
  activityId: varchar("activity_id", { length: 255 }).notNull(),
  verb: varchar("verb", { length: 100 }).notNull(),
  totalInteractions: integer("total_interactions").default(0),
  totalDuration: integer("total_duration").default(0), // in seconds
  averageScore: decimal("average_score", { precision: 5, scale: 2 }),
  completionRate: decimal("completion_rate", { precision: 5, scale: 2 }),
  firstAttempt: timestamp("first_attempt"),
  lastAttempt: timestamp("last_attempt"),
  bestScore: decimal("best_score", { precision: 5, scale: 2 }),
  attempts: integer("attempts").default(0),
  tenantId: varchar("tenant_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_analytics_learner").on(table.learnerId),
  index("idx_analytics_activity").on(table.activityId),
  index("idx_analytics_tenant").on(table.tenantId)
]);

// Learning paths and progression tracking
export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  pathId: varchar("path_id", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  activities: jsonb("activities").notNull(), // ordered list of activity IDs
  prerequisites: jsonb("prerequisites"), // required competencies
  objectives: jsonb("objectives"), // learning objectives
  estimatedDuration: integer("estimated_duration"), // in minutes
  difficulty: varchar("difficulty", { length: 50 }),
  tenantId: varchar("tenant_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Learner progress on learning paths
export const learnerProgress = pgTable("learner_progress", {
  id: serial("id").primaryKey(),
  learnerId: varchar("learner_id", { length: 255 }).notNull(),
  pathId: varchar("path_id", { length: 255 }).notNull(),
  currentActivityIndex: integer("current_activity_index").default(0),
  completedActivities: jsonb("completed_activities").default('[]'),
  progressPercentage: decimal("progress_percentage", { precision: 5, scale: 2 }).default('0'),
  timeSpent: integer("time_spent").default(0), // in seconds
  startedAt: timestamp("started_at").defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  tenantId: varchar("tenant_id", { length: 255 }).notNull()
}, (table) => [
  index("idx_progress_learner").on(table.learnerId),
  index("idx_progress_path").on(table.pathId)
]);

// Competency and skills tracking
export const competencies = pgTable("competencies", {
  id: serial("id").primaryKey(),
  competencyId: varchar("competency_id", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  level: varchar("level", { length: 50 }), // beginner, intermediate, advanced
  masteryThreshold: decimal("mastery_threshold", { precision: 5, scale: 2 }).default('80'),
  relatedActivities: jsonb("related_activities").default('[]'),
  tenantId: varchar("tenant_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Learner competency achievements
export const learnerCompetencies = pgTable("learner_competencies", {
  id: serial("id").primaryKey(),
  learnerId: varchar("learner_id", { length: 255 }).notNull(),
  competencyId: varchar("competency_id", { length: 255 }).notNull(),
  masteryLevel: decimal("mastery_level", { precision: 5, scale: 2 }).default('0'),
  achievedAt: timestamp("achieved_at"),
  verifiedBy: varchar("verified_by", { length: 255 }),
  evidence: jsonb("evidence"), // supporting xAPI statements
  tenantId: varchar("tenant_id", { length: 255 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_competency_learner").on(table.learnerId),
  index("idx_competency_comp").on(table.competencyId)
]);

// Export types
export type InsertXapiStatement = typeof xapiStatements.$inferInsert;
export type XapiStatement = typeof xapiStatements.$inferSelect;
export type InsertLearningRecordStore = typeof learningRecordStores.$inferInsert;
export type LearningRecordStore = typeof learningRecordStores.$inferSelect;
export type InsertLearningActivity = typeof learningActivities.$inferInsert;
export type LearningActivity = typeof learningActivities.$inferSelect;
export type InsertLearnerProfile = typeof learnerProfiles.$inferInsert;
export type LearnerProfile = typeof learnerProfiles.$inferSelect;
export type InsertLearningAnalytics = typeof learningAnalytics.$inferInsert;
export type LearningAnalytics = typeof learningAnalytics.$inferSelect;
export type InsertLearningPath = typeof learningPaths.$inferInsert;
export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearnerProgress = typeof learnerProgress.$inferInsert;
export type LearnerProgress = typeof learnerProgress.$inferSelect;
export type InsertCompetency = typeof competencies.$inferInsert;
export type Competency = typeof competencies.$inferSelect;
export type InsertLearnerCompetency = typeof learnerCompetencies.$inferInsert;
export type LearnerCompetency = typeof learnerCompetencies.$inferSelect;

// Validation schemas
export const insertXapiStatementSchema = createInsertSchema(xapiStatements);
export const insertLearningRecordStoreSchema = createInsertSchema(learningRecordStores);
export const insertLearningActivitySchema = createInsertSchema(learningActivities);
export const insertLearnerProfileSchema = createInsertSchema(learnerProfiles);
export const insertLearningAnalyticsSchema = createInsertSchema(learningAnalytics);
export const insertLearningPathSchema = createInsertSchema(learningPaths);
export const insertLearnerProgressSchema = createInsertSchema(learnerProgress);
export const insertCompetencySchema = createInsertSchema(competencies);
export const insertLearnerCompetencySchema = createInsertSchema(learnerCompetencies);