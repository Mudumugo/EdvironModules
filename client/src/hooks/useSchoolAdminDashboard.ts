import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  activeUsers: number;
  attendanceRate: number;
  gradingCompletion: number;
  systemHealth: number;
  pendingTasks: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  url: string;
  category: 'users' | 'academics' | 'system' | 'communications';
  priority: 'high' | 'medium' | 'low';
}

export interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  userId: string;
  userName: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface SystemAlert {
  id: string;
  type: 'security' | 'system' | 'academic' | 'financial';
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  isRead: boolean;
  createdAt: Date;
  actionRequired: boolean;
}

export function useSchoolAdminDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAlert, setSelectedAlert] = useState<SystemAlert | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch school statistics
  const { data: stats, isLoading: statsLoading } = useQuery<SchoolStats>({
    queryKey: ['/api/admin/dashboard/stats', selectedTimeframe],
    queryFn: () => apiRequest('GET', `/api/admin/dashboard/stats?timeframe=${selectedTimeframe}`),
  });

  // Fetch quick actions
  const { data: quickActions = [], isLoading: actionsLoading } = useQuery<QuickAction[]>({
    queryKey: ['/api/admin/dashboard/quick-actions'],
    queryFn: () => apiRequest('GET', '/api/admin/dashboard/quick-actions'),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Fetch recent activities
  const { data: recentActivities = [], isLoading: activitiesLoading } = useQuery<RecentActivity[]>({
    queryKey: ['/api/admin/dashboard/activities', selectedTimeframe],
    queryFn: () => apiRequest('GET', `/api/admin/dashboard/activities?timeframe=${selectedTimeframe}&limit=10`),
    select: (data) => Array.isArray(data) ? data.map(activity => ({
      ...activity,
      timestamp: new Date(activity.timestamp)
    })) : [],
  });

  // Fetch system alerts
  const { data: alerts = [], isLoading: alertsLoading } = useQuery<SystemAlert[]>({
    queryKey: ['/api/admin/dashboard/alerts'],
    queryFn: () => apiRequest('GET', '/api/admin/dashboard/alerts?unread=true'),
    select: (data) => Array.isArray(data) ? data.map(alert => ({
      ...alert,
      createdAt: new Date(alert.createdAt)
    })) : [],
  });

  // Mark alert as read mutation
  const markAlertReadMutation = useMutation({
    mutationFn: async (alertId: string) => {
      return apiRequest('PATCH', `/api/admin/alerts/${alertId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard/alerts'] });
      toast({
        title: "Alert marked as read",
        description: "The alert has been marked as read.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark alert as read",
        variant: "destructive",
      });
    },
  });

  // Dismiss alert mutation
  const dismissAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      return apiRequest('DELETE', `/api/admin/alerts/${alertId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard/alerts'] });
      setSelectedAlert(null);
      toast({
        title: "Alert dismissed",
        description: "The alert has been dismissed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to dismiss alert",
        variant: "destructive",
      });
    },
  });

  // Execute quick action mutation
  const executeActionMutation = useMutation({
    mutationFn: async (actionId: string) => {
      return apiRequest('POST', `/api/admin/actions/${actionId}/execute`);
    },
    onSuccess: (_, actionId) => {
      const action = quickActions.find(a => a.id === actionId);
      toast({
        title: "Action executed",
        description: `${action?.title} has been executed successfully.`,
      });
      
      // Refresh relevant data
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to execute action",
        variant: "destructive",
      });
    },
  });

  // Filter quick actions by category
  const getActionsByCategory = (category: QuickAction['category']) => {
    return quickActions.filter(action => action.category === category);
  };

  // Get alerts by severity
  const getAlertsBySeverity = (severity: SystemAlert['severity']) => {
    return alerts.filter(alert => alert.severity === severity);
  };

  // Get recent activities by type
  const getActivitiesByType = (type: string) => {
    return recentActivities.filter(activity => activity.type === type);
  };

  return {
    // State
    selectedTimeframe,
    activeTab,
    selectedAlert,
    
    // Data
    stats,
    quickActions,
    recentActivities,
    alerts,
    
    // Loading states
    statsLoading,
    actionsLoading,
    activitiesLoading,
    alertsLoading,
    
    // Computed data
    criticalAlerts: getAlertsBySeverity('critical'),
    warningAlerts: getAlertsBySeverity('warning'),
    unreadAlertsCount: alerts.filter(alert => !alert.isRead).length,
    
    // Actions
    setSelectedTimeframe,
    setActiveTab,
    setSelectedAlert,
    getActionsByCategory,
    getAlertsBySeverity,
    getActivitiesByType,
    
    // Mutations
    markAlertAsRead: markAlertReadMutation.mutate,
    dismissAlert: dismissAlertMutation.mutate,
    executeAction: executeActionMutation.mutate,
    
    // Loading states for mutations
    isMarkingRead: markAlertReadMutation.isPending,
    isDismissing: dismissAlertMutation.isPending,
    isExecutingAction: executeActionMutation.isPending,
  };
}