// Main schema entry point - re-exports from modular schemas
export * from "./schemas/core";
export * from "./schemas/roles";
export * from "./schemas/content";
export * from "./schemas/system";

// Relations
import { relations } from "drizzle-orm";
import { 
  users, 
  tenants, 
  userSettings
} from "./schemas/core";
import {
  libraryCategories,
  librarySubjects,
  libraryItems,
  assignments,
  assignmentSubmissions,
  notebooks,
  notebookSections,
  notebookPages,
  lockerItems,
  classes,
  timetableEntries,
  notebookActivity,
  subjects,
  chapters,
  topics,
  leads,
  leadActivities,
  demoRequests
} from "./schemas/content";
import {
  notifications,
  events,
  conversations,
  messages,
  devices
} from "./schemas/system";

// Define relationships
export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
  settings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
  libraryItems: many(libraryItems),
  assignments: many(assignments),
  submissions: many(assignmentSubmissions),
  notebooks: many(notebooks),
  lockerItems: many(lockerItems),
  notifications: many(notifications),
  events: many(events),
  devices: many(devices),
}));

export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  libraryCategories: many(libraryCategories),
  librarySubjects: many(librarySubjects),
  libraryItems: many(libraryItems),
  assignments: many(assignments),
  notebooks: many(notebooks),
  lockerItems: many(lockerItems),
  notifications: many(notifications),
  events: many(events),
}));

export const libraryCategoriesRelations = relations(libraryCategories, ({ many }) => ({
  subjects: many(librarySubjects),
  items: many(libraryItems),
}));

export const librarySubjectsRelations = relations(librarySubjects, ({ one, many }) => ({
  category: one(libraryCategories, {
    fields: [librarySubjects.categoryId],
    references: [libraryCategories.id],
  }),
  items: many(libraryItems),
  assignments: many(assignments),
  notebooks: many(notebooks),
}));

export const libraryItemsRelations = relations(libraryItems, ({ one }) => ({
  subject: one(librarySubjects, {
    fields: [libraryItems.subjectId],
    references: [librarySubjects.id],
  }),
  category: one(libraryCategories, {
    fields: [libraryItems.categoryId],
    references: [libraryCategories.id],
  }),
  author: one(users, {
    fields: [libraryItems.authorId],
    references: [users.id],
  }),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  teacher: one(users, {
    fields: [assignments.teacherId],
    references: [users.id],
  }),
  subject: one(librarySubjects, {
    fields: [assignments.subjectId],
    references: [librarySubjects.id],
  }),
  submissions: many(assignmentSubmissions),
}));

export const assignmentSubmissionsRelations = relations(assignmentSubmissions, ({ one }) => ({
  assignment: one(assignments, {
    fields: [assignmentSubmissions.assignmentId],
    references: [assignments.id],
  }),
  student: one(users, {
    fields: [assignmentSubmissions.studentId],
    references: [users.id],
  }),
  grader: one(users, {
    fields: [assignmentSubmissions.gradedBy],
    references: [users.id],
  }),
}));

export const notebooksRelations = relations(notebooks, ({ one, many }) => ({
  owner: one(users, {
    fields: [notebooks.ownerId],
    references: [users.id],
  }),
  subject: one(librarySubjects, {
    fields: [notebooks.subjectId],
    references: [librarySubjects.id],
  }),
  sections: many(notebookSections),
  pages: many(notebookPages),
}));

export const notebookSectionsRelations = relations(notebookSections, ({ one, many }) => ({
  notebook: one(notebooks, {
    fields: [notebookSections.notebookId],
    references: [notebooks.id],
  }),
  pages: many(notebookPages),
}));

export const notebookPagesRelations = relations(notebookPages, ({ one }) => ({
  notebook: one(notebooks, {
    fields: [notebookPages.notebookId],
    references: [notebooks.id],
  }),
  section: one(notebookSections, {
    fields: [notebookPages.sectionId],
    references: [notebookSections.id],
  }),
  lastEditor: one(users, {
    fields: [notebookPages.lastEditedBy],
    references: [users.id],
  }),
}));

export const lockerItemsRelations = relations(lockerItems, ({ one }) => ({
  owner: one(users, {
    fields: [lockerItems.ownerId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
  }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  creator: one(users, {
    fields: [conversations.createdBy],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const devicesRelations = relations(devices, ({ one }) => ({
  user: one(users, {
    fields: [devices.userId],
    references: [users.id],
  }),
}));