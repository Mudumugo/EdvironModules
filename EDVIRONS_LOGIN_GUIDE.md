# EdVirons Team Login Guide

## How to Access EdVirons Global Management

To access the EdVirons global management features for apps, licensing, support, and tenant management, you need to login with an EdVirons team account.

### Demo Accounts Available

The system recognizes the following demo accounts for testing EdVirons team functionality:

#### EdVirons Admin (Full Access)
- **Email**: `demo.admin@edvirons.com`
- **Access**: All global management features
- **Features**: Apps Hub Admin, Global Support, Global Licensing, Tenant Management

#### EdVirons Content Manager (Apps & Content)
- **Email**: `demo.content@edvirons.com` 
- **Access**: Apps Hub management and content curation
- **Features**: Apps Hub Admin, Global Analytics

#### EdVirons Support (Customer Support)
- **Email**: `demo.support@edvirons.com`
- **Access**: Support ticket management
- **Features**: Global Support, Tenant Issues

### Login Process

1. **Access the Platform**: Go to your EdVirons application URL
2. **Click Login**: Use the Replit Auth login button
3. **Use Demo Email**: Enter one of the demo emails above
4. **Complete Authentication**: Follow the Replit Auth flow
5. **Access Global Features**: You'll see EdVirons-specific navigation options

### EdVirons Team Features Available

Once logged in with an EdVirons team account, you'll have access to:

#### Apps Hub Management (`/apps-hub-admin`)
- **Global App Catalog**: Manage all educational applications
- **Tenant App Access**: Control which apps each school can use
- **App Categories**: Organize and categorize applications
- **Usage Analytics**: Monitor app usage across all tenants
- **Bulk Operations**: Enable/disable apps for multiple schools

#### Global Support (`/global-support`)
- **Support Tickets**: Handle issues from all school tenants
- **Ticket Routing**: Assign and prioritize support requests
- **Knowledge Base**: Manage self-service documentation
- **Response Analytics**: Track support team performance

#### Global Licensing (`/global-licensing`)
- **License Inventory**: Manage enterprise software licenses
- **Tenant Allocations**: Distribute license seats to schools
- **Cost Tracking**: Monitor licensing costs and utilization
- **Renewal Management**: Track license expiration dates

#### Tenant Management (`/tenant-management`)
- **School Overview**: Monitor all school tenants
- **Infrastructure Provisioning**: Deploy new tenant VMs
- **Resource Monitoring**: Track VM performance and usage
- **Auto-Scaling**: Configure automatic resource scaling

### Role-Based Access Control

The system enforces role-based permissions:

- **edvirons_admin**: Full access to all features
- **edvirons_content_manager**: Apps Hub and content management
- **edvirons_support**: Support ticket management
- **edvirons_license_manager**: License management only
- **edvirons_developer**: Technical features and debugging

### Navigation

EdVirons team members will see additional menu items in the sidebar:

- **Apps Hub Management** - Global app administration
- **Global Support** - Cross-tenant support management  
- **Global Licensing** - License and cost management
- **Tenant Management** - School infrastructure management

### API Access

EdVirons team accounts also have access to global management APIs:

```bash
# Global apps management
GET /api/global-apps-hub
POST /api/global-apps-hub
PUT /api/global-apps-hub/:id

# Tenant app access control
POST /api/tenant-app-access
POST /api/tenant-app-access/bulk

# Global analytics
GET /api/global-analytics
GET /api/global-popular-apps
```

### Email Pattern Recognition

The system automatically assigns EdVirons team roles based on email patterns:

- `*@edvirons.com` - EdVirons team member
- `admin@edvirons.com` - Admin privileges
- `support@edvirons.com` - Support role
- `content@edvirons.com` - Content manager
- `license@edvirons.com` - License manager

This ensures proper role assignment for all EdVirons team members.