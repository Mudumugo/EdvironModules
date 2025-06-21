// Legacy MDM schema - use modular schemas from mdm/index.ts
export * from './mdm/index';
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id),
  institutionId: varchar("institution_id").references(() => institutions.id),
  deviceName: varchar("device_name").notNull(),
  deviceType: varchar("device_type").notNull(), // tablet, laptop, smartphone, desktop
  platform: varchar("platform").notNull(), // ios, android, windows, macos, linux
  osVersion: varchar("os_version"),
  model: varchar("model"),
  serialNumber: varchar("serial_number"),
  macAddress: varchar("mac_address"),
  imei: varchar("imei"),
  udid: varchar("udid"),
  status: varchar("status").notNull().default("active"), // active, inactive, lost, stolen, wiped
  enrollmentDate: timestamp("enrollment_date").defaultNow(),
  lastSeen: timestamp("last_seen"),
  location: jsonb("location").default({}), // { lat, lng, accuracy, timestamp }
  batteryLevel: integer("battery_level"),
  storageUsed: decimal("storage_used"),
  storageTotal: decimal("storage_total"),
  isSupervised: boolean("is_supervised").default(false),
  isCompliant: boolean("is_compliant").default(true),
  complianceIssues: jsonb("compliance_issues").default([]),
  installedApps: jsonb("installed_apps").default([]),
  restrictedApps: jsonb("restricted_apps").default([]),
  allowedApps: jsonb("allowed_apps").default([]),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Device policies
