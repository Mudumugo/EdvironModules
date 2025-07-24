# EdVirons Educational Platform

## Overview

EdVirons is a comprehensive educational technology platform built as a global multi-tenant system. The platform serves multiple school tenants with centralized management by the EdVirons team, offering educational applications, digital libraries, school management tools, and various learning modules.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Multi-Tenant Architecture
- **Global Management**: EdVirons team manages central app catalog, licensing, support, and tenant provisioning
- **Tenant Isolation**: Each school operates on isolated infrastructure with dedicated databases and networks  
- **Subdomain-based Access**: Schools access via `schoolname.edvirons.com` subdomains
- **Infrastructure as Code**: Automated VM provisioning and scaling based on subscription tiers

### Technology Stack
- **Frontend**: React + TypeScript with Vite build system
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with session-based demo accounts
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **File Storage**: MinIO for media and document storage
- **Real-time Features**: WebSocket support for live sessions

## Key Components

### 1. Authentication & Authorization
- **Multi-tier Role System**: EdVirons global roles (admin, content manager, support) and tenant-specific roles (school admin, teacher, student)
- **Session Management**: Express sessions with PostgreSQL storage
- **Demo System**: Pre-configured demo accounts for testing different role levels
- **Permission-based Access**: Granular permissions for different features and modules

### 2. Apps Hub Management
- **Global App Catalog**: Centrally managed by EdVirons team
- **Tenant App Access**: Schools can enable/disable specific apps
- **Custom Branding**: Per-tenant app customization (names, descriptions, icons)
- **Categories & Filtering**: Organized app discovery with multiple filter options

### 3. Educational Modules
- **School Management**: Student records, attendance, timetables, staff management
- **Digital Library**: CBC-aligned interactive books, videos, and learning resources
- **Tutor Hub**: Personalized workspace for tutors and teachers
- **Family Controls**: Parent dashboard for monitoring and controlling child activities
- **Analytics**: Comprehensive learning and usage analytics
- **Live Sessions**: Real-time classroom and tutoring sessions with WebSocket support

### 4. Content Management
- **Authoring Dashboard**: Content creation tools (disabled in tenant builds)
- **Library Resources**: Categorized by grade level and subject
- **Media Management**: File upload, processing, and distribution
- **Locker System**: Personal storage for students and teachers

## Data Flow

### Global to Tenant Data Flow
1. **App Management**: EdVirons team creates apps in global catalog → Schools enable specific apps → Students/teachers access enabled apps
2. **Content Distribution**: Global library resources → Tenant-specific access controls → User consumption
3. **Licensing**: Global license pool → Tenant allocations → User assignments
4. **Support**: Tenant issues → Global support system → Resolution and tracking

### User Interaction Flow
1. **Authentication**: User login → Role verification → Permission assignment → Module access
2. **Learning Path**: Library browsing → Content consumption → Progress tracking → Analytics
3. **School Operations**: Admin tasks → Student/staff management → Timetabling → Reporting

## External Dependencies

### Core Infrastructure
- **Neon Database**: PostgreSQL hosting for production
- **MinIO**: Self-hosted object storage for files and media
- **Replit Auth**: Authentication provider
- **SendGrid**: Email delivery service
- **Stripe**: Payment processing for subscriptions

### Optional Integrations
- **Notion API**: Documentation and knowledge base
- **Analytics Services**: Learning analytics and reporting
- **PBX System**: VoIP integration for school communications

## Deployment Strategy

### Build Configuration
- **Development Build**: All features enabled including authoring tools
- **Global Build**: Full EdVirons platform with content authoring capabilities
- **Tenant Build**: School-specific deployments with authoring features disabled

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://...

# Authentication  
SESSION_SECRET=...
ISSUER_URL=https://replit.com/oidc

# Build Type
BUILD_TYPE=global|tenant|development
VITE_BUILD_TYPE=global|tenant

