import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertStudentSchema,
  insertTeacherSchema,
  insertClassSchema,
  insertSubjectSchema,
  insertLibraryResourceSchema,
  insertScheduleSchema,
  insertAttendanceSchema,
  insertNotificationSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      const institutionId = user?.institutionId;
      
      const stats = await storage.getDashboardStats(institutionId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get('/api/dashboard/recent-activity', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      const institutionId = user?.institutionId;
      
      const activities = await storage.getActivityLogs(undefined, institutionId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  // Student routes
  app.get('/api/students', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.institutionId) {
        return res.status(403).json({ message: "Access denied: No institution association" });
      }
      
      const students = await storage.getStudentsByInstitution(user.institutionId);
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  app.post('/api/students', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.institutionId || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const studentData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent({
        ...studentData,
        institutionId: user.institutionId,
      });

      // Log activity
      await storage.createActivityLog({
        userId: user.id,
        institutionId: user.institutionId,
        action: 'create_student',
        module: 'school_management',
        resourceId: student.id.toString(),
        resourceType: 'student',
      });

      res.json(student);
    } catch (error) {
      console.error("Error creating student:", error);
      res.status(500).json({ message: "Failed to create student" });
    }
  });

  // Teacher routes
  app.get('/api/teachers', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.institutionId) {
        return res.status(403).json({ message: "Access denied: No institution association" });
      }
      
      const teachers = await storage.getTeachersByInstitution(user.institutionId);
      res.json(teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      res.status(500).json({ message: "Failed to fetch teachers" });
    }
  });

  app.post('/api/teachers', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.institutionId || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const teacherData = insertTeacherSchema.parse(req.body);
      const teacher = await storage.createTeacher({
        ...teacherData,
        institutionId: user.institutionId,
      });

      // Log activity
      await storage.createActivityLog({
        userId: user.id,
        institutionId: user.institutionId,
        action: 'create_teacher',
        module: 'school_management',
        resourceId: teacher.id.toString(),
        resourceType: 'teacher',
      });

      res.json(teacher);
    } catch (error) {
      console.error("Error creating teacher:", error);
      res.status(500).json({ message: "Failed to create teacher" });
    }
  });

  // Class routes
  app.get('/api/classes', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.institutionId) {
        return res.status(403).json({ message: "Access denied: No institution association" });
      }
      
      const classes = await storage.getClassesByInstitution(user.institutionId);
      res.json(classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
      res.status(500).json({ message: "Failed to fetch classes" });
    }
  });

  app.post('/api/classes', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.institutionId || !['admin', 'teacher'].includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const classData = insertClassSchema.parse(req.body);
      const newClass = await storage.createClass({
        ...classData,
        institutionId: user.institutionId,
      });

      // Log activity
      await storage.createActivityLog({
        userId: user.id,
        institutionId: user.institutionId,
        action: 'create_class',
        module: 'school_management',
        resourceId: newClass.id.toString(),
        resourceType: 'class',
      });

      res.json(newClass);
    } catch (error) {
      console.error("Error creating class:", error);
      res.status(500).json({ message: "Failed to create class" });
    }
  });

  // Subject routes
  app.get('/api/subjects', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.institutionId) {
        return res.status(403).json({ message: "Access denied: No institution association" });
      }
      
      const subjects = await storage.getSubjectsByInstitution(user.institutionId);
      res.json(subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });

  app.post('/api/subjects', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.institutionId || !['admin', 'teacher'].includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const subjectData = insertSubjectSchema.parse(req.body);
      const subject = await storage.createSubject({
        ...subjectData,
        institutionId: user.institutionId,
      });

      // Log activity
      await storage.createActivityLog({
        userId: user.id,
        institutionId: user.institutionId,
        action: 'create_subject',
        module: 'school_management',
        resourceId: subject.id.toString(),
        resourceType: 'subject',
      });

      res.json(subject);
    } catch (error) {
      console.error("Error creating subject:", error);
      res.status(500).json({ message: "Failed to create subject" });
    }
  });

  // Library Resource routes
  app.get('/api/library/resources', isAuthenticated, async (req: any, res) => {
    try {
      const { grade, subject, curriculum } = req.query;
      const filters = {
        grade: grade as string,
        subject: subject as string,
        curriculum: curriculum as string,
      };
      
      const resources = await storage.getLibraryResources(filters);
      res.json(resources);
    } catch (error) {
      console.error("Error fetching library resources:", error);
      res.status(500).json({ message: "Failed to fetch library resources" });
    }
  });

  app.post('/api/library/resources', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!['admin', 'teacher', 'tutor'].includes(user?.role || '')) {
        return res.status(403).json({ message: "Access denied" });
      }

      const resourceData = insertLibraryResourceSchema.parse(req.body);
      const resource = await storage.createLibraryResource({
        ...resourceData,
        authorId: user.id,
      });

      // Log activity
      await storage.createActivityLog({
        userId: user.id,
        institutionId: user.institutionId,
        action: 'create_resource',
        module: 'digital_library',
        resourceId: resource.id.toString(),
        resourceType: 'library_resource',
      });

      res.json(resource);
    } catch (error) {
      console.error("Error creating library resource:", error);
      res.status(500).json({ message: "Failed to create library resource" });
    }
  });

  // Schedule routes
  app.get('/api/schedules', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.institutionId) {
        return res.status(403).json({ message: "Access denied: No institution association" });
      }
      
      const schedules = await storage.getSchedulesByInstitution(user.institutionId);
      res.json(schedules);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      res.status(500).json({ message: "Failed to fetch schedules" });
    }
  });

  app.post('/api/schedules', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.institutionId || !['admin', 'teacher', 'tutor'].includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const scheduleData = insertScheduleSchema.parse(req.body);
      const schedule = await storage.createSchedule({
        ...scheduleData,
        institutionId: user.institutionId,
      });

      // Log activity
      await storage.createActivityLog({
        userId: user.id,
        institutionId: user.institutionId,
        action: 'create_schedule',
        module: 'scheduling',
        resourceId: schedule.id.toString(),
        resourceType: 'schedule',
      });

      res.json(schedule);
    } catch (error) {
      console.error("Error creating schedule:", error);
      res.status(500).json({ message: "Failed to create schedule" });
    }
  });

  // Attendance routes
  app.get('/api/attendance/:scheduleId', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.institutionId) {
        return res.status(403).json({ message: "Access denied: No institution association" });
      }

      const scheduleId = parseInt(req.params.scheduleId);
      const attendance = await storage.getAttendanceBySchedule(scheduleId);
      res.json(attendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      res.status(500).json({ message: "Failed to fetch attendance" });
    }
  });

  app.post('/api/attendance', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!['admin', 'teacher'].includes(user?.role || '')) {
        return res.status(403).json({ message: "Access denied" });
      }

      const attendanceData = insertAttendanceSchema.parse(req.body);
      const attendance = await storage.createAttendance({
        ...attendanceData,
        recordedBy: user.id,
      });

      // Log activity
      await storage.createActivityLog({
        userId: user.id,
        institutionId: user.institutionId,
        action: 'record_attendance',
        module: 'school_management',
        resourceId: attendance.id.toString(),
        resourceType: 'attendance',
      });

      res.json(attendance);
    } catch (error) {
      console.error("Error recording attendance:", error);
      res.status(500).json({ message: "Failed to record attendance" });
    }
  });

  // Notification routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotificationsByUser(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!['admin', 'teacher'].includes(user?.role || '')) {
        return res.status(403).json({ message: "Access denied" });
      }

      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification({
        ...notificationData,
        institutionId: user.institutionId,
      });

      res.json(notification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  app.patch('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      await storage.markNotificationAsRead(notificationId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Institution routes
  app.get('/api/institutions', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const institutions = await storage.getInstitutions();
      res.json(institutions);
    } catch (error) {
      console.error("Error fetching institutions:", error);
      res.status(500).json({ message: "Failed to fetch institutions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
