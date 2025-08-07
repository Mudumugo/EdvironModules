# EdVirons Educational Platform

## Overview
EdVirons is a comprehensive multi-tenant educational technology platform designed to serve multiple school tenants. It provides educational applications, digital libraries, and school management tools, with centralized management by the EdVirons team. The platform aims to offer a robust and scalable solution for modern educational needs.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Multi-Tenant Architecture
- **Global Management**: EdVirons team centrally manages app catalog, licensing, and tenant provisioning.
- **Tenant Isolation**: Each school operates on isolated infrastructure with dedicated databases and networks.
- **Access**: Schools access via `schoolname.edvirons.com` subdomains.
- **Infrastructure as Code**: Automated VM provisioning and scaling.

### Technology Stack
- **Frontend**: React + TypeScript with Vite.
- **Backend**: Express.js with TypeScript.
- **Database**: PostgreSQL with Drizzle ORM.
- **Authentication**: Replit Auth with session-based accounts.
- **UI Framework**: Tailwind CSS with shadcn/ui components.
- **File Storage**: MinIO.
- **Real-time**: WebSocket support.

### Key Components & Features
- **Authentication & Authorization**: Multi-tier role system (global and tenant-specific) with granular permissions.
- **Apps Hub Management**: Centralized global app catalog with tenant-specific enablement and custom branding.
- **Educational Modules**: Includes School Management (records, attendance), Digital Library (CBC-aligned resources), Tutor Hub, Family Controls, Analytics, and Live Sessions.
- **Content Management**: Tools for content creation (disabled in tenant builds), library categorization, media management, and personal locker system.
- **Data Flow**: Defined processes for app management, content distribution, licensing, and support from global to tenant level, and user interaction within the platform.
- **UI/UX Decisions**: Comprehensive landing page redesign with modern SaaS architecture, including fixed navigation, hero section, features showcase, pricing, and a professional footer. Implemented HSL color variables and semantic color tokens for consistent branding. Fully responsive design for mobile and webview compatibility.
- **Technical Implementations**: Optimized authentication system for faster login and session performance, including demo accounts. Developed robust subject and strand management for digital assessment books with CRUD operations and API integration. Implemented comprehensive report card generation adhering to CBC standards with print and PDF export. Addressed critical validation errors in assessment entry creation. Integrated the assessment book with the EdVirons portal for user and timetable management, ensuring tenant isolation.
- **Performance Optimizations**: Addressed slow requests through database connection pooling, multi-level caching, gzip compression, rate limiting, and query optimization.
- **Browser Compatibility**: Addressed React hook conflicts in Replit webview, recommending external browser for optimal development and full functionality.

## External Dependencies

### Core Infrastructure
- **Neon Database**: PostgreSQL hosting.
- **MinIO**: Object storage.
- **Replit Auth**: Authentication provider.
- **SendGrid**: Email delivery.
- **Stripe**: Payment processing.

### Optional Integrations
- **Notion API**: Documentation and knowledge base.
- **Analytics Services**: Learning analytics and reporting.
- **PBX System**: VoIP integration.