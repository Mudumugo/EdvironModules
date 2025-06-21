import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerAuthRoutes } from "./routes/auth";
import { signupRoutes } from "./routes/signup";
import { registerXapiRoutes } from "./routes/xapi";
import { registerDevicePolicyRoutes } from "./routes/devicePolicies";
import { registerAnalyticsRoutes } from "./routes/analytics";
import { registerTeacherRoutes } from "./routes/teacher";
import { registerNotificationRoutes } from "./routes/notifications";
import { registerDeviceRoutes } from "./routes/devices";
import { registerMediaRoutes } from "./routes/media";
import { registerLicensingRoutes } from "./routes/licensing";
import { registerTenantRoutes } from "./routes/tenant";
import { registerUserRoutes } from "./routes/users-simple";
import { registerLibraryRoutes } from "./routes/library";
import { registerITRoutes } from "./routes/it";
import { registerSecurityRoutes } from "./routes/security";
import { registerAdminRoutes } from "./routes/admin";
import { registerPBXRoutes } from "./routes/pbx";
import { registerParentRoutes } from "./routes/parent";
import { registerParentManagementRoutes } from "./routes/parentManagement";
import { registerAppsHubRoutes } from "./routes/appsHub";
import { registerTimetableRoutes } from "./routes/timetable";
import { registerUserProfileRoutes } from "./routes/userProfile";
import { registerNotebookModuleRoutes } from "./routes/notebook/index";
import { registerAuthoringRoutes } from "./routes/authoring";
import { registerLiveSessionRoutes } from "./routes/liveSessions";
import { registerCalendarRoutes } from "./routes/calendar";
import { registerAssignmentRoutes } from "./routes/assignments";
import { registerLibraryRoutes } from "./routes/library";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication first
  const { setupAuth } = await import("./replitAuth");
  await setupAuth(app);
  
  // Register all modularized routes
  await registerAuthRoutes(app);
  
  // Demo authentication routes
  const { registerDemoAuthRoutes } = await import('./routes/demo-auth');
  registerDemoAuthRoutes(app);
  registerXapiRoutes(app);
  registerDevicePolicyRoutes(app);
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
  registerUserProfileRoutes(app);
  registerNotebookModuleRoutes(app);
  registerAuthoringRoutes(app);
  registerCalendarRoutes(app);
  
  // Import OneNote-inspired notebook routes
  const { registerNotebookRoutes } = await import('./routes/notebook/notebooks');
  registerNotebookRoutes(app);

  // CRM routes
  const { registerCRMRoutes } = await import("./routes/crm");
  registerCRMRoutes(app);

  const { registerLockerRoutes } = await import("./routes/locker");
  registerLockerRoutes(app);

  const httpServer = createServer(app);
  
  // Register live session routes with WebSocket support
  registerLiveSessionRoutes(app, httpServer);

  return httpServer;
}