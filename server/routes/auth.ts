import type { Express } from "express";

export async function registerAuthRoutes(app: Express) {
  // Simple auth endpoint that returns null for unauthenticated users
  app.get("/api/auth/user", (req, res) => {
    // For now, return null to allow mobile landing page to show
    res.status(401).json({ error: "Not authenticated" });
  });

  // Basic login endpoint
  app.post("/api/auth/login", (req, res) => {
    res.json({ success: true, user: { id: "demo", email: "demo@example.com", role: "student" } });
  });

  // Basic logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    res.json({ success: true });
  });
}