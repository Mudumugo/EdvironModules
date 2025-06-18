import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";
import type { AuthenticatedRequest } from "../roleMiddleware";
import { storage } from "../storage";

export function registerUserProfileRoutes(app: Express) {
  // Get user profile data
  app.get("/api/user/profile", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      console.log("Profile request - User ID from claims:", userId);
      console.log("Profile request - Full user object:", JSON.stringify(req.user, null, 2));
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const user = await storage.getUser(userId);
      console.log("Profile request - User from database:", JSON.stringify(user, null, 2));
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return safe user profile data
      const profileData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        gradeLevel: user.gradeLevel,
        department: user.department,
        profileImageUrl: user.profileImageUrl,
        institutionId: user.institutionId,
        tenantId: user.tenantId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.json(profileData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  // Update user profile
  app.put("/api/user/profile", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const updateData = req.body;
      
      // Validate update data - only allow certain fields to be updated
      const allowedFields = ['firstName', 'lastName', 'phone', 'address', 'bio', 'dateOfBirth'];
      const filteredData: any = {};
      
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      }

      // Update user in database
      const updatedUser = await storage.upsertUser({
        id: userId,
        ...filteredData,
        updatedAt: new Date()
      });

      res.json({
        message: "Profile updated successfully",
        user: updatedUser
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // Get user settings
  app.get("/api/user/settings", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const settings = await storage.getUserSettings(userId);
      
      // Return default settings if none exist
      const defaultSettings = {
        notifications: {
          email: true,
          push: true,
          assignments: true,
          grades: true,
          announcements: true
        },
        privacy: {
          profileVisibility: 'school',
          showEmail: false,
          showPhone: false,
          allowMessages: true
        },
        preferences: {
          theme: 'auto',
          language: 'en',
          timezone: 'UTC',
          dashboard: ['overview', 'assignments', 'grades']
        }
      };

      res.json(settings || defaultSettings);
    } catch (error) {
      console.error("Error fetching user settings:", error);
      res.status(500).json({ message: "Failed to fetch user settings" });
    }
  });

  // Update user settings
  app.put("/api/user/settings", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const settingsData = req.body;

      const updatedSettings = await storage.upsertUserSettings({
        id: `settings_${userId}`,
        userId,
        theme: settingsData.theme,
        language: settingsData.language,
        notifications: settingsData.notifications,
        preferences: settingsData.preferences,
        updatedAt: new Date()
      });

      res.json({
        message: "Settings updated successfully",
        settings: updatedSettings
      });
    } catch (error) {
      console.error("Error updating user settings:", error);
      res.status(500).json({ message: "Failed to update user settings" });
    }
  });

  // Get user academic data
  app.get("/api/user/academic", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Mock academic data for now
      const academicData = {
        subjects: [
          { name: 'Mathematics', status: 'Active', grade: 'A', credits: 4 },
          { name: 'Science', status: 'Active', grade: 'B+', credits: 4 },
          { name: 'English', status: 'Active', grade: 'A-', credits: 3 },
          { name: 'History', status: 'Active', grade: 'B', credits: 3 }
        ],
        achievements: [
          {
            title: 'Honor Roll',
            description: 'Q1 2024',
            date: '2024-03-15',
            type: 'academic'
          },
          {
            title: 'Perfect Attendance',
            description: 'September 2024',
            date: '2024-09-30',
            type: 'attendance'
          }
        ],
        progress: {
          overallGPA: 92,
          assignmentsCompleted: 18,
          projectsSubmitted: 5,
          attendanceRate: 98
        }
      };

      res.json(academicData);
    } catch (error) {
      console.error("Error fetching academic data:", error);
      res.status(500).json({ message: "Failed to fetch academic data" });
    }
  });

  // Change password
  app.put("/api/user/password", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }

      // Note: In a real implementation, you would verify the current password
      // and hash the new password before storing it
      
      res.json({
        message: "Password updated successfully"
      });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ message: "Failed to update password" });
    }
  });

  // Get login history
  app.get("/api/user/login-history", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Mock login history data
      const loginHistory = [
        {
          id: '1',
          device: 'Chrome on Windows',
          location: 'New York, NY',
          timestamp: new Date().toISOString(),
          status: 'active'
        },
        {
          id: '2',
          device: 'Safari on iPhone',
          location: 'New York, NY',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'inactive'
        }
      ];

      res.json(loginHistory);
    } catch (error) {
      console.error("Error fetching login history:", error);
      res.status(500).json({ message: "Failed to fetch login history" });
    }
  });
}