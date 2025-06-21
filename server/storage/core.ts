import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "../../shared/schema";
import { eq, and, or, desc, asc, like, ilike, count, isNull, isNotNull } from "drizzle-orm";
import type { 
  User, 
  InsertUser, 
  Tenant, 
  InsertTenant,
  UserSettings,
  InsertUserSettings
} from "../../shared/schema";

export class CoreStorage {
  constructor(private db: ReturnType<typeof drizzle>) {}

  // User management
  async createUser(userData: InsertUser): Promise<User> {
    const result = await this.db.insert(schema.users).values(userData).returning();
    return result[0];
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await this.db.select().from(schema.users).where(eq(schema.users.id, id));
    return result[0] || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.db.select().from(schema.users).where(eq(schema.users.email, email));
    return result[0] || null;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | null> {
    const result = await this.db
      .update(schema.users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.db.delete(schema.users).where(eq(schema.users.id, id));
    return result.rowCount > 0;
  }

  async getUsersByTenant(tenantId: string, limit = 50, offset = 0): Promise<User[]> {
    return this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.tenantId, tenantId))
      .limit(limit)
      .offset(offset);
  }

  async getUsersByRole(role: string, tenantId?: string): Promise<User[]> {
    const whereClause = tenantId 
      ? and(eq(schema.users.role, role), eq(schema.users.tenantId, tenantId))
      : eq(schema.users.role, role);
    
    return this.db.select().from(schema.users).where(whereClause);
  }

  async searchUsers(query: string, tenantId?: string, limit = 20): Promise<User[]> {
    const searchClause = or(
      ilike(schema.users.firstName, `%${query}%`),
      ilike(schema.users.lastName, `%${query}%`),
      ilike(schema.users.email, `%${query}%`)
    );

    const whereClause = tenantId 
      ? and(searchClause, eq(schema.users.tenantId, tenantId))
      : searchClause;

    return this.db
      .select()
      .from(schema.users)
      .where(whereClause)
      .limit(limit);
  }

  // Tenant management
  async createTenant(tenantData: InsertTenant): Promise<Tenant> {
    const result = await this.db.insert(schema.tenants).values(tenantData).returning();
    return result[0];
  }

  async getTenantById(id: string): Promise<Tenant | null> {
    const result = await this.db.select().from(schema.tenants).where(eq(schema.tenants.id, id));
    return result[0] || null;
  }

  async getTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
    const result = await this.db
      .select()
      .from(schema.tenants)
      .where(eq(schema.tenants.subdomain, subdomain));
    return result[0] || null;
  }

  async updateTenant(id: string, tenantData: Partial<InsertTenant>): Promise<Tenant | null> {
    const result = await this.db
      .update(schema.tenants)
      .set({ ...tenantData, updatedAt: new Date() })
      .where(eq(schema.tenants.id, id))
      .returning();
    return result[0] || null;
  }

  async getActiveTenants(): Promise<Tenant[]> {
    return this.db
      .select()
      .from(schema.tenants)
      .where(eq(schema.tenants.isActive, true))
      .orderBy(asc(schema.tenants.name));
  }

  // User Settings management
  async createUserSettings(settingsData: InsertUserSettings): Promise<UserSettings> {
    const result = await this.db.insert(schema.userSettings).values(settingsData).returning();
    return result[0];
  }

  async getUserSettings(userId: string): Promise<UserSettings | null> {
    const result = await this.db
      .select()
      .from(schema.userSettings)
      .where(eq(schema.userSettings.userId, userId));
    return result[0] || null;
  }

  async updateUserSettings(userId: string, settingsData: Partial<InsertUserSettings>): Promise<UserSettings | null> {
    const result = await this.db
      .update(schema.userSettings)
      .set({ ...settingsData, updatedAt: new Date() })
      .where(eq(schema.userSettings.userId, userId))
      .returning();
    return result[0] || null;
  }

  async deleteUserSettings(userId: string): Promise<boolean> {
    const result = await this.db
      .delete(schema.userSettings)
      .where(eq(schema.userSettings.userId, userId));
    return result.rowCount > 0;
  }

  // Analytics and stats
  async getUserCount(tenantId?: string): Promise<number> {
    const whereClause = tenantId ? eq(schema.users.tenantId, tenantId) : undefined;
    const result = await this.db
      .select({ count: count() })
      .from(schema.users)
      .where(whereClause);
    return result[0].count;
  }

  async getUserCountByRole(tenantId?: string): Promise<Record<string, number>> {
    const whereClause = tenantId ? eq(schema.users.tenantId, tenantId) : undefined;
    const result = await this.db
      .select({
        role: schema.users.role,
        count: count()
      })
      .from(schema.users)
      .where(whereClause)
      .groupBy(schema.users.role);

    return result.reduce((acc, { role, count }) => {
      acc[role] = count;
      return acc;
    }, {} as Record<string, number>);
  }

  async getActiveUsersCount(tenantId?: string): Promise<number> {
    const whereClause = tenantId 
      ? and(eq(schema.users.tenantId, tenantId), eq(schema.users.isActive, true))
      : eq(schema.users.isActive, true);
    
    const result = await this.db
      .select({ count: count() })
      .from(schema.users)
      .where(whereClause);
    return result[0].count;
  }
}