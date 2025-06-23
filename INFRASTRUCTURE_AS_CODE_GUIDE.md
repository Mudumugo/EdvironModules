# EdVirons Infrastructure as Code (IaC) Multi-Tenant Deployment

## Overview

EdVirons uses Infrastructure as Code to provision isolated VM infrastructure for each school tenant while maintaining centralized management by the EdVirons team. This approach provides:

- **Complete Tenant Isolation**: Each school gets dedicated VM, database, and network resources
- **Scalable Operations**: Automated provisioning and deprovisioning of tenant infrastructure
- **Centralized Management**: EdVirons team controls all infrastructure through code
- **Cost Optimization**: Right-sized infrastructure based on subscription tiers
- **Security**: Network isolation and tenant-specific security configurations

## Architecture Components

### 1. Global Infrastructure (EdVirons Managed)
```
EdVirons Platform Network
├── Management VM (EdVirons Operations)
│   ├── Terraform orchestration
│   ├── Management API
│   ├── Monitoring dashboard
│   └── Tenant provisioning scripts
├── Global Load Balancer
├── DNS Management (edvirons.com)
├── Central Monitoring
└── Backup Storage
```

### 2. Per-Tenant Infrastructure (Auto-Provisioned)
```
Tenant: school1.edvirons.com
├── Dedicated VM Instance
│   ├── EdVirons application
│   ├── Nginx reverse proxy
│   ├── Redis session store
│   └── Monitoring agent
├── Dedicated PostgreSQL Database
├── Isolated Network Subnet
├── SSL Certificate
├── Load Balancer Backend
└── Backup Storage
```

## Subscription Tier Configurations

### Basic Tier
- **VM**: e2-small (1 vCPU, 2GB RAM)
- **Storage**: 20GB SSD
- **Database**: db-f1-micro
- **Max Users**: 50
- **Backup**: Daily, 30-day retention

### Standard Tier
- **VM**: e2-medium (1 vCPU, 4GB RAM)
- **Storage**: 50GB SSD
- **Database**: db-g1-small
- **Max Users**: 200
- **Backup**: Daily, 30-day retention

### Premium Tier
- **VM**: e2-standard-2 (2 vCPU, 8GB RAM)
- **Storage**: 100GB SSD
- **Database**: db-custom-2-4096
- **Max Users**: 500
- **Backup**: Daily, 90-day retention
- **Features**: Advanced analytics enabled

### Enterprise Tier
- **VM**: e2-standard-4 (4 vCPU, 16GB RAM)
- **Storage**: 200GB SSD
- **Database**: db-custom-4-8192 (Regional HA)
- **Max Users**: 2000
- **Backup**: Daily, 365-day retention
- **Features**: All features + API access

## Tenant Provisioning Workflow

### 1. Tenant Request
```bash
# EdVirons team triggers provisioning
./provision-tenant.sh \
  "school001" \
  "greenwood-high" \
  "Greenwood High School" \
  "premium" \
  "us-central1"
```

### 2. Infrastructure Creation (Automated)
1. **Terraform Workspace**: Create isolated Terraform state
2. **VM Provisioning**: Deploy tenant-specific virtual machine
3. **Database Setup**: Create dedicated PostgreSQL instance
4. **Network Configuration**: Isolated subnet and firewall rules
5. **DNS Registration**: school001.edvirons.com subdomain
6. **SSL Certificate**: Automatic HTTPS certificate
7. **Load Balancer**: Backend registration
8. **Monitoring**: Tenant-specific monitoring setup

### 3. Application Deployment (Automated)
1. **Base Image**: Use EdVirons tenant image
2. **Configuration**: Tenant-specific environment variables
3. **Database Migration**: Initialize schema and seed data
4. **Service Setup**: Configure systemd services
5. **Health Checks**: Verify application startup
6. **Backup Configuration**: Automated backup scheduling

### 4. Tenant Registration (Automated)
1. **Management API**: Register tenant in central system
2. **App Access**: Configure default app access based on tier
3. **License Allocation**: Assign licenses based on subscription
4. **Monitoring**: Enable tenant-specific alerts
5. **Ready State**: Mark tenant as ready for use

## Management Operations

### EdVirons Management VM
The central management VM provides:

- **Terraform Orchestration**: Automated infrastructure management
- **Management API**: RESTful API for tenant operations
- **Monitoring Dashboard**: Cross-tenant monitoring and alerts
- **Backup Management**: Centralized backup coordination
- **Security Management**: Certificate and access control

