# Terraform configuration for isolated tenant VM deployment
# This creates a dedicated VM for each school tenant

variable "tenant_config" {
  description = "Configuration for the tenant"
  type = object({
    tenant_id = string
    subdomain = string
    name = string
    subscription_tier = string
    region = string
    vm_size = string
    storage_size = number
    max_users = number
  })
}

# Tenant-specific VM instance
resource "google_compute_instance" "tenant_vm" {
  name         = "edvirons-tenant-${var.tenant_config.tenant_id}"
  machine_type = var.tenant_config.vm_size
  zone         = "${var.tenant_config.region}-a"

  # Custom labels for organization
  labels = {
    environment = "production"
    tenant_id   = var.tenant_config.tenant_id
    managed_by  = "edvirons"
    tier        = var.tenant_config.subscription_tier
  }

  # Boot disk with tenant-specific image
  boot_disk {
    initialize_params {
      image = "projects/edvirons-platform/global/images/edvirons-tenant-latest"
      size  = var.tenant_config.storage_size
      type  = "pd-ssd"
    }
  }

  # Network configuration with tenant isolation
  network_interface {
    subnetwork = google_compute_subnetwork.tenant_subnet.id
    
    access_config {
      # Ephemeral public IP
    }
  }

  # Tenant-specific metadata
  metadata = {
    tenant-id = var.tenant_config.tenant_id
    subdomain = var.tenant_config.subdomain
    tier      = var.tenant_config.subscription_tier
    max-users = var.tenant_config.max_users
    
    # Startup script to configure tenant environment
    startup-script = templatefile("${path.module}/scripts/tenant-startup.sh", {
      tenant_id = var.tenant_config.tenant_id
      subdomain = var.tenant_config.subdomain
      tier      = var.tenant_config.subscription_tier
    })
  }

  # Service account for tenant VM
  service_account {
    email  = google_service_account.tenant_sa.email
    scopes = ["cloud-platform"]
  }

  tags = ["edvirons-tenant", "tenant-${var.tenant_config.tenant_id}"]
}

# Dedicated subnet for tenant isolation
resource "google_compute_subnetwork" "tenant_subnet" {
  name          = "edvirons-tenant-${var.tenant_config.tenant_id}-subnet"
  ip_cidr_range = "10.${random_integer.subnet_octet.result}.0.0/24"
  region        = var.tenant_config.region
  network       = data.google_compute_network.edvirons_network.id

  # Enable private Google access for API calls
  private_ip_google_access = true
}

# Random subnet allocation to avoid conflicts
resource "random_integer" "subnet_octet" {
  min = 10
  max = 250
}

# Tenant-specific service account
resource "google_service_account" "tenant_sa" {
  account_id   = "edvirons-tenant-${var.tenant_config.tenant_id}"
  display_name = "EdVirons Tenant ${var.tenant_config.name}"
  description  = "Service account for ${var.tenant_config.name} tenant infrastructure"
}

# IAM roles for tenant service account
resource "google_project_iam_member" "tenant_storage_access" {
  project = data.google_project.current.project_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.tenant_sa.email}"
}

resource "google_project_iam_member" "tenant_logging" {
  project = data.google_project.current.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.tenant_sa.email}"
}

# Tenant-specific database instance
resource "google_sql_database_instance" "tenant_db" {
  name             = "edvirons-tenant-${var.tenant_config.tenant_id}-db"
  database_version = "POSTGRES_15"
  region           = var.tenant_config.region
  deletion_protection = true

  settings {
    tier              = lookup(local.db_tiers, var.tenant_config.subscription_tier, "db-f1-micro")
    availability_type = var.tenant_config.subscription_tier == "enterprise" ? "REGIONAL" : "ZONAL"
    
    backup_configuration {
      enabled                        = true
      start_time                    = "03:00"
      point_in_time_recovery_enabled = true
      backup_retention_settings {
        retained_backups = 30
      }
    }

    ip_configuration {
      ipv4_enabled    = false
      private_network = data.google_compute_network.edvirons_network.id
      require_ssl     = true
    }

    database_flags {
      name  = "max_connections"
      value = lookup(local.max_connections, var.tenant_config.subscription_tier, "100")
    }
  }
}

# Tenant database
resource "google_sql_database" "tenant_database" {
  name     = "edvirons_tenant_${var.tenant_config.tenant_id}"
  instance = google_sql_database_instance.tenant_db.name
  charset  = "UTF8"
  collation = "en_US.UTF8"
}

# Tenant database user
resource "google_sql_user" "tenant_db_user" {
  name     = "tenant_${var.tenant_config.tenant_id}"
  instance = google_sql_database_instance.tenant_db.name
  password = random_password.tenant_db_password.result
}

