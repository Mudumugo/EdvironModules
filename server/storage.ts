import {
  users,
  userSettings,
  type User,
  type UpsertUser,
  type UserSettings,
  type InsertUserSettings,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(userId: string, role: string, gradeLevel?: string, department?: string): Promise<User>;
  getUsersByRole(role: string, tenantId?: string): Promise<User[]>;
  getUsersByTenant(tenantId: string): Promise<User[]>;
  
  // User settings operations
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings>;

  // Security operations
  getSecurityZones(): Promise<any[]>;
  createSecurityZone(data: any): Promise<any>;
  getSecurityCameras(): Promise<any[]>;
  getSecurityCamerasByZone(zoneId: string): Promise<any[]>;
  createSecurityCamera(data: any): Promise<any>;
  getSecurityEvents(filters: any): Promise<any[]>;
  createSecurityEvent(data: any): Promise<any>;
  updateSecurityEvent(eventId: string, data: any): Promise<any>;
  getVisitorRegistrations(filters: any): Promise<any[]>;
  createVisitorRegistration(data: any): Promise<any>;
  checkoutVisitor(visitorId: string): Promise<any>;
  getSecurityCalls(filters: any): Promise<any[]>;
  createSecurityCall(data: any): Promise<any>;
  getSecurityMetrics(): Promise<any>;
  getActiveThreats(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
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
    const [user] = await db
      .update(users)
      .set({ 
        role,
        gradeLevel,
        department,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUsersByRole(role: string, tenantId?: string): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUsersByTenant(tenantId: string): Promise<User[]> {
    return await db.select().from(users);
  }

  // User settings operations
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));
    return settings;
  }

  async upsertUserSettings(settingsData: InsertUserSettings): Promise<UserSettings> {
    const [settings] = await db
      .insert(userSettings)
      .values(settingsData)
      .onConflictDoUpdate({
        target: userSettings.id,
        set: {
          ...settingsData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return settings;
  }
}

export const storage = new DatabaseStorage();