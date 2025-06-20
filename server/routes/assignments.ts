import type { Express } from "express";
import { isAuthenticated } from "../roleMiddleware";

const sampleAssignments = [
  {
    id: "1",
    title: "Math Problem Set #5",
    subject: "Mathematics",
    dueDate: "2025-06-22T23:59:00Z",
    status: "pending",
    priority: "high",
    progress: 65,
    description: "Complete problems 1-20 from Chapter 5"
  },
  {
    id: "2", 
    title: "Science Lab Report",
    subject: "Science",
    dueDate: "2025-06-25T23:59:00Z",
    status: "pending",
    priority: "medium",
    progress: 30,
    description: "Write up findings from chemical reactions experiment"
  },
  {
    id: "3",
    title: "History Essay",
    subject: "History", 
    dueDate: "2025-06-28T23:59:00Z",
    status: "submitted",
    priority: "medium",
    progress: 100,
    description: "Essay on causes of World War I"
  },
  {
    id: "4",
    title: "English Reading Quiz",
    subject: "English",
    dueDate: "2025-06-21T09:00:00Z",
    status: "overdue",
    priority: "high",
    progress: 0,
    description: "Quiz on chapters 1-5 of assigned novel"
  },
  {
    id: "5",
    title: "Art Project",
    subject: "Art",
    dueDate: "2025-07-02T23:59:00Z", 
    status: "graded",
    priority: "low",
    progress: 100,
    description: "Create a watercolor landscape painting"
  }
];

export function registerAssignmentRoutes(app: Express) {
  // Get assignment status overview
  app.get('/api/assignments/status', isAuthenticated, (req, res) => {
    try {
      res.json(sampleAssignments);
    } catch (error) {
      console.error('Error fetching assignment status:', error);
      res.status(500).json({ error: 'Failed to fetch assignment status' });
    }
  });

  // Get specific assignment details
  app.get('/api/assignments/:id', isAuthenticated, (req, res) => {
    try {
      const assignment = sampleAssignments.find(a => a.id === req.params.id);
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
      res.json(assignment);
    } catch (error) {
      console.error('Error fetching assignment:', error);
      res.status(500).json({ error: 'Failed to fetch assignment' });
    }
  });

  // Submit assignment
  app.post('/api/assignments/:id/submit', isAuthenticated, (req, res) => {
    try {
      const assignmentIndex = sampleAssignments.findIndex(a => a.id === req.params.id);
      if (assignmentIndex === -1) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
      
      sampleAssignments[assignmentIndex].status = 'submitted';
      sampleAssignments[assignmentIndex].progress = 100;
      
      res.json({ 
        success: true, 
        message: 'Assignment submitted successfully',
        assignment: sampleAssignments[assignmentIndex]
      });
    } catch (error) {
      console.error('Error submitting assignment:', error);
      res.status(500).json({ error: 'Failed to submit assignment' });
    }
  });
}