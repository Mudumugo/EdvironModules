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
import { registerLibraryRoutes } from "./routes/library";
import { registerITRoutes } from "./routes/it";
import { registerSecurityRoutes } from "./routes/security";
import { registerPBXRoutes } from "./routes/pbx";
import { registerParentRoutes } from "./routes/parent";
import { registerParentManagementRoutes } from "./routes/parentManagement";
import { registerAppsHubRoutes } from "./routes/appsHub";
import { registerAdminRoutes } from "./routes/admin";
import { registerTimetableRoutes } from "./routes/timetable";
import { registerNotebookModuleRoutes } from "./routes/notebook/index";

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
  registerLibraryRoutes(app);
  registerITRoutes(app);
  registerSecurityRoutes(app);
  registerPBXRoutes(app);
  registerParentRoutes(app);
  registerParentManagementRoutes(app);
  registerAppsHubRoutes(app);
  registerAdminRoutes(app);
  registerTimetableRoutes(app);
  registerNotebookModuleRoutes(app);

  const { registerLockerRoutes } = await import("./routes/locker");
  registerLockerRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}