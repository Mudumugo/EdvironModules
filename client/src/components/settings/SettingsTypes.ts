import { z } from "zod";

export const paymentSettingsSchema = z.object({
  stripePublishableKey: z.string().min(1, "Publishable key is required").startsWith("pk_", "Must start with pk_"),
  stripeSecretKey: z.string().min(1, "Secret key is required").startsWith("sk_", "Must start with sk_"),
});

export const profileSettingsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
});

export const securitySettingsSchema = z.object({
  twoFactorEnabled: z.boolean(),
  loginAlerts: z.boolean(),
  sessionTimeout: z.number().min(15).max(480),
});

export type PaymentSettings = z.infer<typeof paymentSettingsSchema>;
export type ProfileSettings = z.infer<typeof profileSettingsSchema>;
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
export type SecuritySettings = z.infer<typeof securitySettingsSchema>;

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
  dependencies?: string[];
  permissions?: string[];
}