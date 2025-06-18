import type { Express, Response } from "express";
import { isAuthenticated } from "../replitAuth";
import { db } from "../db";
import { users } from "@shared/schema";
import { parentChildRelationships } from "@shared/schemas/education.schema";
import { eq, and } from "drizzle-orm";
import type { AuthenticatedRequest } from "../types/auth";



export function registerParentRoutes(app: Express) {
  // Get parent's children and their information
  app.get('/api/parent/children', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const sessionUser = (req.session as any)?.user;
      const userId = sessionUser?.id || req.user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Get parent-child relationships with child user details
      const relationships = await db
        .select({
          id: parentChildRelationships.id,
          parentUserId: parentChildRelationships.parentUserId,
          childUserId: parentChildRelationships.childUserId,
          relationship: parentChildRelationships.relationship,
          isPrimary: parentChildRelationships.isPrimary,
          canViewGrades: parentChildRelationships.canViewGrades,
          canViewAttendance: parentChildRelationships.canViewAttendance,
          canReceiveNotifications: parentChildRelationships.canReceiveNotifications,
          child: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            role: users.role,
            gradeLevel: users.gradeLevel,
            profileImageUrl: users.profileImageUrl
          }
        })
        .from(parentChildRelationships)
        .innerJoin(users, eq(parentChildRelationships.childUserId, users.id))
        .where(eq(parentChildRelationships.parentUserId, userId));

      res.json(relationships);
    } catch (error) {
      console.error("Error fetching parent's children:", error);
      res.status(500).json({ message: "Failed to fetch children information" });
    }
  });

  // Get announcements relevant to parent's children
  app.get('/api/parent/announcements', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const sessionUser = (req.session as any)?.user;
      const userId = sessionUser?.id || req.user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // For now, return demo announcements relevant to parents
      const announcements = [
        {
          id: 1,
          title: "Important: Early Dismissal Friday",
          content: "School will dismiss at 1:00 PM this Friday for teacher professional development.",
          priority: "high",
          targetAudience: "parents",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          type: "dismissal"
        },
        {
          id: 2,
          title: "Spring Concert - Save the Date",
          content: "Join us for our annual Spring Concert on March 15th at 7:00 PM in the school auditorium.",
          priority: "medium",
          targetAudience: "parents",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          type: "event"
        },
        {
          id: 3,
          title: "Parent-Teacher Conference Scheduling",
          content: "Spring parent-teacher conferences are now open for scheduling. Please log in to book your time slot.",
          priority: "medium",
          targetAudience: "parents",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          type: "conference"
        }
      ];

      res.json(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  // Get messages from teachers about parent's children
  app.get('/api/parent/messages', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const sessionUser = (req.session as any)?.user;
      const userId = sessionUser?.id || req.user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Get parent's children first
      const children = await db
        .select({
          childId: users.id,
          childName: users.firstName
        })
        .from(parentChildRelationships)
        .innerJoin(users, eq(parentChildRelationships.childUserId, users.id))
        .where(eq(parentChildRelationships.parentUserId, userId));

      // For now, return demo messages from teachers
      const messages = [
        {
          id: 1,
          fromTeacher: "Ms. Johnson",
          subject: "Math Teacher",
          content: "Alice is doing excellent work in algebra. She's showing great improvement in problem-solving skills.",
          regardingChild: "Alice",
          childId: children.find(c => c.childName === "Alice")?.childId || "demo-student-1",
          createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
          isRead: false,
          priority: "normal"
        },
        {
          id: 2,
          fromTeacher: "Mr. Davis",
          subject: "Science Teacher",
          content: "Reminder: Science project is due next Friday. Bob has chosen an interesting topic about renewable energy.",
          regardingChild: "Bob",
          childId: children.find(c => c.childName === "Bob")?.childId || "demo-student-2",
          createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000), // Yesterday
          isRead: true,
          priority: "normal"
        },
        {
          id: 3,
          fromTeacher: "Mrs. Wilson",
          subject: "English Teacher",
          content: "Great progress on the reading comprehension assignments. Keep up the excellent work!",
          regardingChild: "Demo",
          childId: children.find(c => c.childName === "Demo")?.childId || "demo_student_elementary",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          isRead: true,
          priority: "positive"
        }
      ];

      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Get child's academic progress (restricted to parent's children only)
  app.get('/api/parent/child/:childId/progress', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const sessionUser = (req.session as any)?.user;
      const userId = sessionUser?.id || req.user?.claims?.sub;
      const { childId } = req.params;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Verify this parent has access to this child
      const relationship = await db
        .select()
        .from(parentChildRelationships)
        .where(
          and(
            eq(parentChildRelationships.parentUserId, userId),
            eq(parentChildRelationships.childUserId, childId)
          )
        )
        .limit(1);

      if (relationship.length === 0) {
        return res.status(403).json({ message: "Access denied to this child's information" });
      }

      // Check if parent can view grades
      if (!relationship[0].canViewGrades) {
        return res.status(403).json({ message: "Access denied to view grades for this child" });
      }

      // Return demo progress data
      const progress = {
        childId,
        subjects: [
          {
            name: "Mathematics",
            currentGrade: "A-",
            progress: 85,
            assignments: {
              completed: 8,
              total: 10,
              upcoming: 2
            },
            recentActivities: [
              { date: new Date(), activity: "Algebra Quiz", score: "92%" },
              { date: new Date(Date.now() - 24 * 60 * 60 * 1000), activity: "Homework Assignment", score: "88%" }
            ]
          },
          {
            name: "Science",
            currentGrade: "B+",
            progress: 78,
            assignments: {
              completed: 6,
              total: 8,
              upcoming: 1
            },
            recentActivities: [
              { date: new Date(), activity: "Lab Report", score: "85%" },
              { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), activity: "Chapter Test", score: "82%" }
            ]
          },
          {
            name: "English",
            currentGrade: "A",
            progress: 92,
            assignments: {
              completed: 7,
              total: 8,
              upcoming: 1
            },
            recentActivities: [
              { date: new Date(), activity: "Essay Assignment", score: "95%" },
              { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), activity: "Reading Quiz", score: "90%" }
            ]
          }
        ],
        overallGrade: "A-",
        attendance: {
          present: 18,
          absent: 1,
          late: 0,
          percentage: 95
        }
      };

      res.json(progress);
    } catch (error) {
      console.error("Error fetching child progress:", error);
      res.status(500).json({ message: "Failed to fetch child progress" });
    }
  });

  // Get child's attendance (restricted to parent's children only)
  app.get('/api/parent/child/:childId/attendance', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const sessionUser = (req.session as any)?.user;
      const userId = sessionUser?.id || req.user?.claims?.sub;
      const { childId } = req.params;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Verify this parent has access to this child and can view attendance
      const relationship = await db
        .select()
        .from(parentChildRelationships)
        .where(
          and(
            eq(parentChildRelationships.parentUserId, userId),
            eq(parentChildRelationships.childUserId, childId)
          )
        )
        .limit(1);

      if (relationship.length === 0) {
        return res.status(403).json({ message: "Access denied to this child's information" });
      }

      if (!relationship[0].canViewAttendance) {
        return res.status(403).json({ message: "Access denied to view attendance for this child" });
      }

      // Return demo attendance data
      const attendance = {
        childId,
        summary: {
          totalDays: 20,
          present: 18,
          absent: 1,
          late: 1,
          percentage: 90
        },
        recentRecords: [
          { date: "2024-01-15", status: "present", notes: "" },
          { date: "2024-01-14", status: "present", notes: "" },
          { date: "2024-01-13", status: "late", notes: "Arrived 10 minutes late" },
          { date: "2024-01-12", status: "present", notes: "" },
          { date: "2024-01-11", status: "absent", notes: "Sick day" }
        ]
      };

      res.json(attendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      res.status(500).json({ message: "Failed to fetch attendance" });
    }
  });
}