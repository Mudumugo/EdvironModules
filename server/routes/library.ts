import type { Express, Response } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../roleMiddleware";

export function registerLibraryRoutes(app: Express) {
  // Get library categories
  app.get('/api/library/categories', isAuthenticated, async (req: any, res: Response) => {
    try {
      const { gradeLevel } = req.query;
      const categories = await storage.getLibraryCategories(gradeLevel as string);
      res.json(categories);
    } catch (error) {
      console.error('Error fetching library categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  // Get library subjects with resource counts
  app.get('/api/library/subjects', isAuthenticated, async (req: any, res: Response) => {
    try {
      const { gradeLevel, categoryId } = req.query;
      const subjects = await storage.getLibrarySubjects(
        gradeLevel as string, 
        categoryId as string
      );
      
      // Get resource counts for each subject
      const resourceCounts = await storage.getResourceCountsBySubject(gradeLevel as string);
      
      // Add resource counts to subjects
      const subjectsWithCounts = subjects.map(subject => ({
        ...subject,
        resourceCounts: resourceCounts[subject.id] || { books: 0, worksheets: 0, quizzes: 0 }
      }));
      
      res.json(subjectsWithCounts);
    } catch (error) {
      console.error('Error fetching library subjects:', error);
      res.status(500).json({ message: 'Failed to fetch subjects' });
    }
  });

  // Get library resources
  app.get('/api/library/resources', isAuthenticated, async (req: any, res: Response) => {
    try {
      const filters = {
        gradeLevel: req.query.gradeLevel as string,
        categoryId: req.query.categoryId as string,
        subjectId: req.query.subjectId as string,
        resourceType: req.query.resourceType as string,
        search: req.query.search as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50
      };

      const resources = await storage.getLibraryResources(filters);
      res.json(resources);
    } catch (error) {
      console.error('Error fetching library resources:', error);
      res.status(500).json({ message: 'Failed to fetch resources' });
    }
  });

  // Get single resource
  app.get('/api/library/resources/:id', isAuthenticated, async (req: any, res: Response) => {
    try {
      const resource = await storage.getLibraryResource(req.params.id);
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }
      res.json(resource);
    } catch (error) {
      console.error('Error fetching library resource:', error);
      res.status(500).json({ message: 'Failed to fetch resource' });
    }
  });

  // Record resource access
  app.post('/api/library/access', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { resourceId, accessType } = req.body;
      
      // Create access record
      await storage.createLibraryResourceAccess({
        resourceId,
        userId,
        accessType
      });

      // Update resource stats
      if (accessType === 'view') {
        await storage.updateResourceStats(resourceId, 'view');
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error recording resource access:', error);
      res.status(500).json({ message: 'Failed to record access' });
    }
  });

  // Get resource viewer (for opening resources)
  app.get('/api/library/viewer/:id', isAuthenticated, async (req: any, res: Response) => {
    try {
      const resource = await storage.getLibraryResource(req.params.id);
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Record view access
      const userId = req.user?.id;
      if (userId) {
        await storage.createLibraryResourceAccess({
          resourceId: resource.id,
          userId,
          accessType: 'view'
        });
        // Skip stats update for now
      }

      // Return resource data for viewer
      res.json({
        resource,
        viewerUrl: `/library/viewer/${resource.id}`,
        fileUrl: resource.fileUrl,
        canDownload: false // Security: no direct downloads
      });
    } catch (error) {
      console.error('Error accessing resource viewer:', error);
      res.status(500).json({ message: 'Failed to access resource' });
    }
  });
}