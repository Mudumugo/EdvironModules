import type { Express, Response } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db } from "../db";
import { classes } from "@shared/schemas/education.schema";
// Note: timetableEntries removed as it's not part of modular schema
import { isAuthenticated } from "../replitAuth";
import { requirePermission } from "../roleMiddleware";
import { PERMISSIONS } from "@shared/schema";

export function registerTimetableRoutes(app: Express) {
  // Get all timetable entries with optional filters
  app.get('/api/timetable/entries', isAuthenticated, async (req: any, res: Response) => {
    try {
      const { semester, classId, academicYear } = req.query;
      
      let query = db.select().from(timetableEntries);
      
      // Apply filters if provided
      const conditions = [];
      if (semester) {
        conditions.push(eq(timetableEntries.semester, semester as string));
      }
      if (classId && classId !== 'all') {
        conditions.push(eq(timetableEntries.classId, classId as string));
      }
      if (academicYear) {
        conditions.push(eq(timetableEntries.academicYear, academicYear as string));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const entries = await query.orderBy(
        timetableEntries.dayOfWeek,
        timetableEntries.startTime
      );
      
      res.json(entries);
    } catch (error) {
      console.error("Error fetching timetable entries:", error);
      res.status(500).json({ message: "Failed to fetch timetable entries" });
    }
  });

  // Get timetable entries for a specific teacher
  app.get('/api/timetable/teacher/:teacherId', isAuthenticated, async (req: any, res: Response) => {
    try {
      const { teacherId } = req.params;
      const { semester, academicYear } = req.query;
      
      let conditions = [eq(timetableEntries.teacherId, teacherId)];
      
      if (semester) {
        conditions.push(eq(timetableEntries.semester, semester as string));
      }
      if (academicYear) {
        conditions.push(eq(timetableEntries.academicYear, academicYear as string));
      }
      
      const entries = await db.select()
        .from(timetableEntries)
        .where(and(...conditions))
        .orderBy(timetableEntries.dayOfWeek, timetableEntries.startTime);
      
      res.json(entries);
    } catch (error) {
      console.error("Error fetching teacher timetable:", error);
      res.status(500).json({ message: "Failed to fetch teacher timetable" });
    }
  });

  // Get timetable entries for a specific class
  app.get('/api/timetable/class/:classId', isAuthenticated, async (req: any, res: Response) => {
    try {
      const { classId } = req.params;
      const { semester, academicYear } = req.query;
      
      let conditions = [eq(timetableEntries.classId, classId)];
      
      if (semester) {
        conditions.push(eq(timetableEntries.semester, semester as string));
      }
      if (academicYear) {
        conditions.push(eq(timetableEntries.academicYear, academicYear as string));
      }
      
      const entries = await db.select()
        .from(timetableEntries)
        .where(and(...conditions))
        .orderBy(timetableEntries.dayOfWeek, timetableEntries.startTime);
      
      res.json(entries);
    } catch (error) {
      console.error("Error fetching class timetable:", error);
      res.status(500).json({ message: "Failed to fetch class timetable" });
    }
  });

  // Create a new timetable entry
  app.post('/api/timetable/entries', 
    isAuthenticated, 
    requirePermission(PERMISSIONS.MANAGE_SCHOOL_SETTINGS),
    async (req: any, res: Response) => {
      try {
        const entryData = req.body;
        
        // Calculate duration from start and end times
        const startTime = entryData.startTime;
        const endTime = entryData.endTime;
        const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
        const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
        const duration = endMinutes - startMinutes;
        
        // Get teacher and class names from their IDs
        const teacherName = `Teacher ${entryData.teacherId}`; // Would fetch from users table in real implementation
        const className = `Class ${entryData.classId}`; // Would fetch from classes table in real implementation
        
        const [newEntry] = await db.insert(timetableEntries).values({
          ...entryData,
          dayOfWeek: parseInt(entryData.dayOfWeek),
          duration,
          teacherName,
          className,
          tenantId: "default"
        }).returning();
        
        res.status(201).json(newEntry);
      } catch (error) {
        console.error("Error creating timetable entry:", error);
        res.status(500).json({ message: "Failed to create timetable entry" });
      }
    }
  );

  // Update a timetable entry
  app.put('/api/timetable/entries/:id', 
    isAuthenticated, 
    requirePermission(PERMISSIONS.MANAGE_SCHOOL_SETTINGS),
    async (req: any, res: Response) => {
      try {
        const { id } = req.params;
        const entryData = req.body;
        
        // Calculate duration from start and end times
        const startTime = entryData.startTime;
        const endTime = entryData.endTime;
        const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
        const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
        const duration = endMinutes - startMinutes;
        
        // Get teacher and class names from their IDs
        const teacherName = `Teacher ${entryData.teacherId}`; // Would fetch from users table in real implementation
        const className = `Class ${entryData.classId}`; // Would fetch from classes table in real implementation
        
        const [updatedEntry] = await db.update(timetableEntries)
          .set({
            ...entryData,
            dayOfWeek: parseInt(entryData.dayOfWeek),
            duration,
            teacherName,
            className,
            updatedAt: new Date()
          })
          .where(eq(timetableEntries.id, parseInt(id)))
          .returning();
        
        if (!updatedEntry) {
          return res.status(404).json({ message: "Timetable entry not found" });
        }
        
        res.json(updatedEntry);
      } catch (error) {
        console.error("Error updating timetable entry:", error);
        res.status(500).json({ message: "Failed to update timetable entry" });
      }
    }
  );

  // Delete a timetable entry
  app.delete('/api/timetable/entries/:id', 
    isAuthenticated, 
    requirePermission(PERMISSIONS.MANAGE_SCHOOL_SETTINGS),
    async (req: any, res: Response) => {
      try {
        const { id } = req.params;
        
        const [deletedEntry] = await db.delete(timetableEntries)
          .where(eq(timetableEntries.id, parseInt(id)))
          .returning();
        
        if (!deletedEntry) {
          return res.status(404).json({ message: "Timetable entry not found" });
        }
        
        res.json({ message: "Timetable entry deleted successfully" });
      } catch (error) {
        console.error("Error deleting timetable entry:", error);
        res.status(500).json({ message: "Failed to delete timetable entry" });
      }
    }
  );

  // Get all classes
  app.get('/api/classes', isAuthenticated, async (req: any, res: Response) => {
    try {
      const classList = await db.select()
        .from(classes)
        .where(eq(classes.isActive, true))
        .orderBy(classes.name);
      
      res.json(classList);
    } catch (error) {
      console.error("Error fetching classes:", error);
      res.status(500).json({ message: "Failed to fetch classes" });
    }
  });

  // Create a new class
  app.post('/api/classes', 
    isAuthenticated, 
    requirePermission(PERMISSIONS.MANAGE_SCHOOL_SETTINGS),
    async (req: any, res: Response) => {
      try {
        const classData = req.body;
        
        const [newClass] = await db.insert(classes).values({
          ...classData,
          tenantId: "default"
        }).returning();
        
        res.status(201).json(newClass);
      } catch (error) {
        console.error("Error creating class:", error);
        res.status(500).json({ message: "Failed to create class" });
      }
    }
  );

  // Get teachers for dropdown
  app.get('/api/users/teachers', isAuthenticated, async (req: any, res: Response) => {
    try {
      // Mock data for now - would fetch from users table with teacher role in real implementation
      const teachers = [
        { id: 'teacher1', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@school.edu' },
        { id: 'teacher2', firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@school.edu' },
        { id: 'teacher3', firstName: 'Robert', lastName: 'Chen', email: 'robert.chen@school.edu' },
        { id: 'teacher4', firstName: 'Maria', lastName: 'Garcia', email: 'maria.garcia@school.edu' },
        { id: 'teacher5', firstName: 'David', lastName: 'Wilson', email: 'david.wilson@school.edu' }
      ];
      
      res.json(teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      res.status(500).json({ message: "Failed to fetch teachers" });
    }
  });
}