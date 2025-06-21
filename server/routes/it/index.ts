import type { Express } from "express";
import { registerDeviceRoutes } from "./devices";
import { registerInfrastructureRoutes } from "./infrastructure";

export function registerITRoutes(app: Express) {
  registerDeviceRoutes(app);
  registerInfrastructureRoutes(app);
}