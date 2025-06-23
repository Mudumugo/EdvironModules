import { db } from "../db";
import { globalAppsHub, globalAppCategories, tenantAppsAccess, appUsage } from "@/shared/schema";
import { eq, and, desc, asc, count, sql, ilike, or, inArray } from "drizzle-orm";
import type { 
  GlobalApp, 
  InsertGlobalApp, 
  GlobalAppCategory, 
  InsertGlobalAppCategory,
  TenantAppAccess,
  InsertTenantAppAccess
} from "@/shared/schema";

export class GlobalAppsHubStorage {
  // EdVirons team: Get all global apps with filtering
  async getGlobalApps(filters: {
    category?: string;
    featured?: boolean;
    trending?: boolean;
    recommended?: boolean;
    essential?: boolean;
    premium?: boolean;
    status?: string;
    minimumPlan?: string;
    search?: string;
    sortBy?: 'name' | 'rating' | 'created_at' | 'featured';
    sortOrder?: 'asc' | 'desc';
  }) {
    const conditions = [];

    if (filters.category && filters.category !== 'all') {
      conditions.push(eq(globalAppsHub.category, filters.category));
    }

    if (filters.featured !== undefined) {
      conditions.push(eq(globalAppsHub.featured, filters.featured));
    }

    if (filters.trending !== undefined) {
      conditions.push(eq(globalAppsHub.trending, filters.trending));
    }

    if (filters.recommended !== undefined) {
      conditions.push(eq(globalAppsHub.recommended, filters.recommended));
    }

    if (filters.essential !== undefined) {
      conditions.push(eq(globalAppsHub.essential, filters.essential));
    }

    if (filters.premium !== undefined) {
      conditions.push(eq(globalAppsHub.premium, filters.premium));
    }

    if (filters.status) {
      conditions.push(eq(globalAppsHub.status, filters.status));
    }

    if (filters.minimumPlan) {
      conditions.push(eq(globalAppsHub.minimumPlan, filters.minimumPlan));
    }

    if (filters.search) {
      const searchCondition = or(
        ilike(globalAppsHub.name, `%${filters.search}%`),
        ilike(globalAppsHub.description, `%${filters.search}%`),
        sql`${globalAppsHub.tags} && ARRAY[${filters.search}]::text[]`
      );
      if (searchCondition) conditions.push(searchCondition);
    }

    let query = db.select().from(globalAppsHub);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortOrder = filters.sortOrder === 'desc' ? desc : asc;
    switch (filters.sortBy) {
      case 'name':
        query = query.orderBy(sortOrder(globalAppsHub.name));
        break;
      case 'rating':
        query = query.orderBy(desc(globalAppsHub.rating));
        break;
      case 'created_at':
        query = query.orderBy(desc(globalAppsHub.createdAt));
        break;
      case 'featured':
      default:
        query = query.orderBy(desc(globalAppsHub.featured), desc(globalAppsHub.rating));
        break;
    }

    return await query;
  }

