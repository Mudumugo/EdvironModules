# EdVirons Educational Platform

## Overview
EdVirons is a comprehensive, multi-tenant educational technology platform designed to serve multiple school tenants. It provides centralized management for educational applications, digital libraries, school management tools, and various learning modules. The platform aims to offer a complete ecosystem for schools, enhancing learning and administration through integrated digital solutions.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
EdVirons is built as a global multi-tenant system with robust tenant isolation. Each school operates on isolated infrastructure with dedicated databases and networks, accessed via subdomain-based URLs (`schoolname.edvirons.com`). Infrastructure is provisioned and scaled automatically using Infrastructure as Code.

### Technology Stack
- **Frontend**: React + TypeScript with Vite and Tailwind CSS (using shadcn/ui components)
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with session-based demo accounts
- **File Storage**: MinIO
- **Real-time Features**: WebSocket support

### Key Components
1.  **Authentication & Authorization**: Features a multi-tier role system (EdVirons global roles and tenant-specific roles) with granular, permission-based access and Express sessions for management.
2.  **Apps Hub Management**: Includes a global app catalog managed by EdVirons, allowing schools to enable/disable apps, apply custom branding, and filter applications.
3.  **Educational Modules**: Encompasses school management features (student records, attendance, timetables), a digital library with CBC-aligned resources, a Tutor Hub, Family Controls, comprehensive analytics, and live sessions.
4.  **Content Management**: Provides tools for content creation (for EdVirons team), library resource categorization, media management, and a personal Locker System for users.

### Data Flow
-   **Global to Tenant**: Manages app distribution, content access, licensing, and support requests from the central EdVirons team to individual tenants.
-   **User Interaction**: Covers user authentication, learning path progression (browsing, consumption, tracking), and school operational tasks.

### Deployment Strategy
-   **Build Configurations**: Differentiates between Development, Global (full platform with authoring), and Tenant builds (school-specific, authoring disabled).
-   **Security**: Emphasizes tenant isolation, role-based access, input validation, and secure session management.

## External Dependencies

### Core Infrastructure
-   **Neon Database**: PostgreSQL hosting.
-   **MinIO**: Object storage.
-   **Replit Auth**: Authentication provider.
-   **SendGrid**: Email delivery.
-   **Stripe**: Payment processing.

### Optional Integrations
-   **Notion API**: Documentation and knowledge base.
-   **Analytics Services**: For learning analytics and reporting.
-   **PBX System**: For VoIP communication integration.