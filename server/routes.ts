import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerAuthRoutes } from "./routes/auth";
import { registerXapiRoutes } from "./routes/xapi";
import { registerAnalyticsRoutes } from "./routes/analytics";
import { registerTeacherRoutes } from "./routes/teacher";
import { registerDeviceRoutes } from "./routes/devices";
import { registerMediaRoutes } from "./routes/media";
import { registerLicensingRoutes } from "./routes/licensing";
import { registerTenantRoutes } from "./routes/tenant";
import { registerUserRoutes } from "./routes/users-simple";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register all modularized routes
  await registerAuthRoutes(app);
  registerXapiRoutes(app);
  registerAnalyticsRoutes(app);
  registerTeacherRoutes(app);
  registerDeviceRoutes(app);
  registerMediaRoutes(app);
  registerLicensingRoutes(app);
  registerTenantRoutes(app);
  registerUserRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}