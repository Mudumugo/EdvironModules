export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'stat' | 'list' | 'calendar' | 'progress' | 'activity';
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  data?: any;
  config?: Record<string, any>;
  isVisible: boolean;
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  category: 'academic' | 'administrative' | 'communication' | 'tools';
  isEnabled: boolean;
}

export interface RecentActivity {
  id: string;
  type: 'assignment' | 'grade' | 'message' | 'attendance' | 'resource';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  status?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface DashboardStats {
  students: {
    total: number;
    active: number;
    newThisWeek: number;
  };
  assignments: {
    total: number;
    pending: number;
    graded: number;
    overdue: number;
  };
  attendance: {
    todayPresent: number;
    todayAbsent: number;
    weeklyAverage: number;
  };
  library: {
    totalResources: number;
    recentlyAdded: number;
    mostPopular: string[];
  };
  performance: {
    averageGrade: number;
    improvementTrend: 'up' | 'down' | 'stable';
    completionRate: number;
  };
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface DashboardPreferences {
  theme: 'light' | 'dark' | 'auto';
  layout: 'compact' | 'comfortable' | 'spacious';
  defaultView: 'overview' | 'assignments' | 'grades' | 'calendar';
  showQuickActions: boolean;
  showRecentActivity: boolean;
  refreshInterval: number; // minutes
  autoSave: boolean;
}