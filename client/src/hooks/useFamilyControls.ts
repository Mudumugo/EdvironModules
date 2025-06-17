import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Types and schemas
export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  age: string;
  school: string;
  avatar: string;
  status: "online" | "offline";
  totalScreenTime: number;
  weeklyGoal: number;
  lastActive: string;
  weeklyProgress: {
    math: number;
    science: number;
    english?: number;
    reading: number;
    spelling: number;
    history?: number;
  };
}

export interface Restriction {
  id: string;
  childId: string;
  type: string;
  value: string;
  description: string;
  isActive: boolean;
  category: string;
}

export interface ActivityLog {
  id: string;
  childId: string;
  activity: string;
  type: "achievement" | "learning" | "restriction";
  timestamp: string;
  duration: number;
  subject: string;
  score: number | null;
  device: string;
}

export const childSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  grade: z.string().min(1, "Grade is required"),
  age: z.string().min(1, "Age is required"),
  school: z.string().optional(),
});

export const restrictionSchema = z.object({
  childId: z.string().min(1, "Child is required"),
  type: z.string().min(1, "Restriction type is required"),
  value: z.string().min(1, "Value is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Sample data
const initialChildren: Child[] = [
  {
    id: "1",
    firstName: "Emma",
    lastName: "Johnson",
    grade: "8th Grade",
    age: "13",
    school: "Lincoln Middle School",
    avatar: "👧",
    status: "online",
    totalScreenTime: 4.5,
    weeklyGoal: 20,
    lastActive: "2024-01-15T14:30:00Z",
    weeklyProgress: {
      math: 85,
      science: 92,
      english: 78,
      reading: 85,
      spelling: 80,
      history: 88
    }
  },
  {
    id: "2",
    firstName: "Alex",
    lastName: "Johnson",
    grade: "5th Grade",
    age: "10",
    school: "Sunshine Elementary",
    avatar: "👦",
    status: "offline",
    totalScreenTime: 2.8,
    weeklyGoal: 15,
    lastActive: "2024-01-15T16:45:00Z",
    weeklyProgress: {
      math: 90,
      science: 85,
      reading: 95,
      spelling: 80,
      english: 82,
      history: 75
    }
  }
];

const initialRestrictions: Restriction[] = [
  {
    id: "1",
    childId: "1",
    type: "screen-time",
    value: "3",
    description: "Maximum 3 hours of screen time per day",
    isActive: true,
    category: "Time Management"
  },
  {
    id: "2",
    childId: "1",
    type: "content-filter",
    value: "educational-only",
    description: "Access only educational content during study hours",
    isActive: true,
    category: "Content Control"
  },
  {
    id: "3",
    childId: "2",
    type: "bedtime",
    value: "20:00",
    description: "No device access after 8 PM on school days",
    isActive: true,
    category: "Sleep Schedule"
  },
  {
    id: "4",
    childId: "2",
    type: "app-restriction",
    value: "games",
    description: "Gaming apps restricted during homework hours",
    isActive: true,
    category: "App Control"
  }
];

const initialActivityLogs: ActivityLog[] = [
  {
    id: "1",
    childId: "1",
    activity: "Completed Math Assignment",
    type: "achievement",
    timestamp: "2024-01-15T10:30:00Z",
    duration: 45,
    subject: "Mathematics",
    score: 92,
    device: "tablet"
  },
  {
    id: "2",
    childId: "1",
    activity: "Watched Science Video",
    type: "learning",
    timestamp: "2024-01-15T14:15:00Z",
    duration: 25,
    subject: "Science",
    score: null,
    device: "computer"
  },
  {
    id: "3",
    childId: "2",
    activity: "Reading Session",
    type: "learning",
    timestamp: "2024-01-15T16:00:00Z",
    duration: 30,
    subject: "English",
    score: null,
    device: "tablet"
  },
  {
    id: "4",
    childId: "1",
    activity: "Screen Time Limit Reached",
    type: "restriction",
    timestamp: "2024-01-15T17:00:00Z",
    duration: 0,
    subject: "System",
    score: null,
    device: "all"
  }
];

export function useFamilyControls() {
  const { toast } = useToast();
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const [restrictions, setRestrictions] = useState<Restriction[]>(initialRestrictions);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);

  const addChild = (data: z.infer<typeof childSchema>) => {
    const newChild: Child = {
      ...data,
      id: String(children.length + 1),
      school: data.school || "",
      avatar: data.firstName.toLowerCase().includes('a') ? "👧" : "👦",
      status: "offline",
      totalScreenTime: 0,
      weeklyGoal: 15,
      lastActive: new Date().toISOString(),
      weeklyProgress: {
        math: 0,
        science: 0,
        english: 0,
        reading: 0,
        spelling: 0,
        history: 0
      }
    };
    setChildren([...children, newChild]);
    toast({
      title: "Success",
      description: "Child profile created successfully",
    });
  };

  const addRestriction = (data: z.infer<typeof restrictionSchema>) => {
    const getRestrictionCategory = (type: string) => {
      switch (type) {
        case "screen-time": return "Time Management";
        case "content-filter": return "Content Control";
        case "bedtime": return "Sleep Schedule";
        case "app-restriction": return "App Control";
        case "website-block": return "Web Control";
        default: return "General";
      }
    };

    const newRestriction: Restriction = {
      ...data,
      id: String(restrictions.length + 1),
      description: data.description || "",
      category: getRestrictionCategory(data.type)
    };
    setRestrictions([...restrictions, newRestriction]);
    toast({
      title: "Success",
      description: "Restriction applied successfully",
    });
  };

  const updateRestriction = (id: string, updates: Partial<Restriction>) => {
    setRestrictions(restrictions.map(restriction => 
      restriction.id === id ? { ...restriction, ...updates } : restriction
    ));
  };

  const removeRestriction = (id: string) => {
    setRestrictions(restrictions.filter(restriction => restriction.id !== id));
    toast({
      title: "Success",
      description: "Restriction removed successfully",
    });
  };

  return {
    children,
    restrictions,
    activityLogs,
    addChild,
    addRestriction,
    updateRestriction,
    removeRestriction,
  };
}