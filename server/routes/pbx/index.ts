import type { Express } from "express";
import { registerPBXCoreRoutes } from "./core";
import { registerPBXAdminRoutes } from "./admin";

export function registerPBXRoutes(app: Express) {
  registerPBXCoreRoutes(app);
  registerPBXAdminRoutes(app);
}