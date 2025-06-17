import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { extractTenant, requireTenantFeature, type TenantRequest } from "./tenantMiddleware";
import { fileStorage, cache, initializeBuckets } from "./minioClient";
import { upload, UploadHandlers, handleUploadError } from "./uploadMiddleware";
import { insertUserSettingsSchema } from "@shared/schema";
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
  // Initialize MinIO buckets on startup
  try {
    await initializeBuckets();
  } catch (error) {
    console.error('Failed to initialize MinIO buckets:', error);
  }

  // Multi-tenant middleware - extract tenant from subdomain
  app.use(extractTenant);
  
  // Auth middleware
  await setupAuth(app);

  // Tenant information endpoint
  app.get('/api/tenant', (req: any, res) => {
    const tenant = req.tenant;
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    res.json(tenant);
  });

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
      
      const stats = await storage.getDashboardStats(institutionId || undefined);
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
      
      const activities = await storage.getActivityLogs(undefined, institutionId || undefined);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  // School Management routes
  
  // Students routes
  app.get('/api/students', isAuthenticated, async (req: any, res) => {
    try {
      const students = await storage.getStudentsByInstitution('demo');
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  app.post('/api/students', isAuthenticated, async (req: any, res) => {
    try {
      const student = await storage.createStudent({
        ...req.body,
        institutionId: 'demo',
      });
      res.json(student);
    } catch (error) {
      console.error("Error creating student:", error);
      res.status(500).json({ message: "Failed to create student" });
    }
  });

  // Teachers routes
  app.get('/api/teachers', isAuthenticated, async (req: any, res) => {
    try {
      const teachers = await storage.getTeachersByInstitution('demo');
      res.json(teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      res.status(500).json({ message: "Failed to fetch teachers" });
    }
  });

  app.post('/api/teachers', isAuthenticated, async (req: any, res) => {
    try {
      const teacher = await storage.createTeacher({
        ...req.body,
        institutionId: 'demo',
      });
      res.json(teacher);
    } catch (error) {
      console.error("Error creating teacher:", error);
      res.status(500).json({ message: "Failed to create teacher" });
    }
  });

  // Classes routes
  app.get('/api/classes', isAuthenticated, async (req: any, res) => {
    try {
      const classes = await storage.getClassesByInstitution('demo');
      res.json(classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
      res.status(500).json({ message: "Failed to fetch classes" });
    }
  });

  app.post('/api/classes', isAuthenticated, async (req: any, res) => {
    try {
      const classData = await storage.createClass({
        ...req.body,
        institutionId: 'demo',
      });
      res.json(classData);
    } catch (error) {
      console.error("Error creating class:", error);
      res.status(500).json({ message: "Failed to create class" });
    }
  });

  // Subjects routes
  app.get('/api/subjects', isAuthenticated, async (req: any, res) => {
    try {
      const subjects = await storage.getSubjectsByInstitution('demo');
      res.json(subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });

  app.post('/api/subjects', isAuthenticated, async (req: any, res) => {
    try {
      const subject = await storage.createSubject({
        ...req.body,
        institutionId: 'demo',
      });
      res.json(subject);
    } catch (error) {
      console.error("Error creating subject:", error);
      res.status(500).json({ message: "Failed to create subject" });
    }
  });

  // Settings routes
  app.get('/api/settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const settings = await storage.getUserSettings(userId);
      
      res.json({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        emailNotifications: settings?.emailNotifications ?? true,
        smsNotifications: settings?.smsNotifications ?? false,
        pushNotifications: settings?.pushNotifications ?? true,
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.get('/api/payment-status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const settings = await storage.getUserSettings(userId);
      
      res.json({
        configured: !!(settings?.stripePublishableKey && settings?.stripeSecretKey)
      });
    } catch (error) {
      console.error("Error fetching payment status:", error);
      res.status(500).json({ message: "Failed to fetch payment status" });
    }
  });

  app.post('/api/settings/payment', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const paymentSettingsSchema = z.object({
        stripePublishableKey: z.string().min(1, "Publishable key is required").startsWith("pk_", "Must start with pk_"),
        stripeSecretKey: z.string().min(1, "Secret key is required").startsWith("sk_", "Must start with sk_"),
      });

      const validatedData = paymentSettingsSchema.parse(req.body);
      
      await storage.upsertUserSettings({
        userId,
        stripePublishableKey: validatedData.stripePublishableKey,
        stripeSecretKey: validatedData.stripeSecretKey,
      });

      res.json({ message: "Payment settings updated successfully" });
    } catch (error) {
      console.error("Error updating payment settings:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to update payment settings" });
    }
  });

  app.put('/api/settings/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileSchema = z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email address"),
      });

      const validatedData = profileSchema.parse(req.body);
      
      await storage.upsertUser({
        id: userId,
        tenantId: req.tenant?.id || 'default',
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
      });

      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.put('/api/settings/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notificationSchema = z.object({
        emailNotifications: z.boolean(),
        smsNotifications: z.boolean(),
        pushNotifications: z.boolean(),
      });

      const validatedData = notificationSchema.parse(req.body);
      
      await storage.upsertUserSettings({
        userId,
        ...validatedData,
      });

      res.json({ message: "Notification settings updated successfully" });
    } catch (error) {
      console.error("Error updating notification settings:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to update notification settings" });
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

  // Library Resource routes - with curriculum-based filtering
  app.get('/api/library/resources', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { grade, subject, curriculum, type, difficulty } = req.query;
      const filters = {
        grade: grade as string,
        subject: subject as string,
        curriculum: curriculum as string,
        type: type as string,
        difficulty: difficulty as string,
      };
      
      // Use curriculum-aware filtering based on user profile
      const resources = await storage.getLibraryResourcesForUser(userId, filters);
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
        authorId: user!.id,
      });

      // Log activity
      await storage.createActivityLog({
        userId: user!.id,
        institutionId: user!.institutionId || '',
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
        recordedBy: user!.id,
      });

      // Log activity
      await storage.createActivityLog({
        userId: user!.id,
        institutionId: user!.institutionId || '',
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
        institutionId: user?.institutionId || '',
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

  // My Locker API routes
  app.get('/api/locker/items', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const items = await storage.getLockerItemsByUser(userId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching locker items:", error);
      res.status(500).json({ message: "Failed to fetch locker items" });
    }
  });

  app.post('/api/locker/items', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const itemData = { ...req.body, userId };
      const item = await storage.createLockerItem(itemData);
      res.json(item);
    } catch (error) {
      console.error("Error creating locker item:", error);
      res.status(500).json({ message: "Failed to create locker item" });
    }
  });

  app.put('/api/locker/items/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const item = await storage.updateLockerItem(id, updates);
      res.json(item);
    } catch (error) {
      console.error("Error updating locker item:", error);
      res.status(500).json({ message: "Failed to update locker item" });
    }
  });

  app.delete('/api/locker/items/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteLockerItem(id);
      res.json({ message: "Item deleted successfully" });
    } catch (error) {
      console.error("Error deleting locker item:", error);
      res.status(500).json({ message: "Failed to delete locker item" });
    }
  });

  app.get('/api/locker/collections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const collections = await storage.getLockerCollectionsByUser(userId);
      res.json(collections);
    } catch (error) {
      console.error("Error fetching locker collections:", error);
      res.status(500).json({ message: "Failed to fetch locker collections" });
    }
  });

  app.post('/api/locker/collections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const collectionData = { ...req.body, userId };
      const collection = await storage.createLockerCollection(collectionData);
      res.json(collection);
    } catch (error) {
      console.error("Error creating locker collection:", error);
      res.status(500).json({ message: "Failed to create locker collection" });
    }
  });

  app.put('/api/locker/collections/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const collection = await storage.updateLockerCollection(id, updates);
      res.json(collection);
    } catch (error) {
      console.error("Error updating locker collection:", error);
      res.status(500).json({ message: "Failed to update locker collection" });
    }
  });

  app.delete('/api/locker/collections/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteLockerCollection(id);
      res.json({ message: "Collection deleted successfully" });
    } catch (error) {
      console.error("Error deleting locker collection:", error);
      res.status(500).json({ message: "Failed to delete locker collection" });
    }
  });

  // File Upload Routes with MinIO and Caching
  app.post('/api/upload/library-resource', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const metadata = {
        userId: req.user.claims.sub,
        title: req.body.title || req.file.originalname,
        description: req.body.description || '',
        grade: req.body.grade || '',
        curriculum: req.body.curriculum || '',
        subject: req.body.subject || '',
        tags: req.body.tags || '',
      };

      const result = await UploadHandlers.uploadLibraryResource(req.file, metadata);
      
      // Cache the upload result
      cache.set(`upload:${result.fileId}`, result, 3600);
      
      res.json({
        success: true,
        fileId: result.fileId,
        url: result.originalUrl,
        thumbnailUrl: result.thumbnailUrl,
        metadata: result.metadata,
      });
    } catch (error) {
      console.error('Error uploading library resource:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });

  app.post('/api/upload/user-file', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const userId = req.user.claims.sub;
      const folder = req.body.folder || 'general';
      
      const result = await UploadHandlers.uploadUserFile(userId, req.file, folder);
      
      // Cache the upload result
      cache.set(`user-upload:${result.fileId}`, result, 3600);
      
      res.json({
        success: true,
        fileId: result.fileId,
        url: result.url,
        metadata: result.metadata,
      });
    } catch (error) {
      console.error('Error uploading user file:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });

  app.post('/api/upload/multiple', isAuthenticated, upload.array('files', 10), async (req: any, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files provided' });
      }

      const userId = req.user.claims.sub;
      const folder = req.body.folder || 'general';
      const uploadPromises = files.map(file => UploadHandlers.uploadUserFile(userId, file, folder));
      
      const results = await Promise.all(uploadPromises);
      
      // Cache all results
      results.forEach(result => {
        cache.set(`user-upload:${result.fileId}`, result, 3600);
      });
      
      res.json({
        success: true,
        files: results,
      });
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      res.status(500).json({ error: 'Failed to upload files' });
    }
  });

  // File Retrieval Routes with Caching
  app.get('/api/files/:fileId', isAuthenticated, async (req: any, res) => {
    try {
      const { fileId } = req.params;
      
      // Check cache first
      const cachedFile = cache.get(`file-url:${fileId}`);
      if (cachedFile) {
        return res.json(cachedFile);
      }

      // Generate presigned URL (this would work with actual MinIO)
      const url = await fileStorage.generatePresignedUrl('user-uploads', fileId);
      
      const result = { fileId, url, cached: false };
      cache.set(`file-url:${fileId}`, result, 900); // 15 minutes cache
      
      res.json(result);
    } catch (error) {
      console.error('Error retrieving file:', error);
      res.status(500).json({ error: 'Failed to retrieve file' });
    }
  });

  app.get('/api/files/:fileId/metadata', isAuthenticated, async (req: any, res) => {
    try {
      const { fileId } = req.params;
      
      // Check cache first
      const cachedMetadata = cache.get(`metadata:${fileId}`);
      if (cachedMetadata) {
        return res.json({ ...cachedMetadata, cached: true });
      }

      // Get metadata from MinIO (would work with actual MinIO)
      const metadata = await fileStorage.getFileMetadata('user-uploads', fileId);
      
      cache.set(`metadata:${fileId}`, metadata, 1800); // 30 minutes cache
      
      res.json({ ...metadata, cached: false });
    } catch (error) {
      console.error('Error retrieving file metadata:', error);
      res.status(500).json({ error: 'Failed to retrieve file metadata' });
    }
  });

  // Cache Management Routes
  app.get('/api/cache/stats', isAuthenticated, async (req: any, res) => {
    try {
      const stats = fileStorage.getCacheStats();
      res.json({
        success: true,
        cacheStats: stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error getting cache stats:', error);
      res.status(500).json({ error: 'Failed to get cache statistics' });
    }
  });

  app.post('/api/cache/clear', isAuthenticated, async (req: any, res) => {
    try {
      const { cacheType } = req.body;
      fileStorage.clearCache(cacheType);
      
      res.json({
        success: true,
        message: `${cacheType || 'All'} cache cleared successfully`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
      res.status(500).json({ error: 'Failed to clear cache' });
    }
  });

  // File listing with caching
  app.get('/api/files/list/:bucket', isAuthenticated, async (req: any, res) => {
    try {
      const { bucket } = req.params;
      const { prefix } = req.query;
      
      // Check cache first
      const cacheKey = `list:${bucket}:${prefix || 'root'}`;
      const cachedList = cache.get(cacheKey);
      if (cachedList) {
        return res.json({ files: cachedList, cached: true });
      }

      // Get file list from MinIO (would work with actual MinIO)
      const files = await fileStorage.listFiles(bucket, prefix as string);
      
      res.json({ files, cached: false });
    } catch (error) {
      console.error('Error listing files:', error);
      res.status(500).json({ error: 'Failed to list files' });
    }
  });

  // Error handling middleware for uploads
  app.use(handleUploadError);

  const httpServer = createServer(app);
  return httpServer;
}
