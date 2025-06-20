import { db } from "../db";
import { leads, leadActivities, demoRequests, type Lead, type InsertLead, type LeadActivity, type InsertLeadActivity, type DemoRequest, type InsertDemoRequest } from "@shared/schema";
import { eq } from "drizzle-orm";
import { ICRMStorage } from "./types";

export class CRMStorage implements ICRMStorage {
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