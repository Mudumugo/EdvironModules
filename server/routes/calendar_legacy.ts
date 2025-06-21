// Legacy calendar routes - use modular routes from calendar/index.ts  
export { registerCalendarRoutes } from "./calendar/index";

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
        currentDate.setDate(currentDate.getDate() + pattern.interval);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + (7 * pattern.interval));
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + pattern.interval);
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + pattern.interval);
        break;
    }
    
    instanceCount++;
  }
  
  return events;
}

export function registerCalendarRoutes(app: Express) {
  // Get user's calendar events
  app.get('/api/calendar/events', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const { start, end, view = 'month' } = req.query;
      
      const startDate = start ? new Date(start as string) : new Date();
      const endDate = end ? new Date(end as string) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      const events = await storage.getEventsForUser(userId, startDate, endDate, req.user!.tenantId);
      
      res.json(events);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      res.status(500).json({ message: 'Failed to fetch calendar events' });
    }
  });

  // Get upcoming events for dashboard
  app.get('/api/calendar/upcoming', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const limit = parseInt(req.query.limit as string) || 5;
      
      const events = await storage.getUpcomingEventsForUser(userId, limit);
      
      res.json(events);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      res.status(500).json({ message: 'Failed to fetch upcoming events' });
    }
  });

  // Get single event details
  app.get('/api/calendar/events/:eventId', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { eventId } = req.params;
      const event = await storage.getEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Check if user has permission to view this event
      const userId = req.user!.id;
      const userEvents = await storage.getEventsForUser(
        userId, 
        new Date(event.startDateTime), 
        new Date(event.endDateTime),
        req.user!.tenantId
      );
      
      const canView = userEvents.some(e => e.id === eventId) || event.organizerId === userId;
      
      if (!canView) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Get participants and role targets
      const [participants, roleTargets] = await Promise.all([
        storage.getEventParticipants(eventId),
        storage.getEventRoleTargets(eventId)
      ]);
      
      res.json({
        ...event,
        participants,
        roleTargets
      });
    } catch (error) {
      console.error('Error fetching event details:', error);
      res.status(500).json({ message: 'Failed to fetch event details' });
    }
  });

  // Create new event
  app.post('/api/calendar/events', isAuthenticated, requireRole(['admin', 'teacher', 'staff']), async (req: AuthenticatedRequest, res) => {
    try {
      const eventData = insertCalendarEventSchema.parse({
        ...req.body,
        id: uuidv4(),
        organizerId: req.user!.id,
        tenantId: req.user!.tenantId,
        createdBy: req.user!.id,
      });

      // Check if user has permission to create events for the specified audience
      const userRole = req.user!.role;
      if (eventData.targetAudience === 'all' && userRole !== 'admin') {
        return res.status(403).json({ message: 'Only administrators can create school-wide events' });
      }

      // Create the main event
      const event = await storage.createEvent(eventData);

      // Handle recurring events
      if (eventData.isRecurring && eventData.recurrencePattern) {
        const recurringEvents = generateRecurringEvents(event, eventData.recurrencePattern);
        
        // Create recurring instances
        for (const recurringEvent of recurringEvents) {
          await storage.createEvent(recurringEvent);
        }
      }

      // Add role targets if specified
      if (req.body.roleTargets && Array.isArray(req.body.roleTargets)) {
        for (const target of req.body.roleTargets) {
          await storage.addEventRoleTarget({
            id: uuidv4(),
            eventId: event.id,
            ...target,
          });
        }
      }

      // Add specific participants if specified
      if (req.body.participants && Array.isArray(req.body.participants)) {
        for (const participant of req.body.participants) {
          await storage.addEventParticipant({
            id: uuidv4(),
            eventId: event.id,
            ...participant,
          });
        }
      }

      res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ message: 'Failed to create event' });
    }
  });

  // Update event
  app.patch('/api/calendar/events/:eventId', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { eventId } = req.params;
      const event = await storage.getEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Check permissions
      const userRole = req.user!.role;
      const canEdit = event.organizerId === req.user!.id || 
                     userRole === 'admin';
      
      if (!canEdit) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      const updates = req.body;
      delete updates.id; // Prevent ID changes
      delete updates.createdAt; // Prevent timestamp changes
      delete updates.createdBy; // Prevent creator changes
      
      const updatedEvent = await storage.updateEvent(eventId, updates);
      
      res.json(updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ message: 'Failed to update event' });
    }
  });

  // Delete event
  app.delete('/api/calendar/events/:eventId', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { eventId } = req.params;
      const event = await storage.getEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Check permissions
      const userRole = req.user!.role;
      const canDelete = event.organizerId === req.user!.id || 
                       userRole === 'admin';
      
      if (!canDelete) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      await storage.deleteEvent(eventId);
      
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ message: 'Failed to delete event' });
    }
  });

  // RSVP to event
  app.post('/api/calendar/events/:eventId/rsvp', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { eventId } = req.params;
      const { status, response } = req.body;
      const userId = req.user!.id;
      
      // Check if user is a participant
      const participants = await storage.getEventParticipants(eventId);
      const participant = participants.find(p => p.userId === userId);
      
      if (!participant) {
        return res.status(404).json({ message: 'Participant not found' });
      }
      
      const updatedParticipant = await storage.updateParticipantRSVP(
        participant.id, 
        status, 
        response
      );
      
      res.json(updatedParticipant);
    } catch (error) {
      console.error('Error updating RSVP:', error);
      res.status(500).json({ message: 'Failed to update RSVP' });
    }
  });

  // Get events requiring approval (admin only)
  app.get('/api/calendar/pending-approval', isAuthenticated, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const events = await storage.getEventsRequiringApproval(req.user!.tenantId);
      res.json(events);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      res.status(500).json({ message: 'Failed to fetch pending approvals' });
    }
  });

  // Approve/reject event (admin only)
  app.patch('/api/calendar/events/:eventId/approval', isAuthenticated, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const { eventId } = req.params;
      const { status } = req.body; // 'approved' or 'rejected'
      
      const updatedEvent = await storage.updateEvent(eventId, {
        approvalStatus: status,
        approvedBy: req.user!.id,
        approvedAt: new Date(),
      });
      
      res.json(updatedEvent);
    } catch (error) {
      console.error('Error updating approval status:', error);
      res.status(500).json({ message: 'Failed to update approval status' });
    }
  });

  // Get event templates
  app.get('/api/calendar/templates', isAuthenticated, requireRole(['admin', 'teacher']), async (req: AuthenticatedRequest, res) => {
    try {
      const templates = await storage.getEventTemplates(req.user!.tenantId);
      res.json(templates);
    } catch (error) {
      console.error('Error fetching event templates:', error);
      res.status(500).json({ message: 'Failed to fetch event templates' });
    }
  });

  // Create event template
  app.post('/api/calendar/templates', isAuthenticated, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const templateData = insertEventTemplateSchema.parse({
        ...req.body,
        id: uuidv4(),
        tenantId: req.user!.tenantId,
        createdBy: req.user!.id,
      });

      const template = await storage.createEventTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      console.error('Error creating event template:', error);
      res.status(500).json({ message: 'Failed to create event template' });
    }
  });

  // Get user's event conflicts
  app.get('/api/calendar/conflicts', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { start, end } = req.query;
      const userId = req.user!.id;
      
      const startDate = new Date(start as string);
      const endDate = new Date(end as string);
      
      const conflicts = await storage.getUserEventConflicts(userId, startDate, endDate);
      
      res.json(conflicts);
    } catch (error) {
      console.error('Error checking conflicts:', error);
      res.status(500).json({ message: 'Failed to check conflicts' });
    }
  });

  // Get calendar statistics (admin only)
  app.get('/api/calendar/stats', isAuthenticated, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
    try {
      const now = new Date();
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      const [pastEvents, upcomingEvents, pendingApproval] = await Promise.all([
        storage.getEventsByDateRange(oneMonthAgo, now, req.user!.tenantId),
        storage.getEventsByDateRange(now, oneMonthFromNow, req.user!.tenantId),
        storage.getEventsRequiringApproval(req.user!.tenantId)
      ]);
      
      const stats = {
        pastEventsCount: pastEvents.length,
        upcomingEventsCount: upcomingEvents.length,
        pendingApprovalCount: pendingApproval.length,
        eventTypeBreakdown: upcomingEvents.reduce((acc, event) => {
          acc[event.eventType] = (acc[event.eventType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };
      
      res.json(stats);
    } catch (error) {
      console.error('Error fetching calendar stats:', error);
      res.status(500).json({ message: 'Failed to fetch calendar stats' });
    }
  });
}