  // Tenants: Get apps available to a specific tenant
  async getTenantApps(tenantId: string, filters: {
    category?: string;
    featured?: boolean;
    trending?: boolean;
    recommended?: boolean;
    essential?: boolean;
    premium?: boolean;
    search?: string;
    sortBy?: 'name' | 'rating' | 'created_at' | 'featured';
    sortOrder?: 'asc' | 'desc';
  }) {
    const conditions = [
      eq(globalAppsHub.status, 'active'),
      eq(globalAppsHub.isGloballyAvailable, true),
      eq(tenantAppsAccess.tenantId, tenantId),
      eq(tenantAppsAccess.isEnabled, true)
    ];

    if (filters.category && filters.category !== 'all') {
      conditions.push(eq(globalAppsHub.category, filters.category));
    }

    if (filters.featured !== undefined) {
      conditions.push(eq(globalAppsHub.featured, filters.featured));
    }

    if (filters.trending !== undefined) {
      conditions.push(eq(globalAppsHub.trending, filters.trending));
    }

    if (filters.recommended !== undefined) {
      conditions.push(eq(globalAppsHub.recommended, filters.recommended));
    }

    if (filters.essential !== undefined) {
      conditions.push(eq(globalAppsHub.essential, filters.essential));
    }

    if (filters.premium !== undefined) {
      conditions.push(eq(globalAppsHub.premium, filters.premium));
    }

    if (filters.search) {
      const searchCondition = or(
        ilike(globalAppsHub.name, `%${filters.search}%`),
        ilike(globalAppsHub.description, `%${filters.search}%`),
        ilike(tenantAppsAccess.customName, `%${filters.search}%`),
        sql`${globalAppsHub.tags} && ARRAY[${filters.search}]::text[]`
      );
      if (searchCondition) conditions.push(searchCondition);
    }

    let query = db.select({
      id: globalAppsHub.id,
      name: sql<string>`COALESCE(${tenantAppsAccess.customName}, ${globalAppsHub.name})`.as('name'),
      description: sql<string>`COALESCE(${tenantAppsAccess.customDescription}, ${globalAppsHub.description})`.as('description'),
      icon: sql<string>`COALESCE(${tenantAppsAccess.customIcon}, ${globalAppsHub.icon})`.as('icon'),
      category: globalAppsHub.category,
      rating: globalAppsHub.rating,
      downloads: globalAppsHub.downloads,
      price: globalAppsHub.price,
      url: globalAppsHub.url,
      internal: globalAppsHub.internal,
      featured: globalAppsHub.featured,
      trending: globalAppsHub.trending,
      recommended: globalAppsHub.recommended,
      popular: globalAppsHub.popular,
      essential: globalAppsHub.essential,
      premium: globalAppsHub.premium,
      tags: globalAppsHub.tags,
      targetAudience: globalAppsHub.targetAudience,
      gradeLevel: globalAppsHub.gradeLevel,
      status: globalAppsHub.status
    })
    .from(globalAppsHub)
    .leftJoin(tenantAppsAccess, eq(globalAppsHub.id, tenantAppsAccess.appId))
    .where(and(...conditions));

    // Apply sorting
    const sortOrder = filters.sortOrder === 'desc' ? desc : asc;
    switch (filters.sortBy) {
      case 'name':
        query = query.orderBy(sortOrder(globalAppsHub.name));
        break;
      case 'rating':
        query = query.orderBy(desc(globalAppsHub.rating));
        break;
      case 'created_at':
        query = query.orderBy(desc(globalAppsHub.createdAt));
        break;
      case 'featured':
      default:
        query = query.orderBy(desc(globalAppsHub.featured), desc(globalAppsHub.rating));
        break;
    }

    return await query;
  }

  // EdVirons team: Create new global app
  async createGlobalApp(appData: InsertGlobalApp) {
    const result = await db.insert(globalAppsHub).values(appData).returning();
    return result[0];
  }

  // EdVirons team: Update global app
  async updateGlobalApp(id: string, updates: Partial<InsertGlobalApp>) {
    const result = await db.update(globalAppsHub)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(globalAppsHub.id, id))
      .returning();
    
