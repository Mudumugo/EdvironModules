# Main tenant provisioning orchestration
# This manages the lifecycle of tenant VMs

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

# EdVirons global network infrastructure
resource "google_compute_network" "edvirons_platform" {
  name                    = "edvirons-platform-network"
  auto_create_subnetworks = false
  routing_mode           = "REGIONAL"
}

# Global subnet for management and shared services
resource "google_compute_subnetwork" "management" {
  name          = "edvirons-management-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.management_region
  network       = google_compute_network.edvirons_platform.id

  private_ip_google_access = true
}

# Cloud NAT for outbound internet access
resource "google_compute_router" "edvirons_router" {
  name    = "edvirons-platform-router"
  region  = var.management_region
  network = google_compute_network.edvirons_platform.id
}

resource "google_compute_router_nat" "edvirons_nat" {
  name                               = "edvirons-platform-nat"
  router                             = google_compute_router.edvirons_router.name
  region                             = var.management_region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"

  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}

# DNS zone for edvirons.com
resource "google_dns_managed_zone" "edvirons_zone" {
  name        = "edvirons-com-zone"
  dns_name    = "edvirons.com."
  description = "DNS zone for EdVirons platform and tenant subdomains"
}

# Global load balancer for tenant routing
resource "google_compute_global_address" "edvirons_global_ip" {
  name = "edvirons-global-ip"
}

# Central monitoring and alerting
resource "google_monitoring_notification_channel" "edvirons_alerts" {
  display_name = "EdVirons Operations Team"
  type         = "email"
  
  labels = {
    email_address = var.operations_email
  }
}

# Storage bucket for tenant backups
resource "google_storage_bucket" "tenant_backups" {
  name          = "edvirons-tenant-backups"
  location      = "US"
  force_destroy = false

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type = "Delete"
    }
  }

  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }
  }
}

# IAM for tenant backup access
resource "google_storage_bucket_iam_member" "tenant_backup_access" {
  bucket = google_storage_bucket.tenant_backups.name
  role   = "roles/storage.objectAdmin"
  member = "group:edvirons-tenants@edvirons.com"
}

# VM image for tenant instances
resource "google_compute_image" "tenant_base_image" {
  name   = "edvirons-tenant-base-${formatdate("YYYYMMDD-hhmm", timestamp())}"
  family = "edvirons-tenant"

  source_disk = google_compute_disk.base_image_disk.id

  labels = {
    environment = "production"
    managed_by  = "edvirons"
    version     = var.app_version
  }
}

# Base disk for creating tenant images
resource "google_compute_disk" "base_image_disk" {
  name  = "edvirons-tenant-base-disk"
  type  = "pd-ssd"
  zone  = "${var.management_region}-a"
  image = "ubuntu-2004-focal-v20231101"
  size  = 20
}

# Management VM for EdVirons operations
resource "google_compute_instance" "management_vm" {
  name         = "edvirons-management"
  machine_type = "e2-standard-4"
  zone         = "${var.management_region}-a"

  boot_disk {
    initialize_params {
      image = "ubuntu-2004-focal-v20231101"
      size  = 50
      type  = "pd-ssd"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.management.id
    
    access_config {
      nat_ip = google_compute_address.management_ip.address
    }
  }

  metadata = {
    startup-script = file("${path.module}/scripts/management-startup.sh")
  }

  service_account {
    email  = google_service_account.management_sa.email
    scopes = ["cloud-platform"]
  }

  tags = ["edvirons-management", "ssh-allowed"]
}

resource "google_compute_address" "management_ip" {
  name = "edvirons-management-ip"
}

# Service account for management VM
resource "google_service_account" "management_sa" {
  account_id   = "edvirons-management"
  display_name = "EdVirons Management Service Account"
}

# IAM roles for management service account
resource "google_project_iam_member" "management_compute_admin" {
  project = var.project_id
  role    = "roles/compute.admin"
  member  = "serviceAccount:${google_service_account.management_sa.email}"
}

resource "google_project_iam_member" "management_sql_admin" {
  project = var.project_id
  role    = "roles/cloudsql.admin"
  member  = "serviceAccount:${google_service_account.management_sa.email}"
}

resource "google_project_iam_member" "management_dns_admin" {
  project = var.project_id
  role    = "roles/dns.admin"
  member  = "serviceAccount:${google_service_account.management_sa.email}"
}

# Firewall rules
resource "google_compute_firewall" "allow_ssh" {
  name    = "edvirons-allow-ssh"
  network = google_compute_network.edvirons_platform.name

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["0.0.0.0/0"]  # Restrict this in production
  target_tags   = ["ssh-allowed"]
}

resource "google_compute_firewall" "allow_http_https" {
  name    = "edvirons-allow-http-https"
  network = google_compute_network.edvirons_platform.name

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["edvirons-tenant"]
}

resource "google_compute_firewall" "allow_internal" {
  name    = "edvirons-allow-internal"
  network = google_compute_network.edvirons_platform.name

  allow {
    protocol = "tcp"
  }

  allow {
    protocol = "udp"
  }

  source_ranges = ["10.0.0.0/8"]
}

# Variables
variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "management_region" {
  description = "Region for management infrastructure"
  type        = string
  default     = "us-central1"
}

variable "operations_email" {
  description = "Email address for operations alerts"
  type        = string
}

variable "app_version" {
  description = "Application version for labeling"
  type        = string
  default     = "1.0.0"
}

# Outputs
output "management_vm_ip" {
  value = google_compute_instance.management_vm.network_interface[0].access_config[0].nat_ip
}

output "dns_zone_name_servers" {
  value = google_dns_managed_zone.edvirons_zone.name_servers
}

output "global_ip_address" {
  value = google_compute_global_address.edvirons_global_ip.address
}