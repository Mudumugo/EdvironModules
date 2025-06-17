import type { Express } from "express";
import { storage } from "../storage";
import { setupAuth, isAuthenticated } from "../replitAuth";

export async function registerAuthRoutes(app: Express) {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "User ID not found" });
      }
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Demo login endpoint for role switching
  app.post('/api/auth/demo-login', async (req, res) => {
    try {
      const { role, name, email } = req.body;
      
      if (!role || !name || !email) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Generate a demo user ID based on role
      const demoUserId = `demo_${role}_${Date.now()}`;
      
      // Create or update demo user in database
      const user = await storage.upsertUser({
        id: demoUserId,
        email: email,
        firstName: name.split(' ')[0] || 'Demo',
        lastName: name.split(' ').slice(1).join(' ') || 'User',
        profileImageUrl: null,
        role: role,
        tenantId: 'demo_tenant',
        isActive: true,
        gradeLevel: role.includes('student') ? 'Grade 5' : null,
        department: role === 'teacher' ? 'General Education' : role === 'school_admin' ? 'Administration' : role === 'school_it_staff' ? 'Information Technology' : role === 'school_security' ? 'Security' : null
      });

      // Create a demo session
      (req.session as any).user = {
        id: user.id,
        claims: {
          sub: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          profile_image_url: user.profileImageUrl
        },
        role: user.role,
        tenantId: user.tenantId,
        access_token: 'demo_token',
        expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour
      };

      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          tenantId: user.tenantId
        }
      });
    } catch (error) {
      console.error("Demo login error:", error);
      res.status(500).json({ message: "Demo login failed" });
    }
  });

  // Demo logout endpoint
  app.post('/api/auth/demo-logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Protected route example
  app.get("/api/protected", isAuthenticated, async (req, res) => {
    const userId = req.user?.claims?.sub;
    res.json({ message: "Protected route accessed", userId });
  });
}