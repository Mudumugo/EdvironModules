import { z } from "zod";

export interface TimeRestriction {
  id: string;
  deviceId: string;
  dayOfWeek: number; // 0-6, Sunday = 0
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isActive: boolean;
}

export interface AppRestriction {
  id: string;
  deviceId: string;
  appName: string;
  packageName: string;
  isBlocked: boolean;
  timeLimit?: number; // minutes per day
  usedTime?: number; // minutes used today
}

export interface ContentFilter {
  id: string;
  deviceId: string;
  category: 'social' | 'games' | 'education' | 'entertainment' | 'news' | 'shopping';
  isBlocked: boolean;
  ageRating?: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'tablet' | 'phone' | 'laptop';
  userId: string;
  isOnline: boolean;
  lastSeen: string;
  batteryLevel?: number;
  location?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: 'parent' | 'child';
  age?: number;
  devices: Device[];
  profileImage?: string;
}

export const timeRestrictionSchema = z.object({
  deviceId: z.string().min(1, "Device is required"),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  isActive: z.boolean().default(true),
});

export const appRestrictionSchema = z.object({
  deviceId: z.string().min(1, "Device is required"),
  appName: z.string().min(1, "App name is required"),
  packageName: z.string().min(1, "Package name is required"),
  isBlocked: z.boolean().default(false),
  timeLimit: z.number().min(0).optional(),
});

export const contentFilterSchema = z.object({
  deviceId: z.string().min(1, "Device is required"),
  category: z.enum(['social', 'games', 'education', 'entertainment', 'news', 'shopping']),
  isBlocked: z.boolean().default(false),
  ageRating: z.string().optional(),
});

export type TimeRestrictionFormType = z.infer<typeof timeRestrictionSchema>;
export type AppRestrictionFormType = z.infer<typeof appRestrictionSchema>;
export type ContentFilterFormType = z.infer<typeof contentFilterSchema>;

export const daysOfWeek = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
];

export const contentCategories = [
  { value: 'social', label: 'Social Media', icon: '👥', color: 'bg-blue-100 text-blue-800' },
  { value: 'games', label: 'Games', icon: '🎮', color: 'bg-green-100 text-green-800' },
  { value: 'education', label: 'Education', icon: '📚', color: 'bg-purple-100 text-purple-800' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'bg-red-100 text-red-800' },
  { value: 'news', label: 'News', icon: '📰', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'shopping', label: 'Shopping', icon: '🛒', color: 'bg-orange-100 text-orange-800' },
];