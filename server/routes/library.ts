import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import type { AuthenticatedRequest } from "../types";

export function registerLibraryRoutes(app: Express) {
  // Get library categories
  app.get('/api/library/categories', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { gradeLevel } = req.query;
      const categories = await storage.getLibraryCategories(gradeLevel as string);
      res.json(categories);
    } catch (error) {
      console.error('Error fetching library categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  // Get library subjects
  app.get('/api/library/subjects', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { gradeLevel, categoryId } = req.query;
      const subjects = await storage.getLibrarySubjects(
        gradeLevel as string, 
        categoryId as string
      );
      res.json(subjects);
    } catch (error) {
      console.error('Error fetching library subjects:', error);
      res.status(500).json({ message: 'Failed to fetch subjects' });
    }
  });

  // Get library resources
  app.get('/api/library/resources', isAuthenticated, async (req: AuthenticatedRequest, res) => {
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
  app.get('/api/library/resources/:id', isAuthenticated, async (req: AuthenticatedRequest, res) => {
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
  app.post('/api/library/access', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
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
  app.get('/api/library/viewer/:id', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const resource = await storage.getLibraryResource(req.params.id);
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Record view access
      const userId = req.user?.claims?.sub;
      if (userId) {
        await storage.createLibraryResourceAccess({
          resourceId: resource.id,
          userId,
          accessType: 'view'
        });
        await storage.updateResourceStats(resource.id, 'view');
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