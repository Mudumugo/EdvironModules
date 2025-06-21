import type { Express } from "express";
import { registerSignupCoreRoutes } from "./core";
import { registerSchoolSignupRoutes } from "./school";

export function registerSignupRoutes(app: Express) {
  registerSignupCoreRoutes(app);
  registerSchoolSignupRoutes(app);
}