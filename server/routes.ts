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
import { setupAssessmentBookRoutes } from "./routes/assessmentBook";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication first
  const { setupAuth } = await import("./replitAuth");
  await setupAuth(app);
  
  // Simple admin login test page
  app.get('/admin-test', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admin Login Test</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; background: #1e40af; color: white; text-align: center; }
          button { background: #059669; color: white; border: none; padding: 15px 30px; font-size: 18px; border-radius: 8px; cursor: pointer; margin: 10px; }
          button:hover { background: #047857; }
          .status { margin: 20px 0; font-size: 16px; }
        </style>
      </head>
      <body>
        <h1>EdVirons Admin Login Test</h1>
        <div class="status" id="status">Click button to login as admin</div>
        <button onclick="loginAdmin()">Login as Admin</button>
        <div id="result"></div>
        
        <script>
          async function loginAdmin() {
            document.getElementById('status').textContent = 'Logging in...';
            try {
              const response = await fetch('/api/auth/demo-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email: 'demo.admin@edvirons.com' })
              });
              
              const data = await response.json();
              
              if (data.success) {
                document.getElementById('status').textContent = 'Login successful! Redirecting...';
                window.location.href = '/';
              } else {
                document.getElementById('status').textContent = 'Login failed: ' + (data.error || 'Unknown error');
              }
            } catch (error) {
              document.getElementById('status').textContent = 'Error: ' + error.message;
            }
          }
        </script>
      </body>
      </html>
    `);
  });

  // Register all modularized routes
  await registerAuthRoutes(app);
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
  setupAssessmentBookRoutes(app);
  
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