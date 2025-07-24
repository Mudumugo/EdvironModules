import { Express, Request, Response } from 'express';
import { storage } from '../storage';
import { isAuthenticated } from '../roleMiddleware';
import type { AuthenticatedRequest } from '../roleMiddleware';
import { z } from 'zod';
import { 
  insertAssessmentBookSchema, 
  insertAssessmentEntrySchema, 
  insertBehaviorReportSchema,
  insertSubjectStrandSchema 
} from '../../shared/schemas/education.schema';

export function setupAssessmentBookRoutes(app: Express) {
  
  // Get all students for a teacher's classes
  app.get('/api/assessment-book/students', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { grade, className } = req.query;
      const students = await storage.getStudentsByTeacher(req.user.id, { 
        grade: grade as string, 
        className: className as string 
      });
      res.json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  });

  // Get all subjects for a specific grade level  
  app.get('/api/assessment-book/subjects', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { gradeLevel } = req.query;
      const subjects = await storage.getSubjectsByGrade(gradeLevel as string, req.user.tenantId);
      res.json(subjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);  
      res.status(500).json({ error: 'Failed to fetch subjects' });
    }
  });

  // Get assessment book for a specific student, subject, and term
  app.get('/api/assessment-book/:studentId/:subjectId/:term', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { studentId, subjectId, term } = req.params;
      const academicYear = req.query.academicYear as string || '2025';
      
      const assessmentBook = await storage.getAssessmentBook(
        parseInt(studentId), 
        parseInt(subjectId), 
        term, 
        academicYear,
        req.user.tenantId
      );
      
      res.json(assessmentBook);
    } catch (error) {
      console.error('Error fetching assessment book:', error);
      res.status(500).json({ error: 'Failed to fetch assessment book' });
    }
  });

  // Create or update assessment book
  app.post('/api/assessment-book', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validatedData = insertAssessmentBookSchema.parse({
        ...req.body,
        teacherId: req.user.id,
        tenantId: req.user.tenantId
      });

      const assessmentBook = await storage.createOrUpdateAssessmentBook(validatedData);
      res.json(assessmentBook);
    } catch (error) {
      console.error('Error creating assessment book:', error);
      res.status(500).json({ error: 'Failed to create assessment book' });
    }
  });

  // Add or update assessment entry
  app.post('/api/assessment-book/entry', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validatedData = insertAssessmentEntrySchema.parse(req.body);
      const entry = await storage.createOrUpdateAssessmentEntry(validatedData);
      res.json(entry);
    } catch (error) {
      console.error('Error creating assessment entry:', error);
      res.status(500).json({ error: 'Failed to create assessment entry' });
    }
  });

  // Get behavior report for a student
  app.get('/api/assessment-book/behavior/:studentId/:term', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { studentId, term } = req.params;
      const academicYear = req.query.academicYear as string || '2025';
      
      const behaviorReport = await storage.getBehaviorReport(
        parseInt(studentId), 
        term, 
        academicYear,
        req.user.tenantId
      );
      
      res.json(behaviorReport);
    } catch (error) {
      console.error('Error fetching behavior report:', error);
      res.status(500).json({ error: 'Failed to fetch behavior report' });
    }
  });

  // Create or update behavior report
  app.post('/api/assessment-book/behavior', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validatedData = insertBehaviorReportSchema.parse({
        ...req.body,
        teacherId: req.user.id,
        tenantId: req.user.tenantId
      });

      const behaviorReport = await storage.createOrUpdateBehaviorReport(validatedData);
      res.json(behaviorReport);
    } catch (error) {
      console.error('Error creating behavior report:', error);
      res.status(500).json({ error: 'Failed to create behavior report' });
    }
  });

  // Get strands for a subject
  app.get('/api/assessment-book/strands/:subjectId', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { subjectId } = req.params;
      const strands = await storage.getSubjectStrands(parseInt(subjectId));
      res.json(strands);
    } catch (error) {
      console.error('Error fetching strands:', error);
      res.status(500).json({ error: 'Failed to fetch strands' });
    }
  });

  // Add new subject strand (for teachers/admins)
  app.post('/api/assessment-book/strands', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Check if user has permission to add strands (teachers and admins)
      if (!['teacher', 'school_admin', 'edvirons_admin'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      const validatedData = insertSubjectStrandSchema.parse(req.body);
      const strand = await storage.createSubjectStrand(validatedData);
      res.json(strand);
    } catch (error) {
      console.error('Error creating strand:', error);
      res.status(500).json({ error: 'Failed to create strand' });
    }
  });

  // Get student summary for all subjects in a term
  app.get('/api/assessment-book/summary/:studentId/:term', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { studentId, term } = req.params;
      const academicYear = req.query.academicYear as string || '2025';
      
      const summary = await storage.getStudentAssessmentSummary(
        parseInt(studentId), 
        term, 
        academicYear,
        req.user.tenantId
      );
      
      res.json(summary);
    } catch (error) {
      console.error('Error fetching assessment summary:', error);
      res.status(500).json({ error: 'Failed to fetch assessment summary' });
    }
  });

  // Add new subject (for admins and teachers)
  app.post('/api/assessment-book/subjects', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Check permissions
      if (!['teacher', 'school_admin', 'edvirons_admin'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      const subjectData = {
        ...req.body,
        tenantId: req.user.tenantId
      };

      const subject = await storage.createSubject(subjectData);
      res.json(subject);
    } catch (error) {
      console.error('Error creating subject:', error);
      res.status(500).json({ error: 'Failed to create subject' });
    }
  });

  // Get comprehensive report data for report card generation
  app.get('/api/assessment-book/report/:studentId/:term', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { studentId, term } = req.params;
      const academicYear = req.query.academicYear as string || '2025';
      
      // Simulate comprehensive report data
      const reportData = {
        student: {
          id: parseInt(studentId),
          name: studentId === '1' ? 'Jane Muthoni Wanjiku' : 'John Doe',
          upi: '12345678',
          grade: '6',
          stream: 'Blue',
        },
        term,
        academicYear,
        classTeacher: 'Mr. Kamau',
        attendance: '95%',
        daysPresent: '85/90',
        daysAbsent: '5',
        subjects: [
          { name: 'Mathematics', term1: 'ME', term2: 'EE', term3: '-', comment: 'Jane has shown remarkable improvement in problem solving' },
          { name: 'English', term1: 'ME', term2: 'ME', term3: '-', comment: 'Good reading skills, needs to work on creative writing' },
          { name: 'Kiswahili', term1: 'AE', term2: 'ME', term3: '-', comment: 'Improved significantly in oral skills' },
          { name: 'Science & Technology', term1: 'ME', term2: 'ME', term3: '-', comment: 'Very curious and asks good questions' },
          { name: 'Social Studies', term1: 'ME', term2: 'EE', term3: '-', comment: 'Excellent participation in class discussions' },
          { name: 'CRE', term1: 'EE', term2: 'EE', term3: '-', comment: 'Demonstrates good moral values' },
          { name: 'Home Science', term1: 'ME', term2: 'ME', term3: '-', comment: 'Good practical skills' },
          { name: 'Agriculture', term1: 'ME', term2: 'ME', term3: '-', comment: 'Shows interest in gardening activities' }
        ],
        mathStrands: [
          { name: 'Numbers', term1: 'ME', term2: 'EE', comment: 'Excellent progress in fractions' },
          { name: 'Measurement', term1: 'ME', term2: 'ME', comment: 'Good understanding of units' },
          { name: 'Geometry', term1: 'AE', term2: 'ME', comment: 'Improved in angle measurement' },
          { name: 'Data Handling', term1: 'ME', term2: 'ME', comment: 'Can interpret graphs well' }
        ],
        behavior: {
          respectForOthers: true,
          respectForProperty: true,
          respectForSelf: true,
          respectForEnvironment: true
        },
        classTeacherComment: `${studentId === '1' ? 'Jane' : 'John'} is a diligent student who has shown consistent improvement this term. She demonstrates strong participation in class discussions and shows good leadership qualities. With continued hard work, ${studentId === '1' ? 'Jane' : 'John'} will achieve even better results next term.`,
        headTeacherComment: `${studentId === '1' ? 'Jane' : 'John'} maintains good conduct and is respectful to both teachers and fellow students. We commend her for representing the school in the recent math contest.`
      };

      res.json(reportData);
    } catch (error) {
      console.error('Error fetching report data:', error);
      res.status(500).json({ error: 'Failed to fetch report data' });
    }
  });

  // Generate PDF report card
  app.post('/api/assessment-book/report/:studentId/:term/pdf', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { studentId, term } = req.params;
      const academicYear = req.query.academicYear as string || '2025';
      
      // In a real implementation, you would use a PDF generation library like puppeteer
      // For now, return a mock PDF response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="report_card_${studentId}_${term}_${academicYear}.pdf"`);
      
      // Mock PDF content - in production, generate actual PDF
      const mockPdfContent = Buffer.from('Mock PDF content for report card');
      res.send(mockPdfContent);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });
}