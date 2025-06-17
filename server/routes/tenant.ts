import type { Express } from "express";

export function registerTenantRoutes(app: Express) {
  app.get('/api/tenant', (req: any, res) => {
    try {
      const tenant = {
        id: 'demo-school',
        name: 'Demo Educational Institution',
        subdomain: 'demo-school',
        features: [
          'device-management',
          'digital-library',
          'teacher-dashboard',
          'analytics',
          'xapi-tracking',
          'family-controls',
          'licensing'
        ],
        subscription: 'premium',
        settings: {
          branding: {
            logo: '/assets/school-logo.png',
            primaryColor: '#1e40af',
            secondaryColor: '#3b82f6'
          },
          modules: {
            deviceManagement: true,
            digitalLibrary: true,
            teacherDashboard: true,
            analytics: true,
            familyControls: true,
            licensing: true
          }
        }
      };
      
      res.json(tenant);
    } catch (error) {
      console.error("Error fetching tenant info:", error);
      res.status(500).json({ message: "Failed to fetch tenant information" });
    }
  });

  app.get('/api/tenant/info', (req: any, res) => {
    const tenant = req.tenant || {
      id: 'demo-school',
      name: 'Demo Educational Institution',
      subdomain: 'demo-school'
    };
    
    res.json(tenant);
  });
}