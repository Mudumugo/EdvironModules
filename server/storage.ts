
import {
  users,
  userSettings,
  leads,
  leadActivities,
  demoRequests,
  type User,
  type UpsertUser,
  type UserSettings,
  type InsertUserSettings,
  type LibraryCategory,
  type LibraryResource,
  type Lead,
  type InsertLead,
  type LeadActivity,
  type InsertLeadActivity,
  type DemoRequest,
  type InsertDemoRequest
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(userId: string, role: string, gradeLevel?: string, department?: string): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;
  getUsersByGradeLevel(gradeLevel: string): Promise<User[]>;
  getUsersByDepartment(department: string): Promise<User[]>;
  getUsersByTenant(tenantId: string): Promise<User[]>;
  updateUserGradeLevel(userId: string, gradeLevel: string): Promise<User>;
  updateUserDepartment(userId: string, department: string): Promise<User>;
  deactivateUser(userId: string): Promise<User>;
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  updateUserSettings(userId: string, settings: Partial<InsertUserSettings>): Promise<UserSettings>;
  searchUsers(query: string): Promise<User[]>;
  getTenantUsers(tenantId: string): Promise<User[]>;

  // Library operations
  getLibraryCategories(gradeLevel?: string): Promise<LibraryCategory[]>;
  getLibrarySubjects(gradeLevel?: string, categoryId?: string): Promise<any[]>;
  getLibraryResources(filters?: any): Promise<LibraryResource[]>;
  getLibraryResource(id: string): Promise<LibraryResource | undefined>;
  createLibraryResource(resource: any): Promise<LibraryResource>;
  updateLibraryResource(id: string, updates: any): Promise<LibraryResource>;
  deleteLibraryResource(id: string): Promise<void>;
  searchLibraryResources(query: string, filters?: any): Promise<LibraryResource[]>;
  createLibraryResourceAccess(accessData: any): Promise<any>;
  updateResourceStats(resourceId: string, updateType: 'view' | 'download'): Promise<void>;
  getResourceCountsBySubject(gradeLevel: string): Promise<{ [subjectId: string]: { books: number, worksheets: number, quizzes: number } }>;

  // CRM operations
  getLeads(filters?: any): Promise<any[]>;
  getLead(id: number): Promise<any>;
  createLead(lead: any): Promise<any>;
  updateLead(id: number, updates: any): Promise<any>;
  deleteLead(id: number): Promise<void>;
  getLeadActivities(leadId?: number): Promise<any[]>;
  createLeadActivity(activity: any): Promise<any>;
  getDemoRequests(filters?: any): Promise<any[]>;
  getDemoRequest(id: number): Promise<any>;
  createDemoRequest(demo: any): Promise<any>;
  updateDemoRequest(id: number, updates: any): Promise<any>;

  // Other operations
  getCalendarEvents(filters?: any): Promise<any[]>;
  getCalendarEvent(id: string): Promise<any>;
  createCalendarEvent(event: any): Promise<any>;
  updateCalendarEvent(id: string, updates: any): Promise<any>;
  deleteCalendarEvent(id: string): Promise<void>;
  getEventParticipants(eventId: string): Promise<any[]>;
  addEventParticipant(participant: any): Promise<any>;
  removeEventParticipant(eventId: string, userId: string): Promise<void>;
  getEventRoleTargets(eventId: string): Promise<any[]>;
  addEventRoleTarget(target: any): Promise<any>;
  removeEventRoleTarget(eventId: string, role: string): Promise<void>;
  getEventReminders(eventId: string): Promise<any[]>;
  addEventReminder(reminder: any): Promise<any>;
  removeEventReminder(id: string): Promise<void>;
  getEventTemplates(userId?: string): Promise<any[]>;
  createEventTemplate(template: any): Promise<any>;
  updateEventTemplate(id: string, updates: any): Promise<any>;
  deleteEventTemplate(id: string): Promise<void>;
  getLiveSessions(filters?: any): Promise<any[]>;
  getLiveSession(id: string): Promise<any>;
  createLiveSession(session: any): Promise<any>;
  updateLiveSession(id: string, updates: any): Promise<any>;
  deleteLiveSession(id: string): Promise<void>;
  getSessionParticipants(sessionId: string): Promise<any[]>;
  addSessionParticipant(participant: any): Promise<any>;
  removeSessionParticipant(sessionId: string, userId: string): Promise<void>;
  getDeviceSessions(sessionId: string): Promise<any[]>;
  createDeviceSession(deviceSession: any): Promise<any>;
  updateDeviceSession(id: string, updates: any): Promise<any>;
  deleteDeviceSession(id: string): Promise<void>;
  getScreenSharingSessions(sessionId: string): Promise<any[]>;
  createScreenSharingSession(screenSession: any): Promise<any>;
  updateScreenSharingSession(id: string, updates: any): Promise<any>;
  deleteScreenSharingSession(id: string): Promise<void>;
  getDeviceControlActions(sessionId: string): Promise<any[]>;
  createDeviceControlAction(action: any): Promise<any>;
  getLockerItems(userId: string, type?: string): Promise<any[]>;
  addLockerItem(item: any): Promise<any>;
  removeLockerItem(userId: string, itemId: string): Promise<void>;
  updateLockerItem(userId: string, itemId: string, updates: any): Promise<any>;
  getLockerFolders(userId: string): Promise<any[]>;
  createLockerFolder(folder: any): Promise<any>;
  updateLockerFolder(folderId: string, updates: any): Promise<any>;
  deleteLockerFolder(folderId: string): Promise<void>;
  getDevices(filters?: any): Promise<any[]>;
  getDevice(id: string): Promise<any>;
  createDevice(device: any): Promise<any>;
  updateDevice(id: string, updates: any): Promise<any>;
  deleteDevice(id: string): Promise<void>;
  getDevicePolicies(deviceId?: string): Promise<any[]>;
  createDevicePolicy(policy: any): Promise<any>;
  updateDevicePolicy(id: string, updates: any): Promise<any>;
  deleteDevicePolicy(id: string): Promise<void>;
  getNotifications(userId: string): Promise<any[]>;
  createNotification(notification: any): Promise<any>;
  markNotificationRead(id: string): Promise<void>;
  deleteNotification(id: string): Promise<void>;
  getAnalytics(filters?: any): Promise<any>;
  recordAnalyticEvent(event: any): Promise<void>;
  getActivityLogs(userId?: string, limit?: number): Promise<any[]>;
  recordActivity(activity: any): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Signup operations
  async createSignupRequest(request: any): Promise<any> {
    // Mock implementation - in real app, would use database
    console.log("Creating signup request:", request);
    return { ...request, createdAt: new Date() };
  }

  async getSignupRequest(id: string): Promise<any> {
    // Mock implementation
    console.log("Getting signup request:", id);
    return {
      id,
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      accountType: "student",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isVerified: false,
    };
  }

  async updateSignupRequest(id: string, updates: any): Promise<any> {
    // Mock implementation
    console.log("Updating signup request:", id, updates);
    return { id, ...updates };
  }

  async createVerificationRequest(request: any): Promise<any> {
    // Mock implementation
    console.log("Creating verification request:", request);
    return { ...request, createdAt: new Date() };
  }

  async getVerificationRequest(userId: string, code: string): Promise<any> {
    // Mock implementation - always return valid for demo
    console.log("Getting verification request:", userId, code);
    return {
      id: "verification-1",
      userId,
      verificationCode: code,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      isVerified: false,
    };
  }

  async updateVerificationRequest(id: string, updates: any): Promise<any> {
    // Mock implementation
    console.log("Updating verification request:", id, updates);
    return { id, ...updates };
  }

  async createSchoolDemoRequest(request: any): Promise<any> {
    // Mock implementation
    console.log("Creating school demo request:", request);
    return { ...request, createdAt: new Date() };
  }

  async getSchoolDemoRequestByEmail(email: string): Promise<any> {
    // Mock implementation - return null for demo
    console.log("Getting school demo request by email:", email);
    return null;
  }

  async createFamilyAccount(account: any): Promise<any> {
    // Mock implementation
    console.log("Creating family account:", account);
    return { ...account, createdAt: new Date() };
  }

  async createChildProfile(profile: any): Promise<any> {
    // Mock implementation
    console.log("Creating child profile:", profile);
    return { ...profile, createdAt: new Date() };
  }

  async setUserPassword(userId: string, hashedPassword: string): Promise<void> {
    // Mock implementation
    console.log("Setting user password for:", userId);
  }

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

  async updateUserRole(userId: string, role: string, gradeLevel?: string, department?: string): Promise<User> {
    const updates: any = { role, updatedAt: new Date() };
    if (gradeLevel) updates.gradeLevel = gradeLevel;
    if (department) updates.department = department;

    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role));
  }

  async getUsersByGradeLevel(gradeLevel: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.gradeLevel, gradeLevel));
  }

  async getUsersByDepartment(department: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.department, department));
  }

  async getUsersByTenant(tenantId: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.tenantId, tenantId));
  }

  async updateUserGradeLevel(userId: string, gradeLevel: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ gradeLevel, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserDepartment(userId: string, department: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ department, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async deactivateUser(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return settings;
  }

  async updateUserSettings(userId: string, settingsData: Partial<InsertUserSettings>): Promise<UserSettings> {
    const [settings] = await db
      .insert(userSettings)
      .values([{ userId, ...settingsData }])
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: { ...settingsData, updatedAt: new Date() },
      })
      .returning();
    return settings;
  }

  async upsertUserSettings(userId: string, settingsData: Partial<InsertUserSettings>): Promise<UserSettings> {
    return this.updateUserSettings(userId, settingsData);
  }

  // Add missing storage methods with basic implementations
  async createUser(userData: any): Promise<any> {
    // Basic user creation - implement as needed
    return { id: 'temp-user', ...userData };
  }

  async setGradeRollover(data: any): Promise<any> {
    // Grade rollover functionality - implement as needed
    return { success: true };
  }

  async processGradeRollovers(): Promise<any> {
    // Process grade rollovers - implement as needed
    return { success: true };
  }

  async searchUsers(query: string): Promise<User[]> {
    return await db.select().from(users).where(
      or(
        ilike(users.firstName, `%${query}%`),
        ilike(users.lastName, `%${query}%`),
        ilike(users.email, `%${query}%`)
      )
    );
  }

  async getTenantUsers(tenantId: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.tenantId, tenantId));
  }

  // Library operations
  async getLibraryCategories(gradeLevel?: string): Promise<LibraryCategory[]> {
    if (gradeLevel === 'primary') {
      return [
        { id: 'math', name: 'Mathematics', icon: 'calculator', color: 'from-blue-400 to-blue-600', gradeLevel: 'primary' },
        { id: 'english', name: 'English', icon: 'book', color: 'from-green-400 to-green-600', gradeLevel: 'primary' },
        { id: 'science', name: 'Science', icon: 'flask', color: 'from-purple-400 to-purple-600', gradeLevel: 'primary' },
        { id: 'social', name: 'Social Studies', icon: 'globe', color: 'from-orange-400 to-orange-600', gradeLevel: 'primary' },
        { id: 'arts', name: 'Arts & Crafts', icon: 'palette', color: 'from-pink-400 to-pink-600', gradeLevel: 'primary' },
        { id: 'physical', name: 'Physical Education', icon: 'activity', color: 'from-red-400 to-red-600', gradeLevel: 'primary' }
      ];
    } else if (gradeLevel === 'junior_secondary') {
      return [
        { id: 'mathematics', name: 'Mathematics', icon: 'calculator', color: 'from-blue-500 to-blue-700', gradeLevel: 'junior_secondary' },
        { id: 'english', name: 'English Language', icon: 'book', color: 'from-green-500 to-green-700', gradeLevel: 'junior_secondary' },
        { id: 'kiswahili', name: 'Kiswahili', icon: 'book-open', color: 'from-teal-500 to-teal-700', gradeLevel: 'junior_secondary' },
        { id: 'science', name: 'Integrated Science', icon: 'flask', color: 'from-purple-500 to-purple-700', gradeLevel: 'junior_secondary' },
        { id: 'social', name: 'Social Studies', icon: 'globe', color: 'from-orange-500 to-orange-700', gradeLevel: 'junior_secondary' },
        { id: 'life_skills', name: 'Life Skills Education', icon: 'heart', color: 'from-pink-500 to-pink-700', gradeLevel: 'junior_secondary' }
      ];
    } else if (gradeLevel === 'senior_secondary') {
      return [
        { id: 'mathematics', name: 'Mathematics', icon: 'calculator', color: 'from-blue-600 to-blue-800', gradeLevel: 'senior_secondary' },
        { id: 'biology', name: 'Biology', icon: 'dna', color: 'from-green-600 to-green-800', gradeLevel: 'senior_secondary' },
        { id: 'chemistry', name: 'Chemistry', icon: 'flask', color: 'from-purple-600 to-purple-800', gradeLevel: 'senior_secondary' },
        { id: 'physics', name: 'Physics', icon: 'zap', color: 'from-yellow-600 to-yellow-800', gradeLevel: 'senior_secondary' },
        { id: 'english', name: 'English', icon: 'book', color: 'from-indigo-600 to-indigo-800', gradeLevel: 'senior_secondary' },
        { id: 'computer', name: 'Computer Studies', icon: 'monitor', color: 'from-gray-600 to-gray-800', gradeLevel: 'senior_secondary' }
      ];
    }
    
    return [
      { id: 'math', name: 'Mathematics', icon: 'calculator', color: 'from-blue-400 to-blue-600', gradeLevel: 'primary' },
      { id: 'english', name: 'English', icon: 'book', color: 'from-green-400 to-green-600', gradeLevel: 'primary' }
    ];
  }

  async getLibrarySubjects(gradeLevel?: string, categoryId?: string): Promise<any[]> {
    if (gradeLevel === 'junior_secondary') {
      return this.getJuniorSecondarySubjects();
    } else if (gradeLevel === 'senior_secondary') {
      return this.getSeniorSecondarySubjects();
    } else {
      return this.getPrimarySubjects();
    }
  }

  private getPrimarySubjects(): any[] {
    return [
      { id: 'arithmetic', name: 'Number Operations', categoryId: 'math', competency: 'Basic arithmetic and counting skills', gradeLevel: 'primary' },
      { id: 'geometry', name: 'Shapes & Patterns', categoryId: 'math', competency: 'Understanding basic shapes and patterns', gradeLevel: 'primary' },
      { id: 'reading', name: 'Reading Skills', categoryId: 'english', competency: 'Phonics and basic reading comprehension', gradeLevel: 'primary' },
      { id: 'writing', name: 'Writing Skills', categoryId: 'english', competency: 'Letter formation and basic writing', gradeLevel: 'primary' },
      { id: 'nature', name: 'Living Things', categoryId: 'science', competency: 'Understanding plants, animals, and their habitats', gradeLevel: 'primary' },
      { id: 'community', name: 'Our Community', categoryId: 'social', competency: 'Understanding family, school, and community', gradeLevel: 'primary' }
    ];
  }

  private getJuniorSecondarySubjects(): any[] {
    return [
      { id: 'js_numbers', name: 'Numbers & Operations', categoryId: 'mathematics', competency: 'Number systems, operations, and problem solving', gradeLevel: 'junior_secondary' },
      { id: 'js_algebra', name: 'Algebra & Patterns', categoryId: 'mathematics', competency: 'Algebraic expressions and patterns', gradeLevel: 'junior_secondary' },
      { id: 'js_geometry', name: 'Geometry & Measurement', categoryId: 'mathematics', competency: 'Geometric shapes, measurement, and spatial reasoning', gradeLevel: 'junior_secondary' },
      { id: 'js_statistics', name: 'Statistics & Probability', categoryId: 'mathematics', competency: 'Data analysis and probability concepts', gradeLevel: 'junior_secondary' },
      { id: 'js_listening', name: 'Listening & Speaking', categoryId: 'english', competency: 'Oral communication and comprehension skills', gradeLevel: 'junior_secondary' },
      { id: 'js_reading', name: 'Reading & Comprehension', categoryId: 'english', competency: 'Reading fluency and text analysis', gradeLevel: 'junior_secondary' },
      { id: 'js_writing', name: 'Writing & Composition', categoryId: 'english', competency: 'Written communication and creative expression', gradeLevel: 'junior_secondary' },
      { id: 'js_literature', name: 'Literature & Poetry', categoryId: 'english', competency: 'Literary analysis and appreciation', gradeLevel: 'junior_secondary' },
      { id: 'js_mazungumzo', name: 'Mazungumzo na Mawasiliano', categoryId: 'kiswahili', competency: 'Ujuzi wa kuzungumza na kuwasiliana', gradeLevel: 'junior_secondary' },
      { id: 'js_kusoma', name: 'Ujuzi wa Kusoma', categoryId: 'kiswahili', competency: 'Ufahamu na uchambuzi wa maandishi', gradeLevel: 'junior_secondary' },
      { id: 'js_kuandika', name: 'Ujuzi wa Kuandika', categoryId: 'kiswahili', competency: 'Maandishi na ubunifu wa lugha', gradeLevel: 'junior_secondary' },
      { id: 'js_biology_basics', name: 'Living Things & Environment', categoryId: 'science', competency: 'Understanding living organisms and ecosystems', gradeLevel: 'junior_secondary' },
      { id: 'js_chemistry_basics', name: 'Matter & Materials', categoryId: 'science', competency: 'Properties of matter and chemical changes', gradeLevel: 'junior_secondary' },
      { id: 'js_physics_basics', name: 'Energy & Forces', categoryId: 'science', competency: 'Understanding energy, motion, and forces', gradeLevel: 'junior_secondary' },
      { id: 'js_earth_science', name: 'Earth & Space Science', categoryId: 'science', competency: 'Earth processes and astronomical concepts', gradeLevel: 'junior_secondary' }
    ];
  }

  private getSeniorSecondarySubjects(): any[] {
    return [
      { id: 'ss_calculus', name: 'Calculus & Analysis', categoryId: 'mathematics', competency: 'Differential and integral calculus', gradeLevel: 'senior_secondary' },
      { id: 'ss_statistics', name: 'Statistics & Probability', categoryId: 'mathematics', competency: 'Advanced statistical analysis and probability theory', gradeLevel: 'senior_secondary' },
      { id: 'ss_geometry', name: 'Advanced Geometry', categoryId: 'mathematics', competency: 'Coordinate geometry and trigonometry', gradeLevel: 'senior_secondary' },
      { id: 'ss_molecular_bio', name: 'Molecular Biology', categoryId: 'biology', competency: 'Cell biology and molecular processes', gradeLevel: 'senior_secondary' },
      { id: 'ss_ecology', name: 'Ecology & Evolution', categoryId: 'biology', competency: 'Ecosystem dynamics and evolutionary biology', gradeLevel: 'senior_secondary' },
      { id: 'ss_genetics', name: 'Genetics & Biotechnology', categoryId: 'biology', competency: 'Heredity and modern biotechnology', gradeLevel: 'senior_secondary' },
      { id: 'ss_organic_chem', name: 'Organic Chemistry', categoryId: 'chemistry', competency: 'Carbon compounds and organic reactions', gradeLevel: 'senior_secondary' },
      { id: 'ss_physical_chem', name: 'Physical Chemistry', categoryId: 'chemistry', competency: 'Chemical thermodynamics and kinetics', gradeLevel: 'senior_secondary' },
      { id: 'ss_analytical_chem', name: 'Analytical Chemistry', categoryId: 'chemistry', competency: 'Chemical analysis and instrumentation', gradeLevel: 'senior_secondary' },
      { id: 'ss_mechanics', name: 'Mechanics & Motion', categoryId: 'physics', competency: 'Classical mechanics and motion analysis', gradeLevel: 'senior_secondary' },
      { id: 'ss_electromagnetism', name: 'Electromagnetism', categoryId: 'physics', competency: 'Electric and magnetic phenomena', gradeLevel: 'senior_secondary' },
      { id: 'ss_modern_physics', name: 'Modern Physics', categoryId: 'physics', competency: 'Quantum mechanics and relativity', gradeLevel: 'senior_secondary' },
      { id: 'ss_advanced_english', name: 'Advanced English Literature', categoryId: 'english', competency: 'Critical analysis of literary works', gradeLevel: 'senior_secondary' },
      { id: 'ss_composition', name: 'Advanced Composition', categoryId: 'english', competency: 'Academic and creative writing skills', gradeLevel: 'senior_secondary' },
      { id: 'ss_programming', name: 'Programming & Algorithms', categoryId: 'computer', competency: 'Software development and algorithmic thinking', gradeLevel: 'senior_secondary' },
      { id: 'ss_databases', name: 'Database Systems', categoryId: 'computer', competency: 'Database design and management', gradeLevel: 'senior_secondary' },
      { id: 'ss_networks', name: 'Computer Networks', categoryId: 'computer', competency: 'Network protocols and cybersecurity', gradeLevel: 'senior_secondary' }
    ];
  }

  async getLibraryResources(filters?: any): Promise<LibraryResource[]> {
    const gradeLevel = filters?.gradeLevel || 'primary';
    const categoryId = filters?.categoryId;
    const subjectId = filters?.subjectId;

    if (gradeLevel === 'junior_secondary') {
      return this.generateJuniorSecondaryResources(categoryId, subjectId);
    } else if (gradeLevel === 'senior_secondary') {
      return this.generateSeniorSecondaryResources(categoryId, subjectId);
    } else {
      return this.generatePrimaryResources(categoryId, subjectId);
    }
  }

  private generatePrimaryResources(categoryId?: string, subjectId?: string): any[] {
    const resources = [
      { id: 'math-basics-1', title: 'Basic Counting 1-20', resourceType: 'book', categoryId: 'math', subjectId: 'arithmetic', gradeLevel: 'primary' },
      { id: 'math-basics-2', title: 'Addition Fun Worksheet', resourceType: 'worksheet', categoryId: 'math', subjectId: 'arithmetic', gradeLevel: 'primary' },
      { id: 'math-shapes-1', title: 'Learning Shapes', resourceType: 'video', categoryId: 'math', subjectId: 'geometry', gradeLevel: 'primary' },
      { id: 'eng-phonics-1', title: 'Letter Sounds A-Z', resourceType: 'audio', categoryId: 'english', subjectId: 'reading', gradeLevel: 'primary' },
      { id: 'eng-story-1', title: 'My First Story Book', resourceType: 'book', categoryId: 'english', subjectId: 'reading', gradeLevel: 'primary' },
      { id: 'eng-writing-1', title: 'Writing Letters Worksheet', resourceType: 'worksheet', categoryId: 'english', subjectId: 'writing', gradeLevel: 'primary' },
      { id: 'sci-animals-1', title: 'Animals Around Us', resourceType: 'book', categoryId: 'science', subjectId: 'nature', gradeLevel: 'primary' },
      { id: 'sci-plants-1', title: 'How Plants Grow', resourceType: 'video', categoryId: 'science', subjectId: 'nature', gradeLevel: 'primary' }
    ];

    if (categoryId && categoryId !== 'all') {
      return resources.filter(r => r.categoryId === categoryId);
    }
    if (subjectId) {
      return resources.filter(r => r.subjectId === subjectId);
    }
    return resources;
  }

  private generateJuniorSecondaryResources(categoryId?: string, subjectId?: string): any[] {
    const resources = [
      { id: 'js-math-1', title: 'Number Systems & Operations', resourceType: 'book', categoryId: 'mathematics', subjectId: 'js_numbers', gradeLevel: 'junior_secondary' },
      { id: 'js-math-2', title: 'Algebra Fundamentals', resourceType: 'worksheet', categoryId: 'mathematics', subjectId: 'js_algebra', gradeLevel: 'junior_secondary' },
      { id: 'js-math-3', title: 'Geometry Practice', resourceType: 'quiz', categoryId: 'mathematics', subjectId: 'js_geometry', gradeLevel: 'junior_secondary' },
      { id: 'js-math-4', title: 'Statistics & Data', resourceType: 'book', categoryId: 'mathematics', subjectId: 'js_statistics', gradeLevel: 'junior_secondary' },
      { id: 'js-eng-1', title: 'Communication Skills', resourceType: 'book', categoryId: 'english', subjectId: 'js_listening', gradeLevel: 'junior_secondary' },
      { id: 'js-eng-2', title: 'Reading Comprehension', resourceType: 'worksheet', categoryId: 'english', subjectId: 'js_reading', gradeLevel: 'junior_secondary' },
      { id: 'js-eng-3', title: 'Creative Writing', resourceType: 'book', categoryId: 'english', subjectId: 'js_writing', gradeLevel: 'junior_secondary' },
      { id: 'js-eng-4', title: 'Literature Analysis', resourceType: 'quiz', categoryId: 'english', subjectId: 'js_literature', gradeLevel: 'junior_secondary' },
      { id: 'js-kis-1', title: 'Mazungumzo na Mawasiliano', resourceType: 'book', categoryId: 'kiswahili', subjectId: 'js_mazungumzo', gradeLevel: 'junior_secondary' },
      { id: 'js-kis-2', title: 'Ujuzi wa Kusoma', resourceType: 'worksheet', categoryId: 'kiswahili', subjectId: 'js_kusoma', gradeLevel: 'junior_secondary' },
      { id: 'js-kis-3', title: 'Maandishi ya Kiswahili', resourceType: 'quiz', categoryId: 'kiswahili', subjectId: 'js_kuandika', gradeLevel: 'junior_secondary' },
      { id: 'js-sci-1', title: 'Living Things Study', resourceType: 'book', categoryId: 'science', subjectId: 'js_biology_basics', gradeLevel: 'junior_secondary' },
      { id: 'js-sci-2', title: 'Matter & Materials', resourceType: 'worksheet', categoryId: 'science', subjectId: 'js_chemistry_basics', gradeLevel: 'junior_secondary' },
      { id: 'js-sci-3', title: 'Energy & Forces', resourceType: 'quiz', categoryId: 'science', subjectId: 'js_physics_basics', gradeLevel: 'junior_secondary' },
      { id: 'js-sci-4', title: 'Earth Science', resourceType: 'book', categoryId: 'science', subjectId: 'js_earth_science', gradeLevel: 'junior_secondary' }
    ];

    if (categoryId && categoryId !== 'all') {
      return resources.filter(r => r.categoryId === categoryId);
    }
    if (subjectId) {
      return resources.filter(r => r.subjectId === subjectId);
    }
    return resources;
  }

  private generateSeniorSecondaryResources(categoryId?: string, subjectId?: string): any[] {
    const resources = [
      { id: 'ss-math-1', title: 'Advanced Calculus', resourceType: 'book', categoryId: 'mathematics', subjectId: 'ss_calculus', gradeLevel: 'senior_secondary' },
      { id: 'ss-math-2', title: 'Statistics & Probability', resourceType: 'worksheet', categoryId: 'mathematics', subjectId: 'ss_statistics', gradeLevel: 'senior_secondary' },
      { id: 'ss-math-3', title: 'Geometric Analysis', resourceType: 'quiz', categoryId: 'mathematics', subjectId: 'ss_geometry', gradeLevel: 'senior_secondary' },
      { id: 'ss-bio-1', title: 'Molecular Biology', resourceType: 'book', categoryId: 'biology', subjectId: 'ss_molecular_bio', gradeLevel: 'senior_secondary' },
      { id: 'ss-bio-2', title: 'Ecology Studies', resourceType: 'worksheet', categoryId: 'biology', subjectId: 'ss_ecology', gradeLevel: 'senior_secondary' },
      { id: 'ss-chem-1', title: 'Organic Chemistry', resourceType: 'book', categoryId: 'chemistry', subjectId: 'ss_organic_chem', gradeLevel: 'senior_secondary' },
      { id: 'ss-chem-2', title: 'Physical Chemistry', resourceType: 'quiz', categoryId: 'chemistry', subjectId: 'ss_physical_chem', gradeLevel: 'senior_secondary' },
      { id: 'ss-phy-1', title: 'Mechanics & Motion', resourceType: 'book', categoryId: 'physics', subjectId: 'ss_mechanics', gradeLevel: 'senior_secondary' },
      { id: 'ss-phy-2', title: 'Electromagnetism', resourceType: 'worksheet', categoryId: 'physics', subjectId: 'ss_electromagnetism', gradeLevel: 'senior_secondary' },
      { id: 'ss-eng-1', title: 'Advanced Literature', resourceType: 'book', categoryId: 'english', subjectId: 'ss_advanced_english', gradeLevel: 'senior_secondary' },
      { id: 'ss-eng-2', title: 'Academic Writing', resourceType: 'worksheet', categoryId: 'english', subjectId: 'ss_composition', gradeLevel: 'senior_secondary' },
      { id: 'ss-comp-1', title: 'Programming Basics', resourceType: 'book', categoryId: 'computer', subjectId: 'ss_programming', gradeLevel: 'senior_secondary' },
      { id: 'ss-comp-2', title: 'Database Management', resourceType: 'quiz', categoryId: 'computer', subjectId: 'ss_databases', gradeLevel: 'senior_secondary' }
    ];

    if (categoryId && categoryId !== 'all') {
      return resources.filter(r => r.categoryId === categoryId);
    }
    if (subjectId) {
      return resources.filter(r => r.subjectId === subjectId);
    }
    return resources;
  }

  async getLibraryResource(id: string): Promise<LibraryResource | undefined> {
    const allResources = await this.getLibraryResources();
    return allResources.find(r => r.id === id);
  }

  async createLibraryResource(resource: any): Promise<LibraryResource> {
    return {
      id: `resource_${Date.now()}`,
      ...resource,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updateLibraryResource(id: string, updates: any): Promise<LibraryResource> {
    const resource = await this.getLibraryResource(id);
    if (!resource) throw new Error('Resource not found');
    
    return {
      ...resource,
      ...updates,
      updatedAt: new Date()
    };
  }

  async deleteLibraryResource(id: string): Promise<void> {
    console.log(`Deleted resource ${id}`);
  }

  async searchLibraryResources(query: string, filters?: any): Promise<LibraryResource[]> {
    const resources = await this.getLibraryResources(filters);
    return resources.filter(r => 
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.description?.toLowerCase().includes(query.toLowerCase())
    );
  }

  async createLibraryResourceAccess(accessData: any): Promise<any> {
    return {
      id: `access_${Date.now()}`,
      ...accessData,
      accessedAt: new Date()
    };
  }

  async updateResourceStats(resourceId: string, updateType: 'view' | 'download'): Promise<void> {
    console.log(`Updated ${updateType} stats for resource ${resourceId}`);
  }

  async getResourceCountsBySubject(gradeLevel: string): Promise<{ [subjectId: string]: { books: number, worksheets: number, quizzes: number } }> {
    const allResources = await this.getLibraryResources({ gradeLevel });
    const counts: { [subjectId: string]: { books: number, worksheets: number, quizzes: number } } = {};
    
    allResources.forEach(resource => {
      const subjectId = resource.subjectId || resource.categoryId;
      if (!counts[subjectId]) {
        counts[subjectId] = { books: 0, worksheets: 0, quizzes: 0 };
      }
      
      if (resource.resourceType === 'book') counts[subjectId].books++;
      else if (resource.resourceType === 'worksheet') counts[subjectId].worksheets++;
      else if (resource.resourceType === 'quiz') counts[subjectId].quizzes++;
    });
    
    return counts;
  }

  // Mock implementations for other operations
  async getCalendarEvents(filters?: any): Promise<any[]> { return []; }
  async getCalendarEvent(id: string): Promise<any> { return null; }
  async createCalendarEvent(event: any): Promise<any> { return { id: `event_${Date.now()}`, ...event }; }
  async updateCalendarEvent(id: string, updates: any): Promise<any> { return { id, ...updates }; }
  async deleteCalendarEvent(id: string): Promise<void> { console.log(`Deleted event ${id}`); }
  async getEventParticipants(eventId: string): Promise<any[]> { return []; }
  async addEventParticipant(participant: any): Promise<any> { return { id: `participant_${Date.now()}`, ...participant }; }
  async removeEventParticipant(eventId: string, userId: string): Promise<void> { console.log(`Removed participant ${userId} from event ${eventId}`); }
  async getEventRoleTargets(eventId: string): Promise<any[]> { return []; }
  async addEventRoleTarget(target: any): Promise<any> { return { id: `target_${Date.now()}`, ...target }; }
  async removeEventRoleTarget(eventId: string, role: string): Promise<void> { console.log(`Removed role target ${role} from event ${eventId}`); }
  async getEventReminders(eventId: string): Promise<any[]> { return []; }
  async addEventReminder(reminder: any): Promise<any> { return { id: `reminder_${Date.now()}`, ...reminder }; }
  async removeEventReminder(id: string): Promise<void> { console.log(`Removed reminder ${id}`); }
  async getEventTemplates(userId?: string): Promise<any[]> { return []; }
  async createEventTemplate(template: any): Promise<any> { return { id: `template_${Date.now()}`, ...template }; }
  async updateEventTemplate(id: string, updates: any): Promise<any> { return { id, ...updates }; }
  async deleteEventTemplate(id: string): Promise<void> { console.log(`Deleted template ${id}`); }

  async getLiveSessions(filters?: any): Promise<any[]> { return []; }
  async getLiveSession(id: string): Promise<any> { return null; }
  async createLiveSession(session: any): Promise<any> { return { id: `session_${Date.now()}`, ...session }; }
  async updateLiveSession(id: string, updates: any): Promise<any> { return { id, ...updates }; }
  async deleteLiveSession(id: string): Promise<void> { console.log(`Deleted session ${id}`); }
  async getSessionParticipants(sessionId: string): Promise<any[]> { return []; }
  async addSessionParticipant(participant: any): Promise<any> { return { id: `participant_${Date.now()}`, ...participant }; }
  async removeSessionParticipant(sessionId: string, userId: string): Promise<void> { console.log(`Removed participant ${userId} from session ${sessionId}`); }
  async getDeviceSessions(sessionId: string): Promise<any[]> { return []; }
  async createDeviceSession(deviceSession: any): Promise<any> { return { id: `device_session_${Date.now()}`, ...deviceSession }; }
  async updateDeviceSession(id: string, updates: any): Promise<any> { return { id, ...updates }; }
  async deleteDeviceSession(id: string): Promise<void> { console.log(`Deleted device session ${id}`); }
  async getScreenSharingSessions(sessionId: string): Promise<any[]> { return []; }
  async createScreenSharingSession(screenSession: any): Promise<any> { return { id: `screen_session_${Date.now()}`, ...screenSession }; }
  async updateScreenSharingSession(id: string, updates: any): Promise<any> { return { id, ...updates }; }
  async deleteScreenSharingSession(id: string): Promise<void> { console.log(`Deleted screen session ${id}`); }
  async getDeviceControlActions(sessionId: string): Promise<any[]> { return []; }
  async createDeviceControlAction(action: any): Promise<any> { return { id: `action_${Date.now()}`, ...action }; }

  async getLockerItems(userId: string, type?: string): Promise<any[]> { return []; }
  async addLockerItem(item: any): Promise<any> { return { id: `locker_${Date.now()}`, ...item }; }
  async removeLockerItem(userId: string, itemId: string): Promise<void> { console.log(`Removed locker item ${itemId} for user ${userId}`); }
  async updateLockerItem(userId: string, itemId: string, updates: any): Promise<any> { return { id: itemId, userId, ...updates }; }
  async getLockerFolders(userId: string): Promise<any[]> { return []; }
  async createLockerFolder(folder: any): Promise<any> { return { id: `folder_${Date.now()}`, ...folder }; }
  async updateLockerFolder(folderId: string, updates: any): Promise<any> { return { id: folderId, ...updates }; }
  async deleteLockerFolder(folderId: string): Promise<void> { console.log(`Deleted folder ${folderId}`); }

  async getDevices(filters?: any): Promise<any[]> { return []; }
  async getDevice(id: string): Promise<any> { return { id, name: `Device ${id}` }; }
  async createDevice(device: any): Promise<any> { return { id: `device_${Date.now()}`, ...device }; }
  async updateDevice(id: string, updates: any): Promise<any> { return { id, ...updates }; }
  async deleteDevice(id: string): Promise<void> { console.log(`Deleted device ${id}`); }
  async getDevicePolicies(deviceId?: string): Promise<any[]> { return []; }
  async createDevicePolicy(policy: any): Promise<any> { return { id: `policy_${Date.now()}`, ...policy }; }
  async updateDevicePolicy(id: string, updates: any): Promise<any> { return { id, ...updates }; }
  async deleteDevicePolicy(id: string): Promise<void> { console.log(`Deleted policy ${id}`); }

  async getNotifications(userId: string): Promise<any[]> { return []; }
  async createNotification(notification: any): Promise<any> { return { id: `notification_${Date.now()}`, ...notification }; }
  async markNotificationRead(id: string): Promise<void> { console.log(`Marked notification ${id} as read`); }
  async deleteNotification(id: string): Promise<void> { console.log(`Deleted notification ${id}`); }

  async getAnalytics(filters?: any): Promise<any> { return { totalUsers: 0, totalResources: 0 }; }
  async recordAnalyticEvent(event: any): Promise<void> { console.log(`Recorded analytics event:`, event); }

  async getActivityLogs(userId?: string, limit?: number): Promise<any[]> { return []; }
  async recordActivity(activity: any): Promise<void> { console.log(`Recorded activity:`, activity); }

  // CRM Methods Implementation
  async getLeads(filters?: any): Promise<Lead[]> {
    const query = db.select().from(leads);
    return await query;
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async createLead(leadData: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values({
      ...leadData,
      tenantId: leadData.tenantId || "default",
    }).returning();
    return lead;
  }

  async updateLead(id: number, updates: Partial<InsertLead>): Promise<Lead> {
    const [lead] = await db.update(leads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return lead;
  }

  async deleteLead(id: number): Promise<void> {
    await db.delete(leads).where(eq(leads.id, id));
  }

  async getLeadActivities(leadId?: number): Promise<LeadActivity[]> {
    if (leadId) {
      return await db.select().from(leadActivities).where(eq(leadActivities.leadId, leadId));
    }
    return await db.select().from(leadActivities);
  }

  async createLeadActivity(activityData: InsertLeadActivity): Promise<LeadActivity> {
    const [activity] = await db.insert(leadActivities).values({
      ...activityData,
      tenantId: activityData.tenantId || "default",
    }).returning();
    return activity;
  }

  async getDemoRequests(filters?: any): Promise<DemoRequest[]> {
    return await db.select().from(demoRequests);
  }

  async getDemoRequest(id: number): Promise<DemoRequest | undefined> {
    const [demo] = await db.select().from(demoRequests).where(eq(demoRequests.id, id));
    return demo;
  }

  async createDemoRequest(demoData: InsertDemoRequest): Promise<DemoRequest> {
    const [demo] = await db.insert(demoRequests).values({
      ...demoData,
      tenantId: demoData.tenantId || "default",
    }).returning();
    return demo;
  }

  async updateDemoRequest(id: number, updates: Partial<InsertDemoRequest>): Promise<DemoRequest> {
    const [demo] = await db.update(demoRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(demoRequests.id, id))
      .returning();
    return demo;
  }
}

export const storage = new DatabaseStorage();