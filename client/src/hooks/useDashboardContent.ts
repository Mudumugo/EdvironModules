// Re-export from modular dashboard hooks
export * from './dashboard/types';
export { useDashboard } from './dashboard';

// Legacy compatibility wrapper
export function useDashboardContent() {
  const dashboard = useDashboard();
  
  return {
    // Legacy interface
    widgets: dashboard.widgets,
    quickActions: dashboard.quickActions,
    recentActivity: dashboard.activities,
    stats: dashboard.stats,
    preferences: dashboard.preferences,
    
    // Legacy methods
    addWidget: dashboard.addWidget,
    updateWidget: dashboard.updateWidget,
    removeWidget: dashboard.removeWidget,
    executeAction: dashboard.executeAction,
    addActivity: dashboard.addActivity,
    refreshStats: dashboard.refreshStats,
    
    // Loading states
    loading: dashboard.statsLoading,
    isCustomizing: dashboard.isCustomizing
  };
}
    completed: number;
  };
  classes: {
    total: number;
    active: number;
    scheduled: number;
  };
  performance: {
    averageGrade: number;
    attendanceRate: number;
    completionRate: number;
  };
}

export const DEFAULT_WIDGETS: DashboardWidget[] = [
  {
    id: 'student-stats',
    title: 'Student Statistics',
    type: 'stat',
    size: 'medium',
    position: { x: 0, y: 0 },
    isVisible: true
  },
  {
    id: 'assignment-progress',
    title: 'Assignment Progress',
    type: 'progress',
    size: 'medium',
    position: { x: 1, y: 0 },
    isVisible: true
  },
  {
    id: 'recent-activity',
    title: 'Recent Activity',
    type: 'activity',
    size: 'large',
    position: { x: 0, y: 1 },
    isVisible: true
  },
  {
    id: 'performance-chart',
    title: 'Performance Overview',
    type: 'chart',
    size: 'large',
    position: { x: 1, y: 1 },
    isVisible: true
  },
  {
    id: 'upcoming-events',
    title: 'Upcoming Events',
    type: 'calendar',
    size: 'medium',
    position: { x: 0, y: 2 },
    isVisible: true
  }
];

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'create-assignment',
    title: 'Create Assignment',
    description: 'Create a new assignment for your class',
    icon: 'FileText',
    action: () => console.log('Create assignment'),
    category: 'academic',
    isEnabled: true
  },
  {
    id: 'take-attendance',
    title: 'Take Attendance',
    description: 'Mark student attendance for today',
    icon: 'Users',
    action: () => console.log('Take attendance'),
    category: 'academic',
    isEnabled: true
  },
  {
    id: 'send-message',
    title: 'Send Message',
    description: 'Send a message to students or parents',
    icon: 'MessageSquare',
    action: () => console.log('Send message'),
    category: 'communication',
    isEnabled: true
  },
  {
    id: 'schedule-meeting',
    title: 'Schedule Meeting',
    description: 'Schedule a meeting or event',
    icon: 'Calendar',
    action: () => console.log('Schedule meeting'),
    category: 'administrative',
    isEnabled: true
  },
  {
    id: 'grade-submissions',
    title: 'Grade Submissions',
    description: 'Review and grade student submissions',
    icon: 'CheckCircle',
    action: () => console.log('Grade submissions'),
    category: 'academic',
    isEnabled: true
  },
  {
    id: 'generate-report',
    title: 'Generate Report',
    description: 'Create performance or attendance reports',
    icon: 'BarChart3',
    action: () => console.log('Generate report'),
    category: 'administrative',
    isEnabled: true
  }
];