resource "random_password" "tenant_db_password" {
  length  = 32
  special = true
}

# DNS record for tenant subdomain
resource "google_dns_record_set" "tenant_dns" {
  name         = "${var.tenant_config.subdomain}.edvirons.com."
  type         = "A"
  ttl          = 300
  managed_zone = data.google_dns_managed_zone.edvirons_zone.name

  rrdatas = [google_compute_instance.tenant_vm.network_interface[0].access_config[0].nat_ip]
}

# SSL certificate for tenant subdomain
resource "google_compute_ssl_certificate" "tenant_ssl" {
  name = "edvirons-tenant-${var.tenant_config.tenant_id}-ssl"

  managed {
    domains = ["${var.tenant_config.subdomain}.edvirons.com"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Load balancer for tenant traffic
resource "google_compute_global_forwarding_rule" "tenant_https" {
  name       = "edvirons-tenant-${var.tenant_config.tenant_id}-https"
  target     = google_compute_target_https_proxy.tenant_proxy.id
  port_range = "443"
}

resource "google_compute_target_https_proxy" "tenant_proxy" {
  name    = "edvirons-tenant-${var.tenant_config.tenant_id}-proxy"
  url_map = google_compute_url_map.tenant_url_map.id
  ssl_certificates = [google_compute_ssl_certificate.tenant_ssl.id]
}

resource "google_compute_url_map" "tenant_url_map" {
  name            = "edvirons-tenant-${var.tenant_config.tenant_id}-url-map"
  default_service = google_compute_backend_service.tenant_backend.id
}

resource "google_compute_backend_service" "tenant_backend" {
  name        = "edvirons-tenant-${var.tenant_config.tenant_id}-backend"
  protocol    = "HTTP"
  timeout_sec = 30

  backend {
    group = google_compute_instance_group.tenant_group.id
  }

  health_checks = [google_compute_health_check.tenant_health.id]
}

resource "google_compute_instance_group" "tenant_group" {
  name = "edvirons-tenant-${var.tenant_config.tenant_id}-group"
  zone = google_compute_instance.tenant_vm.zone

  instances = [google_compute_instance.tenant_vm.id]

  named_port {
    name = "http"
    port = "80"
  }
}

resource "google_compute_health_check" "tenant_health" {
  name = "edvirons-tenant-${var.tenant_config.tenant_id}-health"

  http_health_check {
    port         = 80
    request_path = "/health"
  }

  check_interval_sec  = 30
  timeout_sec         = 10
  healthy_threshold   = 2
  unhealthy_threshold = 3
}

# Monitoring and alerting for tenant
resource "google_monitoring_alert_policy" "tenant_vm_down" {
  display_name = "EdVirons Tenant ${var.tenant_config.name} - VM Down"
  combiner     = "OR"

  conditions {
    display_name = "VM Instance Down"
    condition_threshold {
      filter          = "resource.type=\"gce_instance\" AND resource.labels.instance_id=\"${google_compute_instance.tenant_vm.instance_id}\""
      comparison      = "COMPARISON_EQUAL"
      threshold_value = 0
      duration        = "300s"

      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }

  notification_channels = [data.google_monitoring_notification_channel.edvirons_alerts.name]
  
  alert_strategy {
    auto_close = "1800s"
  }
}

# Local values for configuration
locals {
  db_tiers = {
    "basic"      = "db-f1-micro"
    "standard"   = "db-g1-small"
    "premium"    = "db-custom-2-4096"
    "enterprise" = "db-custom-4-8192"
  }

  max_connections = {
    "basic"      = "50"
    "standard"   = "100"
    "premium"    = "200"
    "enterprise" = "500"
  }
}

# Data sources
data "google_project" "current" {}

data "google_compute_network" "edvirons_network" {
  name = "edvirons-platform-network"
}

data "google_dns_managed_zone" "edvirons_zone" {
  name = "edvirons-com-zone"
}

data "google_monitoring_notification_channel" "edvirons_alerts" {
  display_name = "EdVirons Operations Team"
}

# Outputs
output "tenant_vm_ip" {
  value = google_compute_instance.tenant_vm.network_interface[0].network_ip
}

output "tenant_public_ip" {
  value = google_compute_instance.tenant_vm.network_interface[0].access_config[0].nat_ip
}

output "tenant_database_connection_name" {
  value = google_sql_database_instance.tenant_db.connection_name
}

output "tenant_url" {
  value = "https://${var.tenant_config.subdomain}.edvirons.com"
}

output "tenant_ssl_certificate" {
  value = google_compute_ssl_certificate.tenant_ssl.certificate_id
}