### Management API Endpoints

```http
# Tenant lifecycle management
POST /api/tenants                    # Create new tenant
GET /api/tenants                     # List all tenants
GET /api/tenants/{id}                # Get tenant details
PUT /api/tenants/{id}                # Update tenant configuration
DELETE /api/tenants/{id}             # Deprovision tenant

# Infrastructure operations
POST /api/tenants/{id}/scale          # Scale tenant resources
POST /api/tenants/{id}/backup         # Trigger backup
POST /api/tenants/{id}/restore        # Restore from backup
GET /api/tenants/{id}/metrics         # Get tenant metrics

# Global operations
GET /api/infrastructure/status        # Overall platform status
GET /api/infrastructure/costs         # Cost analysis
GET /api/infrastructure/capacity      # Capacity planning
```

## Security and Isolation

### Network Isolation
- **Dedicated Subnets**: Each tenant gets isolated network segment
- **Firewall Rules**: Tenant-specific traffic filtering
- **Private IP Ranges**: Non-overlapping IP address allocation
- **VPN Access**: Secure access for EdVirons operations

### Data Isolation
- **Dedicated Databases**: Separate PostgreSQL instance per tenant
- **Encrypted Storage**: All data encrypted at rest and in transit
- **Backup Isolation**: Tenant backups stored separately
- **Access Controls**: Strict IAM policies per tenant

### Application Isolation
- **Process Isolation**: Dedicated VM per tenant
- **Resource Limits**: CPU, memory, and storage quotas
- **Monitoring Isolation**: Separate monitoring namespaces
- **Log Isolation**: Tenant-specific log aggregation

## Monitoring and Operations

### Tenant Health Monitoring
```yaml
# Example monitoring configuration
monitoring:
  health_checks:
    - endpoint: "/health"
      interval: 30s
      timeout: 10s
    - database_connection: true
    - redis_connection: true
  
  alerts:
    - vm_down: "Tenant VM is unreachable"
    - high_cpu: "CPU usage > 80% for 5 minutes"
    - high_memory: "Memory usage > 85% for 5 minutes"
    - database_errors: "Database connection failures"
    - application_errors: "Application error rate > 5%"
  
  metrics:
    - active_users
    - response_time
    - error_rate
    - resource_utilization
```

### Automated Operations
- **Auto-scaling**: Vertical scaling based on usage patterns
- **Auto-healing**: Automatic VM restart on health check failures
- **Backup Automation**: Daily backups with retention policies
- **Update Management**: Rolling updates across tenant fleet
- **Cost Optimization**: Right-sizing recommendations

## Disaster Recovery

### Backup Strategy
- **Database Backups**: Point-in-time recovery capability
- **Application Backups**: Complete application state and configuration
- **Infrastructure Backups**: Terraform state and configuration
- **Cross-Region Replication**: Geographic disaster recovery

### Recovery Procedures
1. **Tenant Recovery**: Restore individual tenant from backup
2. **Region Failover**: Move tenant to different region
3. **Platform Recovery**: Restore entire EdVirons platform
4. **Data Recovery**: Point-in-time data restoration

## Cost Management

### Resource Optimization
- **Tier-based Sizing**: Right-sized resources per subscription
- **Usage Monitoring**: Track and optimize resource consumption
- **Idle Detection**: Identify and optimize underutilized resources
- **Scheduled Scaling**: Scale down during off-hours

### Cost Allocation
- **Per-Tenant Tracking**: Detailed cost attribution
- **Billing Integration**: Automated cost allocation to customers
- **Budget Alerts**: Proactive cost monitoring
- **Optimization Reports**: Regular cost optimization recommendations

## Benefits of IaC Multi-Tenant Approach

### For EdVirons:
1. **Operational Efficiency**: Automated tenant lifecycle management
2. **Scalability**: Easy addition of new tenants
3. **Consistency**: Standardized tenant deployments
4. **Security**: Strong tenant isolation
5. **Cost Control**: Predictable infrastructure costs

### For School Tenants:
1. **Performance**: Dedicated resources ensure consistent performance
2. **Security**: Complete data isolation from other schools
3. **Customization**: Tenant-specific configurations possible
4. **Reliability**: Isolated failures don't affect other tenants
5. **Compliance**: Easier to meet data residency requirements

This Infrastructure as Code approach enables EdVirons to efficiently scale their platform while providing schools with the isolation, performance, and security they require for their educational technology needs.