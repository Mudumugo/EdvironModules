import type { Express } from "express";
import { registerNotificationCoreRoutes } from "./core";
import { registerNotificationAdminRoutes } from "./admin";

export function registerNotificationRoutes(app: Express) {
  registerNotificationCoreRoutes(app);
  registerNotificationAdminRoutes(app);
}