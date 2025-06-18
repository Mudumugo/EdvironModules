import { z } from "zod";

export interface DeviceGroup {
  id: string;
  name: string;
  description: string;
  deviceCount: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'maintenance';
  groupId?: string;
  lastSeen: string;
  batteryLevel?: number;
  location?: string;
}

export interface GroupFormData {
  name: string;
  description: string;
  color: string;
}

export const groupFormSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().min(1, "Description is required"),
  color: z.string().min(1, "Color selection is required"),
});

export type GroupFormType = z.infer<typeof groupFormSchema>;

export const predefinedColors = [
  { name: 'Blue', value: '#3B82F6', bg: 'bg-blue-100', text: 'text-blue-800' },
  { name: 'Green', value: '#10B981', bg: 'bg-green-100', text: 'text-green-800' },
  { name: 'Purple', value: '#8B5CF6', bg: 'bg-purple-100', text: 'text-purple-800' },
  { name: 'Red', value: '#EF4444', bg: 'bg-red-100', text: 'text-red-800' },
  { name: 'Orange', value: '#F59E0B', bg: 'bg-orange-100', text: 'text-orange-800' },
  { name: 'Pink', value: '#EC4899', bg: 'bg-pink-100', text: 'text-pink-800' },
  { name: 'Indigo', value: '#6366F1', bg: 'bg-indigo-100', text: 'text-indigo-800' },
  { name: 'Yellow', value: '#EAB308', bg: 'bg-yellow-100', text: 'text-yellow-800' },
];