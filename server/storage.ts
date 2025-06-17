import {
  users,
  userSettings,
  institutions,
  students,
  teachers,
  classes,
  subjects,
  libraryResources,
  schedules,
  attendance,
  subscriptions,
  activityLogs,
  notifications,
  type User,
  type UpsertUser,
  type UserSettings,
  type InsertUserSettings,
  type Institution,
  type InsertInstitution,
  type Student,
  type InsertStudent,
  type Teacher,
  type InsertTeacher,
  type Class,
  type InsertClass,
  type Subject,
  type InsertSubject,
  type LibraryResource,
  type InsertLibraryResource,
  type Schedule,
  type InsertSchedule,
  type Attendance,
  type InsertAttendance,
  type Subscription,
  type InsertSubscription,
  type ActivityLog,
  type InsertActivityLog,
  type Notification,
  type InsertNotification,
  lockerItems,
  lockerCollections,
  type LockerItem,
  type InsertLockerItem,
  type LockerCollection,
  type InsertLockerCollection,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // User settings operations
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  
  // Institution operations
  getInstitution(id: string): Promise<Institution | undefined>;
  createInstitution(institution: InsertInstitution): Promise<Institution>;
  getInstitutions(): Promise<Institution[]>;
  
  // Student operations
  getStudent(id: number): Promise<Student | undefined>;
  getStudentsByInstitution(institutionId: string): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  
  // Teacher operations
  getTeacher(id: number): Promise<Teacher | undefined>;
  getTeachersByInstitution(institutionId: string): Promise<Teacher[]>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  
  // Class operations
  getClass(id: number): Promise<Class | undefined>;
  getClassesByInstitution(institutionId: string): Promise<Class[]>;
  createClass(classData: InsertClass): Promise<Class>;
  
  // Subject operations
  getSubject(id: number): Promise<Subject | undefined>;
  getSubjectsByInstitution(institutionId: string): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  
  // Library Resource operations
  getLibraryResource(id: number): Promise<LibraryResource | undefined>;
  getLibraryResources(filters?: { grade?: string; subject?: string; curriculum?: string }): Promise<LibraryResource[]>;
  getLibraryResourcesForUser(userId: string, filters?: { 
    grade?: string; 
    subject?: string; 
    curriculum?: string;
    type?: string;
    difficulty?: string;
  }): Promise<LibraryResource[]>;
  createLibraryResource(resource: InsertLibraryResource): Promise<LibraryResource>;
  updateLibraryResource(id: number, updates: Partial<LibraryResource>): Promise<LibraryResource>;
  
  // Schedule operations
  getSchedule(id: number): Promise<Schedule | undefined>;
  getSchedulesByInstitution(institutionId: string): Promise<Schedule[]>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  
  // Attendance operations
  getAttendance(studentId: number, scheduleId: number): Promise<Attendance | undefined>;
  getAttendanceBySchedule(scheduleId: number): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  
  // Subscription operations
  getSubscription(id: number): Promise<Subscription | undefined>;
  getSubscriptionsByInstitution(institutionId: string): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  
  // Activity Log operations
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getActivityLogs(userId?: string, institutionId?: string): Promise<ActivityLog[]>;
  
  // Notification operations
  getNotification(id: number): Promise<Notification | undefined>;
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<void>;
  
  // Dashboard analytics
  getDashboardStats(institutionId?: string): Promise<{
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    totalResources: number;
    activeSubscriptions: number;
  }>;
  
  // My Locker operations
  getLockerItem(id: number): Promise<LockerItem | undefined>;
  getLockerItemsByUser(userId: string): Promise<LockerItem[]>;
  createLockerItem(item: InsertLockerItem): Promise<LockerItem>;
  updateLockerItem(id: number, updates: Partial<LockerItem>): Promise<LockerItem>;
  deleteLockerItem(id: number): Promise<void>;
  
  // Locker Collection operations
  getLockerCollection(id: number): Promise<LockerCollection | undefined>;
  getLockerCollectionsByUser(userId: string): Promise<LockerCollection[]>;
  createLockerCollection(collection: InsertLockerCollection): Promise<LockerCollection>;
  updateLockerCollection(id: number, updates: Partial<LockerCollection>): Promise<LockerCollection>;
  deleteLockerCollection(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // User settings operations
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return settings;
  }

  async upsertUserSettings(settingsData: InsertUserSettings): Promise<UserSettings> {
    const [settings] = await db
      .insert(userSettings)
      .values(settingsData)
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: {
          ...settingsData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return settings;
  }

  // Institution operations
  async getInstitution(id: string): Promise<Institution | undefined> {
    const [institution] = await db.select().from(institutions).where(eq(institutions.id, id));
    return institution;
  }

  async createInstitution(institutionData: InsertInstitution): Promise<Institution> {
    const [institution] = await db
      .insert(institutions)
      .values([institutionData])
      .returning();
    return institution;
  }

  async getInstitutions(): Promise<Institution[]> {
    return await db.select().from(institutions).where(eq(institutions.isActive, true));
  }

  // Student operations
  async getStudent(id: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student;
  }

  async getStudentsByInstitution(institutionId: string): Promise<Student[]> {
    return await db
      .select()
      .from(students)
      .where(and(eq(students.institutionId, institutionId), eq(students.isActive, true)));
  }

  async createStudent(studentData: InsertStudent): Promise<Student> {
    const [student] = await db
      .insert(students)
      .values(studentData)
      .returning();
    return student;
  }

  // Teacher operations
  async getTeacher(id: number): Promise<Teacher | undefined> {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.id, id));
    return teacher;
  }

  async getTeachersByInstitution(institutionId: string): Promise<Teacher[]> {
    return await db
      .select()
      .from(teachers)
      .where(and(eq(teachers.institutionId, institutionId), eq(teachers.isActive, true)));
  }

  async createTeacher(teacherData: InsertTeacher): Promise<Teacher> {
    const [teacher] = await db
      .insert(teachers)
      .values(teacherData)
      .returning();
    return teacher;
  }

  // Class operations
  async getClass(id: number): Promise<Class | undefined> {
    const [classData] = await db.select().from(classes).where(eq(classes.id, id));
    return classData;
  }

  async getClassesByInstitution(institutionId: string): Promise<Class[]> {
    return await db
      .select()
      .from(classes)
      .where(and(eq(classes.institutionId, institutionId), eq(classes.isActive, true)));
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const [newClass] = await db
      .insert(classes)
      .values(classData)
      .returning();
    return newClass;
  }

  // Subject operations
  async getSubject(id: number): Promise<Subject | undefined> {
    const [subject] = await db.select().from(subjects).where(eq(subjects.id, id));
    return subject;
  }

  async getSubjectsByInstitution(institutionId: string): Promise<Subject[]> {
    return await db
      .select()
      .from(subjects)
      .where(and(eq(subjects.institutionId, institutionId), eq(subjects.isActive, true)));
  }

  async createSubject(subjectData: InsertSubject): Promise<Subject> {
    const [subject] = await db
      .insert(subjects)
      .values(subjectData)
      .returning();
    return subject;
  }

  // Library Resource operations with curriculum-based filtering
  async getLibraryResource(id: number): Promise<LibraryResource | undefined> {
    const [resource] = await db.select().from(libraryResources).where(eq(libraryResources.id, id));
    return resource;
  }

  async getLibraryResourcesForUser(userId: string, filters?: { 
    grade?: string; 
    subject?: string; 
    curriculum?: string;
    type?: string;
    difficulty?: string;
  }): Promise<LibraryResource[]> {
    // Get user profile to determine their academic context
    const user = await this.getUser(userId);
    if (!user) return [];

    // Determine user's academic level based on role
    let userGrade: string[] = [];
    let userCurriculum: string[] = [];

    if (user.role === 'student') {
      const student = await db.select().from(students).where(eq(students.userId, userId)).limit(1);
      if (student[0]) {
        userGrade = [student[0].grade];
        userCurriculum = student[0].curriculum ? [student[0].curriculum] : [];
      }
    } else if (user.role === 'teacher') {
      const teacher = await db.select().from(teachers).where(eq(teachers.userId, userId)).limit(1);
      if (teacher[0]) {
        // Teachers can access resources for their subjects and grade levels
        const teacherSubjects = await db.select().from(subjects)
          .where(eq(subjects.id, teacher[0].subjectId || 0));
        if (teacherSubjects.length > 0) {
          userGrade = teacherSubjects[0].grade ? [teacherSubjects[0].grade] : [];
          userCurriculum = teacherSubjects[0].curriculum ? [teacherSubjects[0].curriculum] : [];
        }
      }
    }

    // Build query with academic context filtering
    const conditions = [
      eq(libraryResources.isPublished, true),
      eq(libraryResources.isSharedGlobally, true)
    ];

    // Apply user's academic context if available
    if (userGrade.length > 0) {
      conditions.push(inArray(libraryResources.grade, userGrade));
    }
    if (userCurriculum.length > 0) {
      conditions.push(inArray(libraryResources.curriculum, userCurriculum));
    }

    // Apply additional filters
    if (filters?.grade) {
      conditions.push(eq(libraryResources.grade, filters.grade));
    }
    if (filters?.curriculum) {
      conditions.push(eq(libraryResources.curriculum, filters.curriculum));
    }
    if (filters?.type) {
      conditions.push(eq(libraryResources.type, filters.type));
    }
    if (filters?.difficulty) {
      conditions.push(eq(libraryResources.difficulty, filters.difficulty));
    }

    return await db.select()
      .from(libraryResources)
      .where(and(...conditions))
      .orderBy(desc(libraryResources.createdAt));
  }

  async getLibraryResources(filters?: { grade?: string; subject?: string; curriculum?: string }): Promise<LibraryResource[]> {
    const conditions = [eq(libraryResources.isPublished, true)];
    
    if (filters?.grade) {
      conditions.push(eq(libraryResources.grade, filters.grade));
    }
    if (filters?.curriculum) {
      conditions.push(eq(libraryResources.curriculum, filters.curriculum));
    }
    
    return await db.select()
      .from(libraryResources)
      .where(and(...conditions))
      .orderBy(desc(libraryResources.createdAt));
  }

  async createLibraryResource(resourceData: InsertLibraryResource): Promise<LibraryResource> {
    const [resource] = await db
      .insert(libraryResources)
      .values(resourceData)
      .returning();
    return resource;
  }

  async updateLibraryResource(id: number, updates: Partial<LibraryResource>): Promise<LibraryResource> {
    const [resource] = await db
      .update(libraryResources)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(libraryResources.id, id))
      .returning();
    return resource;
  }

  // Schedule operations
  async getSchedule(id: number): Promise<Schedule | undefined> {
    const [schedule] = await db.select().from(schedules).where(eq(schedules.id, id));
    return schedule;
  }

  async getSchedulesByInstitution(institutionId: string): Promise<Schedule[]> {
    return await db
      .select()
      .from(schedules)
      .where(eq(schedules.institutionId, institutionId))
      .orderBy(schedules.startTime);
  }

  async createSchedule(scheduleData: InsertSchedule): Promise<Schedule> {
    const [schedule] = await db
      .insert(schedules)
      .values(scheduleData)
      .returning();
    return schedule;
  }

  // Attendance operations
  async getAttendance(studentId: number, scheduleId: number): Promise<Attendance | undefined> {
    const [attendance] = await db
      .select()
      .from(attendance)
      .where(and(eq(attendance.studentId, studentId), eq(attendance.scheduleId, scheduleId)));
    return attendance;
  }

  async getAttendanceBySchedule(scheduleId: number): Promise<Attendance[]> {
    return await db
      .select()
      .from(attendance)
      .where(eq(attendance.scheduleId, scheduleId));
  }

  async createAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const [newAttendance] = await db
      .insert(attendance)
      .values(attendanceData)
      .returning();
    return newAttendance;
  }

  // Subscription operations
  async getSubscription(id: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return subscription;
  }

  async getSubscriptionsByInstitution(institutionId: string): Promise<Subscription[]> {
    return await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.institutionId, institutionId));
  }

  async createSubscription(subscriptionData: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db
      .insert(subscriptions)
      .values(subscriptionData)
      .returning();
    return subscription;
  }

  // Activity Log operations
  async createActivityLog(logData: InsertActivityLog): Promise<ActivityLog> {
    const [log] = await db
      .insert(activityLogs)
      .values(logData)
      .returning();
    return log;
  }

  async getActivityLogs(userId?: string, institutionId?: string): Promise<ActivityLog[]> {
    let query = db.select().from(activityLogs);
    
    if (userId) {
      query = query.where(eq(activityLogs.userId, userId));
    }
    if (institutionId) {
      query = query.where(eq(activityLogs.institutionId, institutionId));
    }
    
    return await query.orderBy(desc(activityLogs.createdAt)).limit(100);
  }

  // Notification operations
  async getNotification(id: number): Promise<Notification | undefined> {
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification;
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  // Dashboard analytics
  async getDashboardStats(institutionId?: string): Promise<{
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    totalResources: number;
    activeSubscriptions: number;
  }> {
    const studentsQuery = institutionId 
      ? db.select().from(students).where(and(eq(students.institutionId, institutionId), eq(students.isActive, true)))
      : db.select().from(students).where(eq(students.isActive, true));
    
    const teachersQuery = institutionId
      ? db.select().from(teachers).where(and(eq(teachers.institutionId, institutionId), eq(teachers.isActive, true)))
      : db.select().from(teachers).where(eq(teachers.isActive, true));
    
    const classesQuery = institutionId
      ? db.select().from(classes).where(and(eq(classes.institutionId, institutionId), eq(classes.isActive, true)))
      : db.select().from(classes).where(eq(classes.isActive, true));
    
    const resourcesQuery = db.select().from(libraryResources).where(eq(libraryResources.isPublished, true));
    
    const subscriptionsQuery = institutionId
      ? db.select().from(subscriptions).where(and(eq(subscriptions.institutionId, institutionId), eq(subscriptions.status, 'active')))
      : db.select().from(subscriptions).where(eq(subscriptions.status, 'active'));

    const [studentsResult, teachersResult, classesResult, resourcesResult, subscriptionsResult] = await Promise.all([
      studentsQuery,
      teachersQuery,
      classesQuery,
      resourcesQuery,
      subscriptionsQuery,
    ]);

    return {
      totalStudents: studentsResult.length,
      totalTeachers: teachersResult.length,
      totalClasses: classesResult.length,
      totalResources: resourcesResult.length,
      activeSubscriptions: subscriptionsResult.length,
    };
  }

  // My Locker operations
  async getLockerItem(id: number): Promise<LockerItem | undefined> {
    const [item] = await db.select().from(lockerItems).where(eq(lockerItems.id, id));
    return item;
  }

  async getLockerItemsByUser(userId: string): Promise<LockerItem[]> {
    return await db.select().from(lockerItems).where(eq(lockerItems.userId, userId));
  }

  async createLockerItem(itemData: InsertLockerItem): Promise<LockerItem> {
    const [item] = await db
      .insert(lockerItems)
      .values(itemData)
      .returning();
    return item;
  }

  async updateLockerItem(id: number, updates: Partial<LockerItem>): Promise<LockerItem> {
    const [item] = await db
      .update(lockerItems)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(lockerItems.id, id))
      .returning();
    return item;
  }

  async deleteLockerItem(id: number): Promise<void> {
    await db.delete(lockerItems).where(eq(lockerItems.id, id));
  }

  // Locker Collection operations
  async getLockerCollection(id: number): Promise<LockerCollection | undefined> {
    const [collection] = await db.select().from(lockerCollections).where(eq(lockerCollections.id, id));
    return collection;
  }

  async getLockerCollectionsByUser(userId: string): Promise<LockerCollection[]> {
    return await db.select().from(lockerCollections).where(eq(lockerCollections.userId, userId));
  }

  async createLockerCollection(collectionData: InsertLockerCollection): Promise<LockerCollection> {
    const [collection] = await db
      .insert(lockerCollections)
      .values(collectionData)
      .returning();
    return collection;
  }

  async updateLockerCollection(id: number, updates: Partial<LockerCollection>): Promise<LockerCollection> {
    const [collection] = await db
      .update(lockerCollections)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(lockerCollections.id, id))
      .returning();
    return collection;
  }

  async deleteLockerCollection(id: number): Promise<void> {
    await db.delete(lockerCollections).where(eq(lockerCollections.id, id));
  }
}

export const storage = new DatabaseStorage();
