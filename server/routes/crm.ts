import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { type AuthenticatedRequest } from "../types/auth";
import { requireRole, requirePermission } from "../roleMiddleware";
import { insertLeadSchema, insertLeadActivitySchema, insertDemoRequestSchema } from "@shared/schema";

export function registerCRMRoutes(app: Express) {
  // Leads endpoints
  app.get('/api/crm/leads', isAuthenticated, async (req: any, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.get('/api/crm/leads/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const lead = await storage.getLead(id);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      console.error("Error fetching lead:", error);
      res.status(500).json({ message: "Failed to fetch lead" });
    }
  });

  app.post('/api/crm/leads', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      res.status(201).json(lead);
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(500).json({ message: "Failed to create lead" });
    }
  });

  app.patch('/api/crm/leads/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const lead = await storage.updateLead(id, req.body);
      res.json(lead);
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(500).json({ message: "Failed to update lead" });
    }
  });

  app.delete('/api/crm/leads/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteLead(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting lead:", error);
      res.status(500).json({ message: "Failed to delete lead" });
    }
  });

  // Lead Activities endpoints
  app.get('/api/crm/activities', isAuthenticated, async (req: any, res) => {
    try {
      const leadId = req.query.leadId ? parseInt(req.query.leadId as string) : undefined;
      const activities = await storage.getLeadActivities(leadId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.post('/api/crm/activities', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertLeadActivitySchema.parse(req.body);
      const activity = await storage.createLeadActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(500).json({ message: "Failed to create activity" });
    }
  });

  // Demo Requests endpoints
  app.get('/api/crm/demo-requests', isAuthenticated, async (req: any, res) => {
    try {
      const demos = await storage.getDemoRequests();
      res.json(demos);
    } catch (error) {
      console.error("Error fetching demo requests:", error);
      res.status(500).json({ message: "Failed to fetch demo requests" });
    }
  });

  app.get('/api/crm/demo-requests/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const demo = await storage.getDemoRequest(id);
      if (!demo) {
        return res.status(404).json({ message: "Demo request not found" });
      }
      res.json(demo);
    } catch (error) {
      console.error("Error fetching demo request:", error);
      res.status(500).json({ message: "Failed to fetch demo request" });
    }
  });

  app.post('/api/crm/demo-requests', async (req, res) => {
    try {
      const validatedData = insertDemoRequestSchema.parse(req.body);
      const demo = await storage.createDemoRequest(validatedData);
      res.status(201).json(demo);
    } catch (error) {
      console.error("Error creating demo request:", error);
      res.status(500).json({ message: "Failed to create demo request" });
    }
  });

  app.patch('/api/crm/demo-requests/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const demo = await storage.updateDemoRequest(id, req.body);
      res.json(demo);
    } catch (error) {
      console.error("Error updating demo request:", error);
      res.status(500).json({ message: "Failed to update demo request" });
    }
  });

  // Public endpoint for signup form submissions (converts to leads)
  app.post('/api/crm/signup-lead', async (req, res) => {
    try {
      const signupData = req.body;
      
      // Convert signup data to lead format
      const leadData = {
        firstName: signupData.firstName || '',
        lastName: signupData.lastName || '',
        email: signupData.email || '',
        phone: signupData.phone || null,
        dateOfBirth: signupData.dateOfBirth || null,
        age: signupData.age || null,
        accountType: signupData.accountType || 'individual',
        interests: signupData.interests || [],
        location: signupData.location ? JSON.stringify(signupData.location) : null,
        source: 'website',
        status: 'new',
        priority: 'medium',
        notes: `Signup from interactive form`,
        metadata: JSON.stringify(signupData),
        tenantId: 'default',
      };

      const lead = await storage.createLead(leadData);
      res.status(201).json({ success: true, leadId: lead.id });
    } catch (error) {
      console.error("Error creating lead from signup:", error);
      res.status(500).json({ message: "Failed to process signup" });
    }
  });
}