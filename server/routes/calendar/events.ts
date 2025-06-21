import type { Express } from "express";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../../storage";
import { isAuthenticated } from "../../roleMiddleware";
import { insertCalendarEventSchema, USER_ROLES } from "@shared/schema";
import type { AuthenticatedRequest } from "../../types";

// Helper function to check if user has permission to manage events
function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: any, next: any) => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}

export function registerEventRoutes(app: Express) {
  // Get calendar events
  app.get("/api/calendar/events", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { start, end, category, type } = req.query;
      
      const filters: any = {};
      if (start) filters.startDate = new Date(start as string);
      if (end) filters.endDate = new Date(end as string);
      if (category) filters.category = category;
      if (type) filters.type = type;

      const events = await storage.getCalendarEvents(filters);
      res.json(events);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      res.status(500).json({ error: "Failed to fetch calendar events" });
    }
  });

  // Create new event
  app.post("/api/calendar/events", isAuthenticated, requireRole([USER_ROLES.TEACHER, USER_ROLES.SCHOOL_ADMIN]), async (req: AuthenticatedRequest, res) => {
    try {
      const eventData = insertCalendarEventSchema.parse({
        ...req.body,
        id: uuidv4(),
        organizerId: req.user!.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const event = await storage.createCalendarEvent(eventData);

      // Handle recurring events
      if (req.body.recurring) {
        const recurringEvents = generateRecurringEvents(eventData, req.body.recurring);
        for (const recurringEvent of recurringEvents) {
          await storage.createCalendarEvent(recurringEvent);
        }
      }

      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating calendar event:", error);
      res.status(500).json({ error: "Failed to create calendar event" });
    }
  });

  // Update event
  app.put("/api/calendar/events/:eventId", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { eventId } = req.params;
      
      const existingEvent = await storage.getCalendarEvent(eventId);
      if (!existingEvent) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Check permissions
      if (existingEvent.organizerId !== req.user!.id && !req.user!.permissions?.includes('MANAGE_CALENDAR')) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      const updatedData = {
        ...req.body,
        updatedAt: new Date()
      };

      const event = await storage.updateCalendarEvent(eventId, updatedData);
      res.json(event);
    } catch (error) {
      console.error("Error updating calendar event:", error);
      res.status(500).json({ error: "Failed to update calendar event" });
    }
  });

  // Delete event
  app.delete("/api/calendar/events/:eventId", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { eventId } = req.params;
      
      const existingEvent = await storage.getCalendarEvent(eventId);
      if (!existingEvent) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Check permissions
      if (existingEvent.organizerId !== req.user!.id && !req.user!.permissions?.includes('MANAGE_CALENDAR')) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      await storage.deleteCalendarEvent(eventId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting calendar event:", error);
      res.status(500).json({ error: "Failed to delete calendar event" });
    }
  });

  // RSVP to event
  app.post("/api/calendar/events/:eventId/rsvp", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { eventId } = req.params;
      const { response } = req.body; // 'yes', 'no', 'maybe'

      const event = await storage.getCalendarEvent(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const rsvp = {
        id: uuidv4(),
        eventId,
        userId: req.user!.id,
        response,
        createdAt: new Date()
      };

      await storage.createEventRSVP(rsvp);
      res.json({ success: true, rsvp });
    } catch (error) {
      console.error("Error creating RSVP:", error);
      res.status(500).json({ error: "Failed to create RSVP" });
    }
  });
}

// Helper to generate recurring events
function generateRecurringEvents(baseEvent: any, pattern: any, maxInstances: number = 100) {
  const events = [];
  const startDate = new Date(baseEvent.startDateTime);
  const endDate = new Date(baseEvent.endDateTime);
  const duration = endDate.getTime() - startDate.getTime();
  
  let currentDate = new Date(startDate);
  let instanceCount = 0;
  
  while (instanceCount < maxInstances) {
    if (pattern.endDate && currentDate > new Date(pattern.endDate)) {
      break;
    }
    
    // Skip the first instance (base event)
    if (instanceCount > 0) {
      const instanceStart = new Date(currentDate);
      const instanceEnd = new Date(instanceStart.getTime() + duration);
      
      events.push({
        ...baseEvent,
        id: uuidv4(),
        startDateTime: instanceStart,
        endDateTime: instanceEnd,
        parentEventId: baseEvent.id,
      });
    }
    
    // Calculate next occurrence
    switch (pattern.type) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + (pattern.interval || 1));
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7 * (pattern.interval || 1));
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + (pattern.interval || 1));
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + (pattern.interval || 1));
        break;
      default:
        return events;
    }
    
    instanceCount++;
  }
  
  return events;
}