import type { Express } from "express";

// Simple demo users for testing different roles
const demoUsers = {
  "student@demo.com": { id: "demo-student", email: "student@demo.com", role: "student" },
  "teacher@demo.com": { id: "demo-teacher", email: "teacher@demo.com", role: "teacher" },
  "admin@demo.com": { id: "demo-admin", email: "admin@demo.com", role: "school_admin" },
  "it@demo.com": { id: "demo-it", email: "it@demo.com", role: "it_staff" },
  "security@demo.com": { id: "demo-security", email: "security@demo.com", role: "security_staff" }
};

let currentUser: any = null;

export async function registerAuthRoutes(app: Express) {
  // Auth endpoint that returns current user or 401
  app.get("/api/auth/user", (req, res) => {
    if (currentUser) {
      res.json(currentUser);
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  // Session endpoint
  app.get("/api/auth/session", (req, res) => {
    if (currentUser) {
      res.json({ user: currentUser });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  // Login endpoint with demo user support
  app.post("/api/auth/login", (req, res) => {
    const { email } = req.body;
    
    if (email && demoUsers[email as keyof typeof demoUsers]) {
      currentUser = demoUsers[email as keyof typeof demoUsers];
      res.json({ success: true, user: currentUser });
    } else {
      // Default to student for any other login
      currentUser = { id: "demo", email: "demo@example.com", role: "student" };
      res.json({ success: true, user: currentUser });
    }
  });

  // Demo login for quick role switching
  app.post("/api/auth/demo-login", (req, res) => {
    const { role } = req.body;
    
    const roleMapping = {
      student: demoUsers["student@demo.com"],
      teacher: demoUsers["teacher@demo.com"],
      school_admin: demoUsers["admin@demo.com"],
      it_staff: demoUsers["it@demo.com"],
      security_staff: demoUsers["security@demo.com"]
    };
    
    currentUser = roleMapping[role as keyof typeof roleMapping] || demoUsers["student@demo.com"];
    res.json({ success: true, user: currentUser });
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    currentUser = null;
    res.json({ success: true });
  });
}