import { db } from "../db";
import { appsHub, appCategories, appUsage, users } from "@/shared/schema";
import { eq, and, desc, asc, count, sql, ilike, or, inArray } from "drizzle-orm";
import type { App, InsertApp, AppCategory, InsertAppCategory, AppUsage, InsertAppUsage } from "@/shared/schema";

export class AppsHubStorage {
  // Get all apps with filtering and sorting
  async getApps(filters: {
    tenantId: string;
    category?: string;
    featured?: boolean;
    trending?: boolean;
    recommended?: boolean;
    essential?: boolean;
    premium?: boolean;
    status?: string;
    targetAudience?: string[];
    gradeLevel?: string[];
    search?: string;
    sortBy?: 'name' | 'rating' | 'created_at' | 'featured';
    sortOrder?: 'asc' | 'desc';
  }) {
    let query = db.select().from(appsHub).where(eq(appsHub.tenantId, filters.tenantId));

    // Apply filters
    const conditions = [eq(appsHub.tenantId, filters.tenantId)];

    if (filters.category && filters.category !== 'all') {
      conditions.push(eq(appsHub.category, filters.category));
    }

    if (filters.featured !== undefined) {
      conditions.push(eq(appsHub.featured, filters.featured));
    }

    if (filters.trending !== undefined) {
      conditions.push(eq(appsHub.trending, filters.trending));
    }

    if (filters.recommended !== undefined) {
      conditions.push(eq(appsHub.recommended, filters.recommended));
    }

    if (filters.essential !== undefined) {
      conditions.push(eq(appsHub.essential, filters.essential));
    }

    if (filters.premium !== undefined) {
      conditions.push(eq(appsHub.premium, filters.premium));
    }

    if (filters.status) {
      conditions.push(eq(appsHub.status, filters.status));
    }

    if (filters.search) {
      const searchCondition = or(
        ilike(appsHub.name, `%${filters.search}%`),
        ilike(appsHub.description, `%${filters.search}%`),
        sql`${appsHub.tags} && ARRAY[${filters.search}]::text[]`
      );
      if (searchCondition) conditions.push(searchCondition);
    }

    query = db.select().from(appsHub).where(and(...conditions));

    // Apply sorting
    const sortOrder = filters.sortOrder === 'desc' ? desc : asc;
    switch (filters.sortBy) {
      case 'name':
        query = query.orderBy(sortOrder(appsHub.name));
        break;
      case 'rating':
        query = query.orderBy(desc(appsHub.rating));
        break;
      case 'created_at':
        query = query.orderBy(desc(appsHub.createdAt));
        break;
      case 'featured':
      default:
        query = query.orderBy(desc(appsHub.featured), desc(appsHub.rating));
        break;
    }

    return await query;
  }

  // Get single app by ID
  async getApp(id: string, tenantId: string) {
    const result = await db.select()
      .from(appsHub)
      .where(and(eq(appsHub.id, id), eq(appsHub.tenantId, tenantId)))
      .limit(1);
    
    return result[0] || null;
  }

  // Create new app
  async createApp(appData: InsertApp) {
    const result = await db.insert(appsHub).values(appData).returning();
    return result[0];
  }

  // Update app
  async updateApp(id: string, tenantId: string, updates: Partial<InsertApp>) {
    const result = await db.update(appsHub)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(appsHub.id, id), eq(appsHub.tenantId, tenantId)))
      .returning();
    
    return result[0] || null;
  }

  // Delete app
  async deleteApp(id: string, tenantId: string) {
    const result = await db.delete(appsHub)
      .where(and(eq(appsHub.id, id), eq(appsHub.tenantId, tenantId)))
      .returning();
    
    return result[0] || null;
  }

  // Get app categories with counts
  async getCategories(tenantId: string) {
    const categoriesWithCounts = await db.select({
      id: appCategories.id,
      name: appCategories.name,
      description: appCategories.description,
      icon: appCategories.icon,
      color: appCategories.color,
      count: count(appsHub.id)
    })
    .from(appCategories)
    .leftJoin(appsHub, and(
      eq(appCategories.id, appsHub.category),
      eq(appsHub.tenantId, tenantId),
      eq(appsHub.status, 'active')
    ))
    .where(and(eq(appCategories.tenantId, tenantId), eq(appCategories.isActive, true)))
    .groupBy(appCategories.id, appCategories.name, appCategories.description, appCategories.icon, appCategories.color)
    .orderBy(asc(appCategories.sortOrder));

    // Add "All Apps" category
    const totalApps = await db.select({ count: count() })
      .from(appsHub)
      .where(and(eq(appsHub.tenantId, tenantId), eq(appsHub.status, 'active')));

    return [
      { id: 'all', name: 'All Apps', count: totalApps[0]?.count || 0 },
      ...categoriesWithCounts
    ];
  }

  // Create app category
  async createCategory(categoryData: InsertAppCategory) {
    const result = await db.insert(appCategories).values(categoryData).returning();
    return result[0];
  }

  // Update app category
  async updateCategory(id: string, tenantId: string, updates: Partial<InsertAppCategory>) {
    const result = await db.update(appCategories)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(appCategories.id, id), eq(appCategories.tenantId, tenantId)))
      .returning();
    
    return result[0] || null;
  }

  // Delete app category
  async deleteCategory(id: string, tenantId: string) {
    const result = await db.delete(appCategories)
      .where(and(eq(appCategories.id, id), eq(appCategories.tenantId, tenantId)))
      .returning();
    
    return result[0] || null;
  }

  // Track app usage
  async trackUsage(usageData: InsertAppUsage) {
    const result = await db.insert(appUsage).values(usageData).returning();
    return result[0];
  }

  // Get app usage analytics
  async getUsageAnalytics(tenantId: string, appId?: string, period: 'day' | 'week' | 'month' = 'week') {
    let query = db.select({
      appId: appUsage.appId,
      appName: appsHub.name,
      action: appUsage.action,
      count: count(),
      date: sql<string>`DATE(${appUsage.createdAt})`
    })
    .from(appUsage)
    .innerJoin(appsHub, eq(appUsage.appId, appsHub.id))
    .where(eq(appUsage.tenantId, tenantId));

    if (appId) {
      query = query.where(and(eq(appUsage.tenantId, tenantId), eq(appUsage.appId, appId)));
    }

    // Add date filtering based on period
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    query = query.where(sql`${appUsage.createdAt} >= ${startDate}`);

    return await query
      .groupBy(appUsage.appId, appsHub.name, appUsage.action, sql`DATE(${appUsage.createdAt})`)
      .orderBy(desc(sql`DATE(${appUsage.createdAt})`));
  }

  // Get popular apps based on usage
  async getPopularApps(tenantId: string, limit: number = 10) {
    return await db.select({
      app: appsHub,
      usageCount: count(appUsage.id)
    })
    .from(appsHub)
    .leftJoin(appUsage, eq(appsHub.id, appUsage.appId))
    .where(and(eq(appsHub.tenantId, tenantId), eq(appsHub.status, 'active')))
    .groupBy(appsHub.id)
    .orderBy(desc(count(appUsage.id)))
    .limit(limit);
  }

  // Bulk update app properties
  async bulkUpdateApps(appIds: string[], tenantId: string, updates: Partial<InsertApp>) {
    const result = await db.update(appsHub)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(inArray(appsHub.id, appIds), eq(appsHub.tenantId, tenantId)))
      .returning();
    
    return result;
  }
}