    return result[0] || null;
  }

  // EdVirons team: Delete global app
  async deleteGlobalApp(id: string) {
    const result = await db.delete(globalAppsHub)
      .where(eq(globalAppsHub.id, id))
      .returning();
    
    return result[0] || null;
  }

  // Get global categories
  async getGlobalCategories() {
    const categoriesWithCounts = await db.select({
      id: globalAppCategories.id,
      name: globalAppCategories.name,
      description: globalAppCategories.description,
      icon: globalAppCategories.icon,
      color: globalAppCategories.color,
      count: count(globalAppsHub.id)
    })
    .from(globalAppCategories)
    .leftJoin(globalAppsHub, and(
      eq(globalAppCategories.id, globalAppsHub.category),
      eq(globalAppsHub.status, 'active')
    ))
    .where(eq(globalAppCategories.isActive, true))
    .groupBy(globalAppCategories.id, globalAppCategories.name, globalAppCategories.description, globalAppCategories.icon, globalAppCategories.color)
    .orderBy(asc(globalAppCategories.sortOrder));

    // Add "All Apps" category
    const totalApps = await db.select({ count: count() })
      .from(globalAppsHub)
      .where(eq(globalAppsHub.status, 'active'));

    return [
      { id: 'all', name: 'All Apps', count: totalApps[0]?.count || 0 },
      ...categoriesWithCounts
    ];
  }

  // EdVirons team: Create global category
  async createGlobalCategory(categoryData: InsertGlobalAppCategory) {
    const result = await db.insert(globalAppCategories).values(categoryData).returning();
    return result[0];
  }

  // EdVirons team: Update global category
  async updateGlobalCategory(id: string, updates: Partial<InsertGlobalAppCategory>) {
    const result = await db.update(globalAppCategories)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(globalAppCategories.id, id))
      .returning();
    
    return result[0] || null;
  }

  // EdVirons team: Enable/disable app for tenant
  async setTenantAppAccess(tenantId: string, appId: string, accessData: Partial<InsertTenantAppAccess>) {
    const existingAccess = await db.select()
      .from(tenantAppsAccess)
      .where(and(eq(tenantAppsAccess.tenantId, tenantId), eq(tenantAppsAccess.appId, appId)))
      .limit(1);

    if (existingAccess.length > 0) {
      // Update existing access
      const result = await db.update(tenantAppsAccess)
        .set({ ...accessData, updatedAt: new Date() })
        .where(and(eq(tenantAppsAccess.tenantId, tenantId), eq(tenantAppsAccess.appId, appId)))
        .returning();
      return result[0];
    } else {
      // Create new access
      const result = await db.insert(tenantAppsAccess)
        .values({
          tenantId,
          appId,
          ...accessData
        })
        .returning();
      return result[0];
    }
  }

  // Get tenant app access status for all apps
  async getTenantAppAccess(tenantId: string) {
    return await db.select({
      app: globalAppsHub,
      access: tenantAppsAccess
    })
    .from(globalAppsHub)
    .leftJoin(tenantAppsAccess, and(
      eq(globalAppsHub.id, tenantAppsAccess.appId),
      eq(tenantAppsAccess.tenantId, tenantId)
    ))
    .where(eq(globalAppsHub.status, 'active'))
    .orderBy(asc(globalAppsHub.name));
  }

  // Get usage analytics across all tenants (EdVirons team)
  async getGlobalUsageAnalytics(period: 'day' | 'week' | 'month' = 'week') {
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

    return await db.select({
      appId: appUsage.appId,
      appName: globalAppsHub.name,
      tenantId: appUsage.tenantId,
      action: appUsage.action,
      count: count(),
      date: sql<string>`DATE(${appUsage.createdAt})`
    })
    .from(appUsage)
    .innerJoin(globalAppsHub, eq(appUsage.appId, globalAppsHub.id))
    .where(sql`${appUsage.createdAt} >= ${startDate}`)
    .groupBy(appUsage.appId, globalAppsHub.name, appUsage.tenantId, appUsage.action, sql`DATE(${appUsage.createdAt})`)
    .orderBy(desc(sql`DATE(${appUsage.createdAt})`));
  }

  // Get most popular apps across all tenants
  async getGlobalPopularApps(limit: number = 10) {
    return await db.select({
      app: globalAppsHub,
      usageCount: count(appUsage.id),
      tenantCount: sql<number>`COUNT(DISTINCT ${appUsage.tenantId})`
    })
    .from(globalAppsHub)
    .leftJoin(appUsage, eq(globalAppsHub.id, appUsage.appId))
    .where(eq(globalAppsHub.status, 'active'))
    .groupBy(globalAppsHub.id)
    .orderBy(desc(count(appUsage.id)))
    .limit(limit);
  }

  // Bulk enable/disable apps for tenant
  async bulkSetTenantAppAccess(tenantId: string, appIds: string[], isEnabled: boolean, enabledBy?: string) {
    const results = [];
    
    for (const appId of appIds) {
      const result = await this.setTenantAppAccess(tenantId, appId, {
        isEnabled,
        enabledBy,
        enabledAt: isEnabled ? new Date() : undefined,
        disabledAt: !isEnabled ? new Date() : undefined
      });
      results.push(result);
    }
    
    return results;
  }
}