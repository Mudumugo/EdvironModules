import { db } from "../db";
import { users, userSettings, type User, type UpsertUser, type UserSettings, type InsertUserSettings } from "@shared/schema";
import { eq, ilike, or } from "drizzle-orm";
import { IUserStorage } from "./types";

export class UserStorage implements IUserStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...userData,
      tenantId: userData.tenantId || "default",
    }).onConflictDoUpdate({
      target: users.id,
      set: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        gradeLevel: userData.gradeLevel,
        department: userData.department,
        updatedAt: new Date(),
      }
    }).returning();
    return user;
  }

  async updateUserRole(userId: string, role: string, gradeLevel?: string, department?: string): Promise<User> {
    const updateData: any = { role, updatedAt: new Date() };
    if (gradeLevel) updateData.gradeLevel = gradeLevel;
    if (department) updateData.department = department;

    const [user] = await db.update(users)
      .set(updateData)
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
    const [user] = await db.update(users)
      .set({ gradeLevel, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserDepartment(userId: string, department: string): Promise<User> {
    const [user] = await db.update(users)
      .set({ department, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async deactivateUser(userId: string): Promise<User> {
    const [user] = await db.update(users)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return settings;
  }

  async updateUserSettings(userId: string, settings: Partial<InsertUserSettings>): Promise<UserSettings> {
    const [updatedSettings] = await db.insert(userSettings).values({
      userId,
      ...settings,
    }).onConflictDoUpdate({
      target: userSettings.userId,
      set: {
        ...settings,
        updatedAt: new Date(),
      }
    }).returning();
    return updatedSettings;
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
}