export function useDashboardContent() {
  const [currentLayout, setCurrentLayout] = useState<DashboardLayout>({
    id: 'default',
    name: 'Default Layout',
    widgets: DEFAULT_WIDGETS,
    isDefault: true
  });

  const [customLayouts, setCustomLayouts] = useState<DashboardLayout[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [quickActions] = useState<QuickAction[]>(QUICK_ACTIONS);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');

  // Mock dashboard stats
  const dashboardStats: DashboardStats = useMemo(() => ({
    students: {
      total: 156,
      active: 142,
      newThisWeek: 8
    },
    assignments: {
      total: 45,
      pending: 12,
      overdue: 3,
      completed: 30
    },
    classes: {
      total: 8,
      active: 6,
      scheduled: 12
    },
    performance: {
      averageGrade: 78.5,
      attendanceRate: 92.3,
      completionRate: 85.7
    }
  }), []);

  const addWidget = (widget: Omit<DashboardWidget, 'id'>) => {
    const newWidget: DashboardWidget = {
      ...widget,
      id: `widget_${Date.now()}`
    };

    setCurrentLayout(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget]
    }));
  };

  const updateWidget = (widgetId: string, updates: Partial<DashboardWidget>) => {
    setCurrentLayout(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, ...updates } : widget
      )
    }));
  };

  const removeWidget = (widgetId: string) => {
    setCurrentLayout(prev => ({
      ...prev,
      widgets: prev.widgets.filter(widget => widget.id !== widgetId)
    }));
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    updateWidget(widgetId, { 
      isVisible: !currentLayout.widgets.find(w => w.id === widgetId)?.isVisible 
    });
  };

  const moveWidget = (widgetId: string, newPosition: { x: number; y: number }) => {
    updateWidget(widgetId, { position: newPosition });
  };

  const resizeWidget = (widgetId: string, newSize: DashboardWidget['size']) => {
    updateWidget(widgetId, { size: newSize });
  };

  const saveLayout = (name: string, description?: string) => {
    const newLayout: DashboardLayout = {
      id: `layout_${Date.now()}`,
      name,
      description,
      widgets: [...currentLayout.widgets],
      isDefault: false
    };

    setCustomLayouts(prev => [...prev, newLayout]);
    return newLayout;
  };

  const loadLayout = (layout: DashboardLayout) => {
    setCurrentLayout(layout);
  };

  const deleteLayout = (layoutId: string) => {
    setCustomLayouts(prev => prev.filter(layout => layout.id !== layoutId));
  };

  const resetToDefaultLayout = () => {
    setCurrentLayout({
      id: 'default',
      name: 'Default Layout',
      widgets: DEFAULT_WIDGETS,
      isDefault: true
    });
  };

  const addActivity = (activity: Omit<RecentActivity, 'id' | 'timestamp'>) => {
    const newActivity: RecentActivity = {
      ...activity,
      id: `activity_${Date.now()}`,
      timestamp: new Date()
    };

    setRecentActivities(prev => [newActivity, ...prev.slice(0, 49)]); // Keep only 50 most recent
  };

  const clearActivities = () => {
    setRecentActivities([]);
  };

  const getActivitiesByType = (type: RecentActivity['type']) => {
    return recentActivities.filter(activity => activity.type === type);
  };

  const getActivitiesByTimeRange = (range: 'today' | 'week' | 'month') => {
    const now = new Date();
    const startDate = new Date();

    switch (range) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    return recentActivities.filter(activity => activity.timestamp >= startDate);
  };

  const getQuickActionsByCategory = (category: QuickAction['category']) => {
    return quickActions.filter(action => action.category === category);
  };

  const executeQuickAction = (actionId: string) => {
    const action = quickActions.find(a => a.id === actionId);
    if (action && action.isEnabled) {
      action.action();
      addActivity({
        type: 'assignment', // This would vary based on action type
        title: action.title,
        description: `Executed quick action: ${action.title}`,
        user: 'Current User'
      });
    }
  };

  return {
    // Current state
    currentLayout,
    customLayouts,
    recentActivities,
    quickActions,
    selectedTimeRange,
    dashboardStats,

    // Widget management
    addWidget,
    updateWidget,
    removeWidget,
    toggleWidgetVisibility,
    moveWidget,
    resizeWidget,

    // Layout management
    saveLayout,
    loadLayout,
    deleteLayout,
    resetToDefaultLayout,

    // Activity management
    addActivity,
    clearActivities,
    getActivitiesByType,
    getActivitiesByTimeRange,

    // Quick actions
    getQuickActionsByCategory,
    executeQuickAction,

    // Settings
    setSelectedTimeRange,

    // Computed values
    visibleWidgets: currentLayout.widgets.filter(w => w.isVisible),
    totalLayouts: customLayouts.length + 1, // +1 for default
    todayActivities: getActivitiesByTimeRange('today'),
    academicActions: getQuickActionsByCategory('academic'),
    administrativeActions: getQuickActionsByCategory('administrative'),
    communicationActions: getQuickActionsByCategory('communication'),
    toolActions: getQuickActionsByCategory('tools'),
  };
}