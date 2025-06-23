#!/bin/bash
# Tenant VM startup script - configures tenant-specific environment

set -e

# Configuration from metadata
TENANT_ID="${tenant_id}"
SUBDOMAIN="${subdomain}"
TIER="${tier}"

# Log startup process
exec > >(tee /var/log/tenant-startup.log)
exec 2>&1

echo "Starting EdVirons tenant configuration for: $TENANT_ID"
echo "Subdomain: $SUBDOMAIN"
echo "Tier: $TIER"

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
    jq

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker edvirons

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create EdVirons user and directories
useradd -m -s /bin/bash edvirons || true
mkdir -p /opt/edvirons
mkdir -p /opt/edvirons/logs
mkdir -p /opt/edvirons/data
mkdir -p /opt/edvirons/backups
chown -R edvirons:edvirons /opt/edvirons

# Configure firewall
ufw --force enable
ufw allow ssh
ufw allow http
ufw allow https
ufw allow from 10.0.0.0/8 to any port 5432  # PostgreSQL from private network

# Configure Nginx
cat > /etc/nginx/sites-available/edvirons <<EOF
server {
    listen 80;
    server_name $SUBDOMAIN.edvirons.com;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=tenant_limit:10m rate=10r/s;
    limit_req zone=tenant_limit burst=20 nodelay;
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }
    
    # Proxy to application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static assets
    location /static/ {
        root /opt/edvirons/app;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable Nginx site
ln -sf /etc/nginx/sites-available/edvirons /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Download and install EdVirons application
cd /opt/edvirons
wget "https://releases.edvirons.com/tenant/latest.tar.gz" -O app.tar.gz
tar -xzf app.tar.gz
mv edvirons-tenant-* app
chown -R edvirons:edvirons app

# Install application dependencies
cd /opt/edvirons/app
sudo -u edvirons npm ci --production

# Configure tenant-specific environment
cat > /opt/edvirons/app/.env <<EOF
NODE_ENV=production
TENANT_ID=$TENANT_ID
SUBDOMAIN=$SUBDOMAIN
SUBSCRIPTION_TIER=$TIER

# Database configuration (will be updated by configuration script)
DATABASE_URL="postgresql://placeholder"

# Redis configuration
REDIS_URL="redis://localhost:6379"

# Application configuration
PORT=3000
HOST=0.0.0.0

# EdVirons global API endpoints
EDVIRONS_API_URL="https://api.edvirons.com"
EDVIRONS_CDN_URL="https://cdn.edvirons.com"

# Security
SESSION_SECRET="\$(openssl rand -base64 32)"
JWT_SECRET="\$(openssl rand -base64 32)"

# Monitoring
LOG_LEVEL=info
ENABLE_METRICS=true

# Features based on tier
ENABLE_ADVANCED_ANALYTICS=\$([ "$TIER" = "premium" ] || [ "$TIER" = "enterprise" ] && echo "true" || echo "false")
ENABLE_API_ACCESS=\$([ "$TIER" = "enterprise" ] && echo "true" || echo "false")
MAX_STORAGE_GB=\$(case "$TIER" in basic) echo "10";; standard) echo "50";; premium) echo "200";; enterprise) echo "1000";; esac)
EOF

# Install Redis for session storage
apt-get install -y redis-server
systemctl enable redis-server
systemctl start redis-server

# Configure Redis
cat > /etc/redis/redis.conf <<EOF
bind 127.0.0.1
port 6379
timeout 0
keepalive 300
daemonize yes
supervised systemd
pidfile /var/run/redis/redis-server.pid
loglevel notice
logfile /var/log/redis/redis-server.log
databases 16
save 900 1
save 300 10
save 60 10000
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
dir /var/lib/redis
maxmemory 256mb
maxmemory-policy allkeys-lru
EOF

systemctl restart redis-server

# Configure application service
cat > /etc/systemd/system/edvirons-tenant.service <<EOF
[Unit]
Description=EdVirons Tenant Application
After=network.target postgresql.service redis.service
Wants=postgresql.service redis.service

