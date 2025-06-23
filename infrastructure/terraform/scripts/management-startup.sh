#!/bin/bash
# Management VM startup script - sets up EdVirons management infrastructure

set -e

# Log startup process
exec > >(tee /var/log/management-startup.log)
exec 2>&1

echo "Starting EdVirons management VM configuration"

# Update system packages
apt-get update
apt-get upgrade -y

# Install required packages
apt-get install -y \
    curl \
    wget \
    git \
    nginx \
    postgresql-client \
    redis-tools \
    supervisor \
    fail2ban \
    ufw \
    htop \
    jq \
    docker.io \
    docker-compose

# Install Terraform
wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list
apt-get update && apt-get install -y terraform

# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
source ~/.bashrc

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Create EdVirons management user
useradd -m -s /bin/bash edvirons-ops || true
usermod -aG docker edvirons-ops

# Create directories
mkdir -p /opt/edvirons-management
mkdir -p /opt/edvirons-management/terraform
mkdir -p /opt/edvirons-management/scripts
mkdir -p /opt/edvirons-management/logs
mkdir -p /opt/edvirons-management/config
chown -R edvirons-ops:edvirons-ops /opt/edvirons-management

# Configure firewall
ufw --force enable
ufw allow ssh
ufw allow http
ufw allow https

