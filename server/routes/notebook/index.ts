import type { Express } from "express";
import { registerNotebookRoutes } from "./notebooks";
import { registerSubjectRoutes } from "./subjects";
import { registerChapterRoutes } from "./chapters";
import { registerTopicRoutes } from "./topics";
import { registerPageRoutes } from "./pages";
import { registerStickyNoteRoutes } from "./stickyNotes";

export function registerNotebookModuleRoutes(app: Express) {
  registerNotebookRoutes(app);
  registerSubjectRoutes(app);
  registerChapterRoutes(app);
  registerTopicRoutes(app);
  registerPageRoutes(app);
  registerStickyNoteRoutes(app);
}