import type { Express } from "express";

export function registerNotebookModuleRoutes(app: Express) {
  // Import and register all notebook-related routes
  const { registerNotebookRoutes } = require("./notebooks");
  const { registerSubjectRoutes } = require("./subjects");
  const { registerChapterRoutes } = require("./chapters");
  const { registerTopicRoutes } = require("./topics");
  const { registerPageRoutes } = require("./pages");
  const { registerStickyNoteRoutes } = require("./stickyNotes");

  registerNotebookRoutes(app);
  registerSubjectRoutes(app);
  registerChapterRoutes(app);
  registerTopicRoutes(app);
  registerPageRoutes(app);
  registerStickyNoteRoutes(app);
}