export const devicePolicies = pgTable("device_policies", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  institutionId: varchar("institution_id").references(() => institutions.id).notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  targetType: varchar("target_type").notNull(), // user, group, device_type, all
  targetIds: jsonb("target_ids").default([]),
  policyType: varchar("policy_type").notNull(), // app_restriction, content_filter, screen_time, location
  rules: jsonb("rules").notNull(),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(1),
  effectiveFrom: timestamp("effective_from"),
  effectiveTo: timestamp("effective_to"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Device compliance violations
export const complianceViolations = pgTable("compliance_violations", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  policyId: integer("policy_id").references(() => devicePolicies.id),
  violationType: varchar("violation_type").notNull(), // unauthorized_app, location_violation, usage_exceeded
  severity: varchar("severity").notNull(), // low, medium, high, critical
  description: text("description"),
  detectedAt: timestamp("detected_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  status: varchar("status").default("open"), // open, acknowledged, resolved, false_positive
  resolvedBy: varchar("resolved_by").references(() => users.id),
  actionTaken: text("action_taken"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Device activities/audit log
export const deviceActivities = pgTable("device_activities", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  activityType: varchar("activity_type").notNull(), // app_usage, location_change, policy_violation, login, logout
  appName: varchar("app_name"),
  category: varchar("category"),
  duration: integer("duration"), // in minutes
  dataUsed: decimal("data_used"), // in MB
  location: jsonb("location").default({}),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata").default({}),
});

// Screen time tracking
export const screenTimeRecords = pgTable("screen_time_records", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  date: timestamp("date").notNull(),
  totalScreenTime: integer("total_screen_time"), // in minutes
  educationalTime: integer("educational_time"), // in minutes
  entertainmentTime: integer("entertainment_time"), // in minutes
  socialTime: integer("social_time"), // in minutes
  appBreakdown: jsonb("app_breakdown").default({}),
  categoryBreakdown: jsonb("category_breakdown").default({}),
  peakUsageHours: jsonb("peak_usage_hours").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content filtering logs
export const contentFilterLogs = pgTable("content_filter_logs", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  url: text("url"),
  domain: varchar("domain"),
  category: varchar("category"),
  action: varchar("action").notNull(), // allowed, blocked, warned
  reason: text("reason"),
  riskScore: integer("risk_score"),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata").default({}),
});

// Remote actions log
export const remoteActions = pgTable("remote_actions", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  actionType: varchar("action_type").notNull(), // lock, wipe, locate, install_app, remove_app, push_policy
  initiatedBy: varchar("initiated_by").references(() => users.id).notNull(),
  status: varchar("status").default("pending"), // pending, success, failed, timeout
  parameters: jsonb("parameters").default({}),
  result: text("result"),
  error: text("error"),
  initiatedAt: timestamp("initiated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Software licenses and compliance tracking
export const softwareLicenses = pgTable("software_licenses", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  institutionId: varchar("institution_id").references(() => institutions.id).notNull(),
  softwareName: varchar("software_name").notNull(),
  vendor: varchar("vendor").notNull(),
  licenseType: varchar("license_type").notNull(), // perpetual, subscription, volume, educational
  licenseKey: text("license_key"),
  totalSeats: integer("total_seats").notNull(),
  usedSeats: integer("used_seats").default(0),
  availableSeats: integer("available_seats"),
  expirationDate: timestamp("expiration_date"),
  purchaseDate: timestamp("purchase_date"),
  cost: decimal("cost"),
  isActive: boolean("is_active").default(true),
  complianceStatus: varchar("compliance_status").default("compliant"), // compliant, over_licensed, under_licensed, expired
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Software installations on devices
export const softwareInstallations = pgTable("software_installations", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  licenseId: integer("license_id").references(() => softwareLicenses.id),
  softwareName: varchar("software_name").notNull(),
  version: varchar("version"),
  installDate: timestamp("install_date").defaultNow(),
  lastUsed: timestamp("last_used"),
  usageMinutes: integer("usage_minutes").default(0),
  isLicensed: boolean("is_licensed").default(false),
  complianceStatus: varchar("compliance_status").default("unknown"), // licensed, unlicensed, trial, expired
  detectedAt: timestamp("detected_at").defaultNow(),
  metadata: jsonb("metadata").default({}),
});

// License compliance violations
export const licenseViolations = pgTable("license_violations", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  licenseId: integer("license_id").references(() => softwareLicenses.id),
  deviceId: varchar("device_id").references(() => devices.id),
  violationType: varchar("violation_type").notNull(), // seat_exceeded, expired_license, unauthorized_software, version_mismatch
  severity: varchar("severity").notNull(), // low, medium, high, critical
  description: text("description"),
  detectedAt: timestamp("detected_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  status: varchar("status").default("open"), // open, acknowledged, resolved, false_positive
  resolvedBy: varchar("resolved_by").references(() => users.id),
  actionTaken: text("action_taken"),
  estimatedCost: decimal("estimated_cost"), // Potential cost of non-compliance
  metadata: jsonb("metadata").default({}),
});

// License usage analytics
export const licenseUsageTracking = pgTable("license_usage_tracking", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  licenseId: integer("license_id").references(() => softwareLicenses.id).notNull(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  sessionStart: timestamp("session_start").notNull(),
  sessionEnd: timestamp("session_end"),
  duration: integer("duration"), // in minutes
  features: jsonb("features").default([]), // Features used during session
  date: timestamp("date").defaultNow(),
});

// Software asset requests and approvals
export const softwareRequests = pgTable("software_requests", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  requestedBy: varchar("requested_by").references(() => users.id).notNull(),
  softwareName: varchar("software_name").notNull(),
  vendor: varchar("vendor"),
  justification: text("justification"),
  requestType: varchar("request_type").notNull(), // new_license, additional_seats, upgrade, renewal
  estimatedCost: decimal("estimated_cost"),
  urgency: varchar("urgency").default("medium"), // low, medium, high, critical
  status: varchar("status").default("pending"), // pending, approved, rejected, purchased, deployed
  approvedBy: varchar("approved_by").references(() => users.id),
  approvalDate: timestamp("approval_date"),
  rejectionReason: text("rejection_reason"),
  requestedAt: timestamp("requested_at").defaultNow(),
  metadata: jsonb("metadata").default({}),
});

// Media delivery and content distribution
export const mediaContent = pgTable("media_content", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  institutionId: varchar("institution_id").references(() => institutions.id).notNull(),
  contentName: varchar("content_name").notNull(),
  contentType: varchar("content_type").notNull(), // video, audio, document, application, ebook
  category: varchar("category"), // educational, administrative, entertainment, reference
  fileSize: decimal("file_size"), // in MB
  duration: integer("duration"), // in seconds for audio/video
  format: varchar("format"), // mp4, pdf, epub, apk, etc
  storageLocation: text("storage_location"), // MinIO object path
  thumbnailUrl: text("thumbnail_url"),
  description: text("description"),
  tags: jsonb("tags").default([]),
  contentRating: varchar("content_rating"), // G, PG, PG-13, R for age-appropriate filtering
  gradeLevel: varchar("grade_level"), // K-12, college, adult
  subject: varchar("subject"),
  isActive: boolean("is_active").default(true),
  isRestricted: boolean("is_restricted").default(false),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  metadata: jsonb("metadata").default({}),
});

// Content distribution policies
export const contentDistributionPolicies = pgTable("content_distribution_policies", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  institutionId: varchar("institution_id").references(() => institutions.id).notNull(),
  policyName: varchar("policy_name").notNull(),
  description: text("description"),
  targetType: varchar("target_type").notNull(), // device_type, user_role, grade_level, department
  targetIds: jsonb("target_ids").default([]),
  allowedContentTypes: jsonb("allowed_content_types").default([]),
  blockedContentTypes: jsonb("blocked_content_types").default([]),
  allowedCategories: jsonb("allowed_categories").default([]),
  blockedCategories: jsonb("blocked_categories").default([]),
  contentRatingRestrictions: jsonb("content_rating_restrictions").default([]),
  downloadPermissions: boolean("download_permissions").default(true),
  streamingPermissions: boolean("streaming_permissions").default(true),
  offlineAccess: boolean("offline_access").default(false),
  bandwidthLimit: integer("bandwidth_limit"), // in Mbps
  storageQuota: decimal("storage_quota"), // in GB per device
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(1),
  effectiveFrom: timestamp("effective_from"),
  effectiveTo: timestamp("effective_to"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content delivery tracking
export const contentDelivery = pgTable("content_delivery", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  contentId: integer("content_id").references(() => mediaContent.id).notNull(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  deliveryMethod: varchar("delivery_method").notNull(), // download, stream, cache, push
  deliveryStatus: varchar("delivery_status").default("pending"), // pending, in_progress, completed, failed, cancelled
  startTime: timestamp("start_time"),
  completionTime: timestamp("completion_time"),
  bytesTransferred: decimal("bytes_transferred"),
  transferSpeed: decimal("transfer_speed"), // in Mbps
  errorMessage: text("error_message"),
  networkType: varchar("network_type"), // wifi, cellular, ethernet
  qualitySettings: jsonb("quality_settings").default({}), // resolution, bitrate, etc
  initiatedAt: timestamp("initiated_at").defaultNow(),
  metadata: jsonb("metadata").default({}),
});

// Content access and usage tracking
export const contentAccess = pgTable("content_access", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  contentId: integer("content_id").references(() => mediaContent.id).notNull(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  accessType: varchar("access_type").notNull(), // view, download, share, favorite
  sessionStart: timestamp("session_start").notNull(),
  sessionEnd: timestamp("session_end"),
  duration: integer("duration"), // in seconds
  progress: decimal("progress"), // percentage completed for media
  interactions: jsonb("interactions").default([]), // play, pause, seek, bookmark
  deviceLocation: jsonb("device_location").default({}),
  networkQuality: varchar("network_quality"), // excellent, good, fair, poor
  buffering: integer("buffering"), // total buffering time in seconds
  date: timestamp("date").defaultNow(),
});

// Content synchronization status
export const contentSync = pgTable("content_sync", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  contentId: integer("content_id").references(() => mediaContent.id).notNull(),
  syncStatus: varchar("sync_status").default("pending"), // pending, syncing, synced, failed, outdated
  localPath: text("local_path"), // path on device storage
  localSize: decimal("local_size"), // actual size on device
  lastSyncAttempt: timestamp("last_sync_attempt"),
  lastSuccessfulSync: timestamp("last_successful_sync"),
  syncPriority: integer("sync_priority").default(5), // 1-10, 10 being highest
  retryCount: integer("retry_count").default(0),
  errorDetails: text("error_details"),
  checksumLocal: varchar("checksum_local"),
  checksumRemote: varchar("checksum_remote"),
  expiresAt: timestamp("expires_at"), // for temporary/cached content
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export types - Device Management
export type Device = typeof devices.$inferSelect;
export type InsertDevice = typeof devices.$inferInsert;
export type DevicePolicy = typeof devicePolicies.$inferSelect;
export type InsertDevicePolicy = typeof devicePolicies.$inferInsert;
export type ComplianceViolation = typeof complianceViolations.$inferSelect;
export type InsertComplianceViolation = typeof complianceViolations.$inferInsert;
export type DeviceActivity = typeof deviceActivities.$inferSelect;
export type InsertDeviceActivity = typeof deviceActivities.$inferInsert;
export type ScreenTimeRecord = typeof screenTimeRecords.$inferSelect;
export type InsertScreenTimeRecord = typeof screenTimeRecords.$inferInsert;
export type ContentFilterLog = typeof contentFilterLogs.$inferSelect;
export type InsertContentFilterLog = typeof contentFilterLogs.$inferInsert;
export type RemoteAction = typeof remoteActions.$inferSelect;
export type InsertRemoteAction = typeof remoteActions.$inferInsert;

// Export types - License Management
export type SoftwareLicense = typeof softwareLicenses.$inferSelect;
export type InsertSoftwareLicense = typeof softwareLicenses.$inferInsert;
export type SoftwareInstallation = typeof softwareInstallations.$inferSelect;
export type InsertSoftwareInstallation = typeof softwareInstallations.$inferInsert;
export type LicenseViolation = typeof licenseViolations.$inferSelect;
export type InsertLicenseViolation = typeof licenseViolations.$inferInsert;
export type LicenseUsageTracking = typeof licenseUsageTracking.$inferSelect;
export type InsertLicenseUsageTracking = typeof licenseUsageTracking.$inferInsert;
export type SoftwareRequest = typeof softwareRequests.$inferSelect;
export type InsertSoftwareRequest = typeof softwareRequests.$inferInsert;

// Export types - Media Delivery
export type MediaContent = typeof mediaContent.$inferSelect;
export type InsertMediaContent = typeof mediaContent.$inferInsert;
export type ContentDistributionPolicy = typeof contentDistributionPolicies.$inferSelect;
export type InsertContentDistributionPolicy = typeof contentDistributionPolicies.$inferInsert;
export type ContentDelivery = typeof contentDelivery.$inferSelect;
export type InsertContentDelivery = typeof contentDelivery.$inferInsert;
export type ContentAccess = typeof contentAccess.$inferSelect;
export type InsertContentAccess = typeof contentAccess.$inferInsert;
export type ContentSync = typeof contentSync.$inferSelect;
export type InsertContentSync = typeof contentSync.$inferInsert;

// Insert schemas for validation
export const insertDeviceSchema = createInsertSchema(devices);
export const insertDevicePolicySchema = createInsertSchema(devicePolicies);
export const insertComplianceViolationSchema = createInsertSchema(complianceViolations);
export const insertDeviceActivitySchema = createInsertSchema(deviceActivities);
export const insertScreenTimeRecordSchema = createInsertSchema(screenTimeRecords);
export const insertContentFilterLogSchema = createInsertSchema(contentFilterLogs);
export const insertRemoteActionSchema = createInsertSchema(remoteActions);
export const insertSoftwareLicenseSchema = createInsertSchema(softwareLicenses);
export const insertSoftwareInstallationSchema = createInsertSchema(softwareInstallations);
export const insertLicenseViolationSchema = createInsertSchema(licenseViolations);
export const insertLicenseUsageTrackingSchema = createInsertSchema(licenseUsageTracking);
export const insertSoftwareRequestSchema = createInsertSchema(softwareRequests);
export const insertMediaContentSchema = createInsertSchema(mediaContent);
export const insertContentDistributionPolicySchema = createInsertSchema(contentDistributionPolicies);
export const insertContentDeliverySchema = createInsertSchema(contentDelivery);
export const insertContentAccessSchema = createInsertSchema(contentAccess);
export const insertContentSyncSchema = createInsertSchema(contentSync);