[Service]
Type=simple
User=edvirons
WorkingDirectory=/opt/edvirons/app
Environment=NODE_ENV=production
EnvironmentFile=/opt/edvirons/app/.env
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=edvirons-tenant

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/edvirons/data /opt/edvirons/logs

[Install]
WantedBy=multi-user.target
EOF

# Configure log rotation
cat > /etc/logrotate.d/edvirons <<EOF
/opt/edvirons/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 edvirons edvirons
    postrotate
        systemctl reload edvirons-tenant || true
    endscript
}
EOF

# Configure monitoring agent
wget https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
bash add-google-cloud-ops-agent-repo.sh --also-install

# Configure ops agent for tenant monitoring
cat > /etc/google-cloud-ops-agent/config.yaml <<EOF
logging:
  receivers:
    edvirons_app:
      type: files
      include_paths:
        - /opt/edvirons/logs/*.log
      exclude_paths:
        - /opt/edvirons/logs/*.gz
    nginx_access:
      type: nginx_access
    nginx_error:
      type: nginx_error
  
  service:
    pipelines:
      default_pipeline:
        receivers: [edvirons_app, nginx_access, nginx_error]

metrics:
  receivers:
    hostmetrics:
      type: hostmetrics
      collection_interval: 60s
    nginx:
      type: nginx
      stub_status_url: http://localhost/nginx_status
  
  service:
    pipelines:
      default_pipeline:
        receivers: [hostmetrics, nginx]
EOF

# Configure Nginx status endpoint
cat >> /etc/nginx/sites-available/edvirons <<EOF

# Nginx status for monitoring
server {
    listen 127.0.0.1:80;
    server_name localhost;
    
    location /nginx_status {
        stub_status on;
        access_log off;
        allow 127.0.0.1;
        deny all;
    }
}
EOF

# Configure backup script
cat > /opt/edvirons/backup.sh <<'EOF'
#!/bin/bash
# Automated backup script for tenant data

TENANT_ID=$1
BACKUP_DIR="/opt/edvirons/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR/$DATE"

# Backup database (connection details will be set by configuration script)
if [ -n "$DATABASE_URL" ]; then
    pg_dump "$DATABASE_URL" > "$BACKUP_DIR/$DATE/database.sql"
fi

# Backup application data
tar -czf "$BACKUP_DIR/$DATE/app_data.tar.gz" -C /opt/edvirons/data .

# Backup configuration
cp /opt/edvirons/app/.env "$BACKUP_DIR/$DATE/config.env"

# Upload to Google Cloud Storage
gsutil cp -r "$BACKUP_DIR/$DATE" "gs://edvirons-tenant-backups/$TENANT_ID/"

# Cleanup old local backups (keep last 7 days)
find "$BACKUP_DIR" -type d -mtime +7 -exec rm -rf {} +

echo "Backup completed: $DATE"
EOF

chmod +x /opt/edvirons/backup.sh

# Configure cron for automated backups
echo "0 2 * * * edvirons /opt/edvirons/backup.sh $TENANT_ID >> /opt/edvirons/logs/backup.log 2>&1" | crontab -u edvirons -

# Enable and start services
systemctl daemon-reload
systemctl enable edvirons-tenant
systemctl enable nginx
systemctl enable google-cloud-ops-agent

# Restart Nginx with new configuration
systemctl restart nginx

# Start Google Cloud Ops Agent
systemctl restart google-cloud-ops-agent

# Register tenant with EdVirons management API
curl -X POST "https://api.edvirons.com/internal/tenant-registration" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer \$EDVIRONS_INTERNAL_TOKEN" \
    -d "{
        \"tenant_id\": \"$TENANT_ID\",
        \"subdomain\": \"$SUBDOMAIN\",
        \"tier\": \"$TIER\",
        \"vm_ip\": \"\$(curl -s http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/ip -H 'Metadata-Flavor: Google')\",
        \"status\": \"provisioning\"
    }"

echo "Tenant startup configuration completed successfully"
echo "Tenant VM ready for final configuration and application deployment"

# Signal completion
touch /opt/edvirons/startup-complete
EOF