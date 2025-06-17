import type { Request, Response, NextFunction } from "express";

export interface TenantRequest extends Request {
  tenant?: {
    id: string;
    subdomain: string;
    name: string;
    features: string[];
    subscription: string;
  };
}

// Extract tenant from subdomain or headers
export function extractTenant(req: TenantRequest, res: Response, next: NextFunction) {
  const host = req.get('host') || '';
  const hostname = host.split(':')[0]; // Remove port if present
  
  let tenantId: string | null = null;
  
  // Handle localhost development
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
    // For development, check query param or default to demo
    tenantId = req.query.tenant as string || 'demo';
  } else {
    // Extract subdomain from hostname
    const parts = hostname.split('.');
    if (parts.length > 2) {
      tenantId = parts[0]; // First part is the subdomain
    }
  }
  
  // Validate tenant exists or use default for development
  if (tenantId && validateTenant(tenantId)) {
    req.tenant = getTenantConfig(tenantId);
  } else if (hostname === 'localhost' || hostname.startsWith('127.0.0.1') || hostname.includes('replit')) {
    // For development environments, use demo tenant as default
    req.tenant = getTenantConfig('demo');
  } else {
    return res.status(404).json({ 
      error: 'Tenant not found',
      message: 'The requested tenant domain is not valid or does not exist.'
    });
  }
  
  next();
}

// Tenant configurations
const tenantConfigs = {
  'demo': {
    id: 'demo',
    subdomain: 'demo',
    name: 'Demo University',
    features: ['school-management', 'digital-library', 'analytics'],
    subscription: 'basic'
  },
  'harvard': {
    id: 'harvard',
    subdomain: 'harvard',
    name: 'Harvard University',
    features: ['school-management', 'digital-library', 'tutor-hub', 'analytics', 'virtual-labs'],
    subscription: 'enterprise'
  },
  'stanford': {
    id: 'stanford',
    subdomain: 'stanford',
    name: 'Stanford University',
    features: ['school-management', 'digital-library', 'tutor-hub', 'analytics', 'certification'],
    subscription: 'premium'
  },
  'mitschool': {
    id: 'mitschool',
    subdomain: 'mitschool',
    name: 'MIT School of Engineering',
    features: ['school-management', 'digital-library', 'tutor-hub', 'analytics', 'virtual-labs', 'certification'],
    subscription: 'enterprise'
  }
};

function validateTenant(tenantId: string): boolean {
  return tenantId in tenantConfigs;
}

function getTenantConfig(tenantId: string) {
  return tenantConfigs[tenantId as keyof typeof tenantConfigs];
}

// Middleware to check feature access for tenant
export function requireTenantFeature(featureId: string) {
  return (req: TenantRequest, res: Response, next: NextFunction) => {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not identified' });
    }
    
    if (!req.tenant.features.includes(featureId)) {
      return res.status(403).json({ 
        error: 'Feature not available',
        message: `The ${featureId} feature is not available for your subscription plan.`
      });
    }
    
    next();
  };
}