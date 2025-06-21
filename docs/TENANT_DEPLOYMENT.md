# Tenant Deployment Configuration

This document explains how the EdVirons platform handles tenant-specific deployments that exclude global content authoring features.

## Build Types

### Development Build
- **Command**: `npm run dev`
- **Features**: All features enabled for development and testing
- **Authoring**: Full access to content authoring dashboard

### Global Build  
- **Command**: `npm run build:global`
- **Features**: All features including global content authoring
- **Use Case**: Main EdVirons platform deployment with content creation capabilities

### Tenant Build
- **Command**: `npm run build:tenant`
- **Features**: Excludes global content authoring features
- **Use Case**: School/institution-specific deployments

## Excluded Features in Tenant Builds

### Frontend
- `/authoring-dashboard` route is not registered
- `AuthoringDashboard` component is not included in bundle
- Navigation menus exclude authoring-related items
- Module registry filters out `authoring-dashboard` module

### Backend
- Authoring API routes (`/api/authoring/*`) are not registered
- Book project management endpoints disabled
- Template management endpoints disabled

## Environment Variables

Set the following environment variables for different build types:

```bash
# For tenant builds
VITE_BUILD_TYPE=tenant
BUILD_TYPE=tenant

# For global builds  
VITE_BUILD_TYPE=global
BUILD_TYPE=global
```

## Access Control

### Global Authors
Users with these roles can access content authoring (only in global builds):
- `global_author`
- `content_admin` 
- `super_admin`

### Tenant Users
Regular tenant users (teachers, students, admins) cannot access:
- Content authoring dashboard
- Book project creation
- Global content management

## Implementation Details

### Build Configuration
- `client/src/config/buildConfig.ts` - Controls feature inclusion
- Environment-based filtering of routes and components
- Runtime checks for feature availability

### Route Protection
- `RoleProtectedRoute` component enhanced with custom access checks
- Build-time exclusion of unauthorized routes
- Proper error handling for missing features

### Module System
- Module registry respects build configuration
- Dynamic filtering based on `VITE_BUILD_TYPE`
- Tenant-aware navigation generation

## Deployment Process

1. **Set Environment Variables**
   ```bash
   export VITE_BUILD_TYPE=tenant
   export BUILD_TYPE=tenant
   ```

2. **Build for Tenant**
   ```bash
   npm run build:tenant
   ```

3. **Deploy Artifacts**
   - Frontend bundle excludes authoring components
   - Backend excludes authoring API routes
   - Reduced bundle size for tenant deployments

## Security Benefits

- **Separation of Concerns**: Tenant users cannot access global content creation
- **Reduced Attack Surface**: Authoring endpoints not exposed in tenant builds
- **Clear Boundaries**: Explicit separation between global and tenant features
- **Compliance**: Ensures tenant data isolation from global content management