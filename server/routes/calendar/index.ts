import type { Express } from "express";
import { registerEventRoutes } from "./events";

export function registerCalendarRoutes(app: Express) {
  registerEventRoutes(app);
}