# Storage
MINIO_ENDPOINT=...
MINIO_ACCESS_KEY=...
MINIO_SECRET_KEY=...
```

### Infrastructure Scaling
- **Basic Tier**: e2-small VM (1 vCPU, 2GB RAM) for up to 50 users
- **Premium/Enterprise**: Larger instances with dedicated resources
- **Auto-provisioning**: Terraform-based infrastructure deployment
- **Monitoring**: Centralized logging and performance tracking

### Security Considerations
- **Tenant Isolation**: Complete data separation between schools
- **Role-based Access**: Granular permissions for all features
- **Input Validation**: Comprehensive request validation and sanitization
- **Session Security**: Secure session management with appropriate timeouts

## Recent Major Enhancements

### Authentication & Logout System (July 24, 2025)
- **Multi-Layer Logout Protection**: Implemented comprehensive 5-layer logout protection system
- **Global State Management**: Added global logout state checks across all query components
- **Request Blocking**: Enhanced query client with request blocking during logout at lowest level
- **Query Cancellation**: Aggressive query cancellation and immediate session clearing
- **Error Prevention**: Completely eliminated 401 authentication errors during logout process
- **User Experience**: Clean logout experience with immediate redirect and proper cleanup

### Digital Assessment Book Subject Management (July 24, 2025)
- **Enhanced Dashboard Navigation**: Added Quick Actions card with prominent subject management buttons
- **Add Subject Functionality**: Fully tested and working custom subject creation with error handling
- **CBC Subject Integration**: Quick Add CBC Subjects feature with pre-defined learning strands
- **API Validation**: Confirmed backend API working perfectly with proper data persistence
- **User Interface**: Clear navigation from Dashboard to Subjects tab with improved user guidance
- **Subject Management**: Complete CRUD operations for subjects with strand support

### Digital Assessment Book Report Card System (July 24, 2025)
- **Comprehensive Report Card Generation**: Teachers can now generate professional printable report cards matching CBC standards
- **Assessment Integration**: Complete CBC grading system (EE, ME, AE, BE) with performance tracking
- **Print-Optimized Design**: Professional report card layout based on Kenyan educational standards
- **Multi-Subject Assessment**: Tracks all subjects including Mathematics strand-level performance
- **Behavioral Assessment**: Integrated behavioral tracking with teacher comments
- **Teacher Comments System**: Comprehensive comment system for class teacher and head teacher remarks
- **Export Functionality**: Print and PDF download capabilities for parent distribution
- **Real-time Data**: Dynamic report generation from logged assessments and grades

### Assessment Entry Validation Fix (July 24, 2025)
- **Zod Schema Correction**: Fixed critical validation error in assessment entry creation
- **ID Field Auto-generation**: Corrected insertAssessmentEntrySchema to omit ID field for proper auto-generation
- **Database Consistency**: Updated insertAssessmentBookSchema and insertBehaviorReportSchema with proper field omission
- **Error Resolution**: Eliminated "Required id field undefined" validation errors during assessment logging
- **Improved User Experience**: Teachers can now successfully create assessment entries without validation blocks

### Subject and Strand Management System (July 24, 2025)
- **Comprehensive Strand Manager**: Implemented full CRUD operations for subject learning strands
- **Subject Editor**: Added modal-based subject editing for name, code, and category modifications
- **Dynamic Strand Operations**: Teachers can add, edit, delete, and reorder subject strands in real-time
- **Inline Editing**: Quick edit functionality with save/cancel options for individual strands
- **Duplicate Prevention**: System prevents adding duplicate strands to maintain data integrity
- **Backend Integration**: Complete API endpoints for strand management with tenant isolation
- **Query Invalidation**: Automatic UI refresh after strand or subject modifications
- **Professional UI**: Modal dialogs with proper form validation and user feedback

### Mobile Responsive Design Implementation (July 24, 2025)
- **Mobile-First Approach**: Completely redesigned Digital Assessment Book for tablet and phone screens
- **Responsive Header**: Dynamic layout with stacked elements on mobile, proper spacing adjustments
- **Adaptive Navigation**: Tabs transform from 4-column to 2-column grid on mobile with condensed text
- **Touch-Friendly Interface**: Optimized button sizes and spacing for touch interaction
- **Scrollable Tables**: Horizontal scrolling for data tables with preserved functionality on small screens
- **Modal Optimization**: Responsive dialogs with proper mobile margins and vertical button stacking
- **Grid Adaptations**: Flexible layouts that stack on mobile while maintaining desktop functionality
- **Text Scaling**: Progressive text sizes from mobile (text-xs) to desktop (text-base/lg) for optimal readability

### Performance Optimizations (July 14, 2025)
- **React Optimization**: Implemented React.memo and useMemo across CBC Hub and major components
- **Database Pooling**: Added optimized PostgreSQL connection pooling with health monitoring
- **Server Performance**: Enhanced middleware with request timing, caching, and memory monitoring
- **Client Caching**: Implemented TTL-based client-side cache with automatic cleanup
- **Error Handling**: Added comprehensive error boundaries for graceful failure recovery
- **Component Optimization**: Memoized filters and computed values in TutorHub and SchoolCalendar
- **Performance Monitoring**: Created Web Vitals tracking system with real-time metrics
- **Request Optimization**: Added size limiting and response optimization middleware
- **Asset Caching**: Proper cache headers for static assets with long-term storage