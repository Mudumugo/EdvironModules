import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "../../shared/schema";
import { eq, and, or, desc, asc, like, ilike, count, isNull, isNotNull, gte, lte } from "drizzle-orm";
import type {
  Notification,
  InsertNotification,
  Event,
  InsertEvent,
  App,
  InsertApp,
  Conversation,
  InsertConversation,
  Message,
  InsertMessage,
  AnalyticsEvent,
  InsertAnalyticsEvent,
  Device,
  InsertDevice
} from "../../shared/schema";

export class SystemStorage {
  constructor(private db: ReturnType<typeof drizzle>) {}

  // Notifications
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const result = await this.db.insert(schema.notifications).values(notificationData).returning();
    return result[0];
  }

  async getNotifications(
    userId: string,
    options?: {
      isRead?: boolean;
      category?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<Notification[]> {
    let whereClause = eq(schema.notifications.userId, userId);

    if (options?.isRead !== undefined) {
      whereClause = and(whereClause, eq(schema.notifications.isRead, options.isRead));
    }
    if (options?.category) {
      whereClause = and(whereClause, eq(schema.notifications.category, options.category));
    }

    const query = this.db
      .select()
      .from(schema.notifications)
      .where(whereClause)
      .orderBy(desc(schema.notifications.createdAt));

    if (options?.limit) {
      query.limit(options.limit);
    }
    if (options?.offset) {
      query.offset(options.offset);
    }

    return query;
  }

  async markNotificationAsRead(id: string): Promise<Notification | null> {
    const result = await this.db
      .update(schema.notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(schema.notifications.id, id))
      .returning();
    return result[0] || null;
  }

  async markAllNotificationsAsRead(userId: string): Promise<number> {
    const result = await this.db
      .update(schema.notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(and(eq(schema.notifications.userId, userId), eq(schema.notifications.isRead, false)));
    return result.rowCount;
  }

  async deleteNotification(id: string): Promise<boolean> {
    const result = await this.db.delete(schema.notifications).where(eq(schema.notifications.id, id));
    return result.rowCount > 0;
  }

  // Events/Calendar
  async createEvent(eventData: InsertEvent): Promise<Event> {
    const result = await this.db.insert(schema.events).values(eventData).returning();
    return result[0];
  }

  async getEvents(
    tenantId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      organizerId?: string;
      type?: string;
      isPublic?: boolean;
      limit?: number;
    }
  ): Promise<Event[]> {
    let whereClause = eq(schema.events.tenantId, tenantId);

    if (options?.startDate) {
      whereClause = and(whereClause, gte(schema.events.startDate, options.startDate));
    }
    if (options?.endDate) {
      whereClause = and(whereClause, lte(schema.events.endDate, options.endDate));
    }
    if (options?.organizerId) {
      whereClause = and(whereClause, eq(schema.events.organizerId, options.organizerId));
    }
    if (options?.type) {
      whereClause = and(whereClause, eq(schema.events.type, options.type));
    }
    if (options?.isPublic !== undefined) {
      whereClause = and(whereClause, eq(schema.events.isPublic, options.isPublic));
    }

    const query = this.db
      .select()
      .from(schema.events)
      .where(whereClause)
      .orderBy(asc(schema.events.startDate));

    if (options?.limit) {
      query.limit(options.limit);
    }

    return query;
  }

  async getEventById(id: string): Promise<Event | null> {
    const result = await this.db.select().from(schema.events).where(eq(schema.events.id, id));
    return result[0] || null;
  }

  async updateEvent(id: string, eventData: Partial<InsertEvent>): Promise<Event | null> {
    const result = await this.db
      .update(schema.events)
      .set({ ...eventData, updatedAt: new Date() })
      .where(eq(schema.events.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await this.db.delete(schema.events).where(eq(schema.events.id, id));
    return result.rowCount > 0;
  }

  // Apps
  async createApp(appData: InsertApp): Promise<App> {
    const result = await this.db.insert(schema.apps).values(appData).returning();
    return result[0];
  }

  async getApps(options?: {
    category?: string;
    isActive?: boolean;
    targetAudience?: string;
    limit?: number;
  }): Promise<App[]> {
    let whereClause = eq(schema.apps.isActive, true);

    if (options?.category) {
      whereClause = and(whereClause, eq(schema.apps.category, options.category));
    }
    if (options?.isActive !== undefined) {
      whereClause = and(whereClause, eq(schema.apps.isActive, options.isActive));
    }

    const query = this.db
      .select()
      .from(schema.apps)
      .where(whereClause)
      .orderBy(desc(schema.apps.rating), desc(schema.apps.installCount));

    if (options?.limit) {
      query.limit(options.limit);
    }

    return query;
  }

  async getAppById(id: string): Promise<App | null> {
    const result = await this.db.select().from(schema.apps).where(eq(schema.apps.id, id));
    return result[0] || null;
  }

  async searchApps(query: string, limit = 20): Promise<App[]> {
    const searchClause = or(
      ilike(schema.apps.name, `%${query}%`),
      ilike(schema.apps.description, `%${query}%`)
    );

    return this.db
      .select()
      .from(schema.apps)
      .where(and(searchClause, eq(schema.apps.isActive, true)))
      .limit(limit)
      .orderBy(desc(schema.apps.rating));
  }

  // Analytics
  async createAnalyticsEvent(eventData: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const result = await this.db.insert(schema.analyticsEvents).values(eventData).returning();
    return result[0];
  }

  async getAnalyticsEvents(
    tenantId: string,
    options?: {
      userId?: string;
      eventType?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ): Promise<AnalyticsEvent[]> {
    let whereClause = eq(schema.analyticsEvents.tenantId, tenantId);

    if (options?.userId) {
      whereClause = and(whereClause, eq(schema.analyticsEvents.userId, options.userId));
    }
    if (options?.eventType) {
      whereClause = and(whereClause, eq(schema.analyticsEvents.eventType, options.eventType));
    }
    if (options?.startDate) {
      whereClause = and(whereClause, gte(schema.analyticsEvents.timestamp, options.startDate));
    }
    if (options?.endDate) {
      whereClause = and(whereClause, lte(schema.analyticsEvents.timestamp, options.endDate));
    }

    const query = this.db
      .select()
      .from(schema.analyticsEvents)
      .where(whereClause)
      .orderBy(desc(schema.analyticsEvents.timestamp));

    if (options?.limit) {
      query.limit(options.limit);
    }

    return query;
  }

  // Devices
  async createDevice(deviceData: InsertDevice): Promise<Device> {
    const result = await this.db.insert(schema.devices).values(deviceData).returning();
    return result[0];
  }

  async getDevices(userId: string, tenantId: string): Promise<Device[]> {
    return this.db
      .select()
      .from(schema.devices)
      .where(and(eq(schema.devices.userId, userId), eq(schema.devices.tenantId, tenantId)))
      .orderBy(desc(schema.devices.lastSeenAt));
  }

  async updateDeviceActivity(deviceId: string): Promise<Device | null> {
    const result = await this.db
      .update(schema.devices)
      .set({ lastSeenAt: new Date(), isActive: true })
      .where(eq(schema.devices.deviceId, deviceId))
      .returning();
    return result[0] || null;
  }

  async deactivateDevice(deviceId: string): Promise<boolean> {
    const result = await this.db
      .update(schema.devices)
      .set({ isActive: false })
      .where(eq(schema.devices.deviceId, deviceId));
    return result.rowCount > 0;
  }

  // Communication (Conversations & Messages)
  async createConversation(conversationData: InsertConversation): Promise<Conversation> {
    const result = await this.db.insert(schema.conversations).values(conversationData).returning();
    return result[0];
  }

  async getConversations(userId: string, tenantId: string): Promise<Conversation[]> {
    // Note: This would need more complex logic to handle participants array
    return this.db
      .select()
      .from(schema.conversations)
      .where(eq(schema.conversations.tenantId, tenantId))
      .orderBy(desc(schema.conversations.lastMessageAt));
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const result = await this.db.insert(schema.messages).values(messageData).returning();
    
    // Update conversation's last message timestamp
    await this.db
      .update(schema.conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(schema.conversations.id, messageData.conversationId));
    
    return result[0];
  }

  async getMessages(conversationId: string, limit = 50, offset = 0): Promise<Message[]> {
    return this.db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.conversationId, conversationId))
      .orderBy(desc(schema.messages.createdAt))
      .limit(limit)
      .offset(offset);
  }
}