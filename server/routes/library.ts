import type { Express } from "express";
import { isAuthenticated } from "../roleMiddleware";

const libraryRecommendations = [
  {
    id: "1",
    title: "Introduction to Algebra",
    type: "book",
    subject: "Mathematics",
    rating: 4,
    isNew: true,
    description: "Learn fundamental algebraic concepts with clear examples"
  },
  {
    id: "2",
    title: "The Solar System Explained",
    type: "video",
    subject: "Science",
    rating: 5,
    isNew: false,
    description: "Documentary exploring planets and celestial bodies"
  },
  {
    id: "3",
    title: "World War II Timeline",
    type: "interactive",
    subject: "History",
    rating: 4,
    isNew: true,
    description: "Interactive timeline of major WWII events"
  },
  {
    id: "4",
    title: "Creative Writing Techniques",
    type: "article",
    subject: "English",
    rating: 3,
    isNew: false,
    description: "Tips and strategies for improving creative writing"
  },
  {
    id: "5",
    title: "Chemistry Lab Simulations",
    type: "interactive",
    subject: "Science",
    rating: 5,
    isNew: true,
    description: "Virtual chemistry experiments and reactions"
  },
  {
    id: "6",
    title: "Shakespeare's Greatest Works",
    type: "book",
    subject: "Literature",
    rating: 4,
    isNew: false,
    description: "Collection of Shakespeare's most famous plays"
  }
];

const libraryResources = [
  {
    id: "lib_1",
    title: "Advanced Calculus Textbook",
    type: "book",
    subject: "Mathematics",
    grade: "12",
    rating: 4.5,
    downloads: 1250,
    description: "Comprehensive calculus textbook with practice problems"
  },
  {
    id: "lib_2", 
    title: "Biology Interactive Labs",
    type: "interactive",
    subject: "Biology",
    grade: "10-12",
    rating: 4.8,
    downloads: 890,
    description: "Virtual biology lab experiments and simulations"
  },
  {
    id: "lib_3",
    title: "American History Documentary Series",
    type: "video",
    subject: "History",
    grade: "9-12", 
    rating: 4.3,
    downloads: 2100,
    description: "10-part documentary series on American history"
  }
];

export function registerLibraryRoutes(app: Express) {
  // Get personalized library recommendations
  app.get('/api/library/recommendations', isAuthenticated, (req, res) => {
    try {
      // In a real implementation, this would be personalized based on:
      // - User's current subjects
      // - Learning progress
      // - Previous interactions
      // - Peer recommendations
      
      const personalizedRecommendations = libraryRecommendations
        .sort(() => 0.5 - Math.random()) // Randomize for demo
        .slice(0, 6);
        
      res.json(personalizedRecommendations);
    } catch (error) {
      console.error('Error fetching library recommendations:', error);
      res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
  });

  // Get library resources with search/filter
  app.get('/api/library/resources', isAuthenticated, (req, res) => {
    try {
      const { subject, type, grade, search } = req.query;
      let filteredResources = [...libraryResources];

      if (subject) {
        filteredResources = filteredResources.filter(r => 
          r.subject.toLowerCase() === (subject as string).toLowerCase()
        );
      }

      if (type) {
        filteredResources = filteredResources.filter(r => 
          r.type === type
        );
      }

      if (search) {
        const searchTerm = (search as string).toLowerCase();
        filteredResources = filteredResources.filter(r =>
          r.title.toLowerCase().includes(searchTerm) ||
          r.description.toLowerCase().includes(searchTerm)
        );
      }

      // Map the data to match frontend expectations
      const mappedResources = filteredResources.map(resource => ({
        ...resource,
        resourceType: resource.type,
        viewCount: resource.downloads || 0,
        duration: Math.floor(Math.random() * 60) + 10 // Temporary for demo
      }));

      res.json(mappedResources);
    } catch (error) {
      console.error('Error fetching library resources:', error);
      res.status(500).json({ error: 'Failed to fetch resources' });
    }
  });

  // Get specific resource details
  app.get('/api/library/resources/:id', isAuthenticated, (req, res) => {
    try {
      const resource = libraryResources.find(r => r.id === req.params.id);
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      
      // Map the data to match frontend expectations
      const mappedResource = {
        ...resource,
        resourceType: resource.type,
        viewCount: resource.downloads || 0,
        duration: Math.floor(Math.random() * 60) + 10
      };
      
      res.json(mappedResource);
    } catch (error) {
      console.error('Error fetching resource:', error);
      res.status(500).json({ error: 'Failed to fetch resource' });
    }
  });

  // Track resource interaction (view, download, etc.)
  app.post('/api/library/resources/:id/interact', isAuthenticated, (req, res) => {
    try {
      const { action } = req.body; // 'view', 'download', 'bookmark', etc.
      const resourceIndex = libraryResources.findIndex(r => r.id === req.params.id);
      
      if (resourceIndex === -1) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      if (action === 'download') {
        libraryResources[resourceIndex].downloads += 1;
      }

      res.json({ 
        success: true,
        message: `${action} tracked successfully`,
        resource: libraryResources[resourceIndex]
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
      res.status(500).json({ error: 'Failed to track interaction' });
    }
  });

  // Access resource endpoint
  app.post('/api/library/access', isAuthenticated, (req, res) => {
    try {
      const { resourceId, accessType } = req.body;
      const resource = libraryResources.find(r => r.id === resourceId);
      
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      // Track the access
      if (accessType === 'view') {
        const resourceIndex = libraryResources.findIndex(r => r.id === resourceId);
        if (resourceIndex !== -1) {
          libraryResources[resourceIndex].downloads += 1;
        }
      }

      // Return the resource data for the viewer
      const mappedResource = {
        ...resource,
        resourceType: resource.type,
        viewCount: resource.downloads || 0,
        duration: Math.floor(Math.random() * 60) + 10
      };

      res.json({ 
        success: true,
        resource: mappedResource,
        accessType
      });
    } catch (error) {
      console.error('Error accessing resource:', error);
      res.status(500).json({ error: 'Failed to access resource' });
    }
  });
}