# Configure Nginx for management API
cat > /etc/nginx/sites-available/edvirons-management <<EOF
server {
    listen 80;
    server_name api.edvirons.com;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api_limit:10m rate=5r/s;
    limit_req zone=api_limit burst=10 nodelay;
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }
    
    # Management API
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Internal endpoints (restricted to management network)
    location /internal/ {
        allow 10.0.0.0/8;
        deny all;
        proxy_pass http://localhost:4000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable Nginx site
ln -sf /etc/nginx/sites-available/edvirons-management /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Download EdVirons management application
cd /opt/edvirons-management
wget "https://releases.edvirons.com/management/latest.tar.gz" -O management.tar.gz
tar -xzf management.tar.gz
mv edvirons-management-* app
chown -R edvirons-ops:edvirons-ops app

# Install application dependencies
cd /opt/edvirons-management/app
sudo -u edvirons-ops npm ci --production

# Configure management application environment
cat > /opt/edvirons-management/app/.env <<EOF
NODE_ENV=production
PORT=4000
HOST=0.0.0.0

# Database for management data
DATABASE_URL="postgresql://edvirons_mgmt:$(openssl rand -base64 32)@localhost:5432/edvirons_management"

# Redis for caching and sessions
REDIS_URL="redis://localhost:6379/0"

# Google Cloud configuration
GOOGLE_CLOUD_PROJECT="$(curl -s http://metadata.google.internal/computeMetadata/v1/project/project-id -H 'Metadata-Flavor: Google')"

# Security
JWT_SECRET="$(openssl rand -base64 64)"
API_KEY_SECRET="$(openssl rand -base64 32)"

# Monitoring
LOG_LEVEL=info
ENABLE_METRICS=true

# Tenant provisioning
TERRAFORM_WORKSPACE_DIR="/opt/edvirons-management/terraform/workspaces"
TENANT_IMAGE_FAMILY="edvirons-tenant"

# Notification settings
SLACK_WEBHOOK_URL=""
OPERATIONS_EMAIL="ops@edvirons.com"
EOF

# Install PostgreSQL for management data
apt-get install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql

# Configure PostgreSQL
sudo -u postgres createdb edvirons_management
sudo -u postgres psql -c "CREATE USER edvirons_mgmt WITH PASSWORD '$(openssl rand -base64 32)';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE edvirons_management TO edvirons_mgmt;"

# Install Redis
apt-get install -y redis-server
systemctl enable redis-server
systemctl start redis-server

# Configure management application service
cat > /etc/systemd/system/edvirons-management.service <<EOF
[Unit]
Description=EdVirons Management API
After=network.target postgresql.service redis.service
Wants=postgresql.service redis.service

[Service]
Type=simple
User=edvirons-ops
WorkingDirectory=/opt/edvirons-management/app
Environment=NODE_ENV=production
EnvironmentFile=/opt/edvirons-management/app/.env
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=edvirons-management

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/edvirons-management

[Install]
WantedBy=multi-user.target
EOF

# Create tenant provisioning script
cat > /opt/edvirons-management/scripts/provision-tenant.sh <<'EOF'
#!/bin/bash
# Tenant provisioning script

TENANT_ID="$1"
SUBDOMAIN="$2"
TENANT_NAME="$3"
SUBSCRIPTION_TIER="$4"
REGION="$5"

if [ -z "$TENANT_ID" ] || [ -z "$SUBDOMAIN" ] || [ -z "$TENANT_NAME" ] || [ -z "$SUBSCRIPTION_TIER" ]; then
    echo "Usage: $0 <tenant_id> <subdomain> <tenant_name> <subscription_tier> [region]"
    exit 1
fi

REGION="${REGION:-us-central1}"
WORKSPACE_DIR="/opt/edvirons-management/terraform/workspaces/$TENANT_ID"

echo "Provisioning tenant: $TENANT_NAME ($TENANT_ID)"
echo "Subdomain: $SUBDOMAIN.edvirons.com"
echo "Tier: $SUBSCRIPTION_TIER"
echo "Region: $REGION"

# Create Terraform workspace
mkdir -p "$WORKSPACE_DIR"
cd "$WORKSPACE_DIR"

# Create tenant-specific Terraform configuration
cat > main.tf <<EOT
module "tenant" {
  source = "../../modules/tenant-vm"
  
  tenant_config = {
    tenant_id         = "$TENANT_ID"
    subdomain         = "$SUBDOMAIN"
    name              = "$TENANT_NAME"
    subscription_tier = "$SUBSCRIPTION_TIER"
    region            = "$REGION"
    vm_size           = var.vm_sizes["$SUBSCRIPTION_TIER"]
    storage_size      = var.storage_sizes["$SUBSCRIPTION_TIER"]
    max_users         = var.max_users["$SUBSCRIPTION_TIER"]
  }
}

variable "vm_sizes" {
  default = {
    basic      = "e2-small"
    standard   = "e2-medium"
    premium    = "e2-standard-2"
    enterprise = "e2-standard-4"
  }
}

variable "storage_sizes" {
  default = {
    basic      = 20
    standard   = 50
    premium    = 100
    enterprise = 200
  }
}

variable "max_users" {
  default = {
    basic      = 50
    standard   = 200
    premium    = 500
    enterprise = 2000
  }
}

output "tenant_url" {
  value = module.tenant.tenant_url
}

output "tenant_vm_ip" {
  value = module.tenant.tenant_vm_ip
}
EOT

# Initialize and apply Terraform
terraform init
terraform plan -out=tfplan
terraform apply tfplan

echo "Tenant provisioning completed for $TENANT_ID"
EOF

chmod +x /opt/edvirons-management/scripts/provision-tenant.sh

# Create tenant deprovisioning script
cat > /opt/edvirons-management/scripts/deprovision-tenant.sh <<'EOF'
#!/bin/bash
# Tenant deprovisioning script

TENANT_ID="$1"

if [ -z "$TENANT_ID" ]; then
    echo "Usage: $0 <tenant_id>"
    exit 1
fi

WORKSPACE_DIR="/opt/edvirons-management/terraform/workspaces/$TENANT_ID"

echo "Deprovisioning tenant: $TENANT_ID"

if [ ! -d "$WORKSPACE_DIR" ]; then
    echo "Error: Tenant workspace not found: $WORKSPACE_DIR"
    exit 1
fi

cd "$WORKSPACE_DIR"

# Backup tenant data before destroying
echo "Creating backup before deprovisioning..."
mkdir -p "/opt/edvirons-management/backups/$TENANT_ID"
terraform output -json > "/opt/edvirons-management/backups/$TENANT_ID/terraform-output.json"

# Destroy infrastructure
terraform destroy -auto-approve

echo "Tenant deprovisioning completed for $TENANT_ID"
EOF

chmod +x /opt/edvirons-management/scripts/deprovision-tenant.sh

# Configure log rotation
cat > /etc/logrotate.d/edvirons-management <<EOF
/opt/edvirons-management/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 edvirons-ops edvirons-ops
    postrotate
        systemctl reload edvirons-management || true
    endscript
}
EOF

# Install monitoring agent
wget https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
bash add-google-cloud-ops-agent-repo.sh --also-install

# Configure ops agent
cat > /etc/google-cloud-ops-agent/config.yaml <<EOF
logging:
  receivers:
    management_app:
      type: files
      include_paths:
        - /opt/edvirons-management/logs/*.log
    nginx_access:
      type: nginx_access
    nginx_error:
      type: nginx_error
  
  service:
    pipelines:
      default_pipeline:
        receivers: [management_app, nginx_access, nginx_error]

metrics:
  receivers:
    hostmetrics:
      type: hostmetrics
      collection_interval: 60s
  
  service:
    pipelines:
      default_pipeline:
        receivers: [hostmetrics]
EOF

# Enable and start services
systemctl daemon-reload
systemctl enable edvirons-management
systemctl enable nginx
systemctl enable google-cloud-ops-agent

# Start services
systemctl start edvirons-management
systemctl restart nginx
systemctl restart google-cloud-ops-agent

echo "Management VM configuration completed successfully"
echo "Management API available at: http://$(curl -s http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-config/0/external-ip -H 'Metadata-Flavor: Google')"
EOF