import type { Express, Request, Response } from "express";

// Simple demo users for testing different roles
const demoUsers = {
  "student@demo.com": { id: "demo-student", email: "student@demo.com", role: "student", tenantId: "demo-tenant" },
  "teacher@demo.com": { id: "demo-teacher", email: "teacher@demo.com", role: "teacher", tenantId: "demo-tenant" },
  "admin@demo.com": { id: "demo-admin", email: "admin@demo.com", role: "school_admin", tenantId: "demo-tenant" },
  "it@demo.com": { id: "demo-it", email: "it@demo.com", role: "it_staff", tenantId: "demo-tenant" },
  "security@demo.com": { id: "demo-security", email: "security@demo.com", role: "security_staff", tenantId: "demo-tenant" }
};

// Session-based authentication using Express session
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      email: string;
      role: string;
      tenantId: string;
    };
  }
}

export async function registerAuthRoutes(app: Express) {
  // Auth endpoint that returns current user or 401
  app.get("/api/auth/user", (req: Request, res: Response) => {
    if (req.session.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  // Session endpoint
  app.get("/api/auth/session", (req: Request, res: Response) => {
    if (req.session.user) {
      res.json({ user: req.session.user });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  // Login endpoint with demo user support
  app.post("/api/auth/login", (req: Request, res: Response) => {
    const { email } = req.body;
    
    if (email && demoUsers[email as keyof typeof demoUsers]) {
      req.session.user = demoUsers[email as keyof typeof demoUsers];
      res.json({ success: true, user: req.session.user });
    } else {
      // Default to teacher for any other login
      req.session.user = { id: "demo", email: "demo@example.com", role: "student" };
      res.json({ success: true, user: req.session.user });
    }
  });

  // Demo login for quick role switching
  app.post("/api/auth/demo-login", (req: Request, res: Response) => {
    const { email, role } = req.body;
    
    // Check if email is provided first
    if (email && demoUsers[email as keyof typeof demoUsers]) {
      req.session.user = demoUsers[email as keyof typeof demoUsers];
      res.json({ success: true, user: req.session.user });
      return;
    }
    
    // Fallback to role-based mapping
    const roleMapping = {
      student: demoUsers["student@demo.com"],
      teacher: demoUsers["teacher@demo.com"],
      school_admin: demoUsers["admin@demo.com"],
      it_staff: demoUsers["it@demo.com"],
      security_staff: demoUsers["security@demo.com"]
    };
    
    req.session.user = roleMapping[role as keyof typeof roleMapping] || demoUsers["teacher@demo.com"];
    res.json({ success: true, user: req.session.user });
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ error: "Failed to logout" });
      } else {
        res.json({ success: true });
      }
    });
  });
}