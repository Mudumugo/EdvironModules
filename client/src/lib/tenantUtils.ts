// Multi-tenant utilities for subdomain-based tenant isolation

export interface TenantConfig {
  id: string;
  subdomain: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  features: string[];
  subscription: 'basic' | 'premium' | 'enterprise';
  customDomain?: string;
}

// Extract tenant subdomain from current URL
export function getCurrentTenant(): string | null {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  
  // Handle localhost development
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
    // For development, we can simulate tenants via query params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const tenantParam = urlParams.get('tenant');
    if (tenantParam) return tenantParam;
    
    return localStorage.getItem('dev-tenant') || 'demo';
  }
  
  // Extract subdomain from hostname
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0]; // First part is the subdomain
  }
  
  return null;
}

// Set tenant for development mode
export function setDevTenant(tenantId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dev-tenant', tenantId);
    window.location.reload();
  }
}

// Get tenant-specific configuration
export function getTenantConfig(tenantId: string): TenantConfig | null {
  const tenantConfigs: Record<string, TenantConfig> = {
    'demo': {
      id: 'demo',
      subdomain: 'demo',
      name: 'Demo University',
      logo: '/logos/demo-university.png',
      primaryColor: '#3B82F6',
      features: ['school-management', 'digital-library', 'analytics'],
      subscription: 'basic'
    },
    'harvard': {
      id: 'harvard',
      subdomain: 'harvard',
      name: 'Harvard University',
      logo: '/logos/harvard.png',
      primaryColor: '#A51C30',
      features: ['school-management', 'digital-library', 'tutor-hub', 'analytics', 'virtual-labs'],
      subscription: 'enterprise'
    },
    'stanford': {
      id: 'stanford',
      subdomain: 'stanford',
      name: 'Stanford University',
      logo: '/logos/stanford.png',
      primaryColor: '#8C1515',
      features: ['school-management', 'digital-library', 'tutor-hub', 'analytics', 'certification'],
      subscription: 'premium'
    },
    'mitschool': {
      id: 'mitschool',
      subdomain: 'mitschool',
      name: 'MIT School of Engineering',
      logo: '/logos/mit.png',
      primaryColor: '#750014',
      features: ['school-management', 'digital-library', 'tutor-hub', 'analytics', 'virtual-labs', 'certification'],
      subscription: 'enterprise'
    }
  };

  return tenantConfigs[tenantId] || null;
}

// Check if a feature is available for the current tenant
export function isTenantFeatureEnabled(featureId: string, tenantId?: string): boolean {
  const currentTenant = tenantId || getCurrentTenant();
  if (!currentTenant) return false;
  
  const config = getTenantConfig(currentTenant);
  return config?.features.includes(featureId) || false;
}

// Get tenant-specific API base URL
export function getTenantApiUrl(tenantId?: string): string {
  const currentTenant = tenantId || getCurrentTenant();
  
  if (!currentTenant) {
    return '/api';
  }
  
  // In production, this would route to tenant-specific API endpoints
  return `/api/tenant/${currentTenant}`;
}

// Generate tenant-specific styles/theme
export function getTenantTheme(tenantId?: string): { primaryColor: string; logo?: string } {
  const currentTenant = tenantId || getCurrentTenant();
  const config = currentTenant ? getTenantConfig(currentTenant) : null;
  
  return {
    primaryColor: config?.primaryColor || '#3B82F6',
    logo: config?.logo
  };
}

// Validate tenant access
export function validateTenantAccess(tenantId: string): boolean {
  const config = getTenantConfig(tenantId);
  return config !== null;
}