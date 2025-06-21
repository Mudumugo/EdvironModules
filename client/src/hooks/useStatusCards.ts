import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  progress?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'assignment';
  timestamp: string;
  isRead: boolean;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDateTime: string;
  location?: string;
  type: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'document' | 'video' | 'link' | 'book';
  subject: string;
  lastAccessed?: string;
  rating?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: 'academic' | 'participation' | 'milestone';
}

export function useStatusCards() {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [limit, setLimit] = useState(5);

  // Fetch assignments
  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery<Assignment[]>({
    queryKey: ['/api/dashboard/assignments', { limit }],
    queryFn: () => apiRequest('GET', `/api/dashboard/assignments?limit=${limit}`),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Fetch notifications
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery<Notification[]>({
    queryKey: ['/api/dashboard/notifications', { limit }],
    queryFn: () => apiRequest('GET', `/api/dashboard/notifications?limit=${limit}`),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Fetch upcoming events
  const { data: events = [], isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ['/api/dashboard/events', { limit }],
    queryFn: () => apiRequest('GET', `/api/dashboard/events?limit=${limit}`),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Fetch recent resources
  const { data: resources = [], isLoading: resourcesLoading } = useQuery<Resource[]>({
    queryKey: ['/api/dashboard/resources', { limit }],
    queryFn: () => apiRequest('GET', `/api/dashboard/resources?limit=${limit}`),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Fetch achievements
  const { data: achievements = [], isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/dashboard/achievements', { limit }],
    queryFn: () => apiRequest('GET', `/api/dashboard/achievements?limit=${limit}`),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Get status color for assignments
  const getAssignmentStatusColor = (status: Assignment['status']) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      submitted: 'text-blue-600 bg-blue-100',
      graded: 'text-green-600 bg-green-100',
      overdue: 'text-red-600 bg-red-100',
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  // Get priority color for assignments
  const getPriorityColor = (priority: Assignment['priority']) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600',
    };
    return colors[priority] || 'text-gray-600';
  };

  // Get notification type color
  const getNotificationTypeColor = (type: Notification['type']) => {
    const colors = {
      info: 'text-blue-600 bg-blue-100',
      warning: 'text-yellow-600 bg-yellow-100',
      success: 'text-green-600 bg-green-100',
      assignment: 'text-purple-600 bg-purple-100',
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  // Get resource type icon
  const getResourceTypeIcon = (type: Resource['type']) => {
    const icons = {
      document: 'FileText',
      video: 'Play',
      link: 'ExternalLink',
      book: 'BookOpen',
    };
    return icons[type] || 'FileText';
  };

  // Filter functions
  const getUnreadNotifications = () => {
    return notifications.filter(notification => !notification.isRead);
  };

  const getPendingAssignments = () => {
    return assignments.filter(assignment => assignment.status === 'pending');
  };

  const getOverdueAssignments = () => {
    return assignments.filter(assignment => assignment.status === 'overdue');
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return events.filter(event => new Date(event.startDateTime) > now);
  };

  const getRecentAchievements = () => {
    return achievements.sort((a, b) => 
      new Date(b.earnedDate).getTime() - new Date(a.earnedDate).getTime()
    );
  };

  // Statistics
  const getAssignmentStats = () => {
    const total = assignments.length;
    const pending = getPendingAssignments().length;
    const overdue = getOverdueAssignments().length;
    const completed = assignments.filter(a => a.status === 'graded').length;
    
    return {
      total,
      pending,
      overdue,
      completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const getNotificationStats = () => {
    const total = notifications.length;
    const unread = getUnreadNotifications().length;
    
    return {
      total,
      unread,
      readRate: total > 0 ? Math.round(((total - unread) / total) * 100) : 0,
    };
  };

  return {
    // State
    activeCard,
    limit,
    
    // Data
    assignments,
    notifications,
    events,
    resources,
    achievements,
    
    // Loading states
    assignmentsLoading,
    notificationsLoading,
    eventsLoading,
    resourcesLoading,
    achievementsLoading,
    
    // Actions
    setActiveCard,
    setLimit,
    
    // Utility functions
    getAssignmentStatusColor,
    getPriorityColor,
    getNotificationTypeColor,
    getResourceTypeIcon,
    
    // Filtered data
    unreadNotifications: getUnreadNotifications(),
    pendingAssignments: getPendingAssignments(),
    overdueAssignments: getOverdueAssignments(),
    upcomingEvents: getUpcomingEvents(),
    recentAchievements: getRecentAchievements(),
    
    // Statistics
    assignmentStats: getAssignmentStats(),
    notificationStats: getNotificationStats(),
  };
}