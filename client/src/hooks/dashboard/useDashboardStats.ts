import { useState, useCallback, useEffect } from 'react';
import { DashboardStats } from './types';

const INITIAL_STATS: DashboardStats = {
  students: {
    total: 0,
    active: 0,
    newThisWeek: 0
  },
  assignments: {
    total: 0,
    pending: 0,
    graded: 0,
    overdue: 0
  },
  attendance: {
    todayPresent: 0,
    todayAbsent: 0,
    weeklyAverage: 0
  },
  library: {
    totalResources: 0,
    recentlyAdded: 0,
    mostPopular: []
  },
  performance: {
    averageGrade: 0,
    improvementTrend: 'stable',
    completionRate: 0
  }
};

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const updateStats = useCallback((newStats: Partial<DashboardStats>) => {
    setStats(prev => ({
      ...prev,
      ...newStats
    }));
    setLastUpdated(new Date());
  }, []);

  const updateStudentStats = useCallback((studentStats: Partial<DashboardStats['students']>) => {
    setStats(prev => ({
      ...prev,
      students: { ...prev.students, ...studentStats }
    }));
    setLastUpdated(new Date());
  }, []);

  const updateAssignmentStats = useCallback((assignmentStats: Partial<DashboardStats['assignments']>) => {
    setStats(prev => ({
      ...prev,
      assignments: { ...prev.assignments, ...assignmentStats }
    }));
    setLastUpdated(new Date());
  }, []);

  const updateAttendanceStats = useCallback((attendanceStats: Partial<DashboardStats['attendance']>) => {
    setStats(prev => ({
      ...prev,
      attendance: { ...prev.attendance, ...attendanceStats }
    }));
    setLastUpdated(new Date());
  }, []);

  const updateLibraryStats = useCallback((libraryStats: Partial<DashboardStats['library']>) => {
    setStats(prev => ({
      ...prev,
      library: { ...prev.library, ...libraryStats }
    }));
    setLastUpdated(new Date());
  }, []);

  const updatePerformanceStats = useCallback((performanceStats: Partial<DashboardStats['performance']>) => {
    setStats(prev => ({
      ...prev,
      performance: { ...prev.performance, ...performanceStats }
    }));
    setLastUpdated(new Date());
  }, []);

  const refreshStats = useCallback(async () => {
    setLoading(true);
    try {
      // This would typically fetch from an API
      // For now, simulate with sample data
      const sampleStats: DashboardStats = {
        students: {
          total: 128,
          active: 124,
          newThisWeek: 3
        },
        assignments: {
          total: 45,
          pending: 12,
          graded: 28,
          overdue: 5
        },
        attendance: {
          todayPresent: 118,
          todayAbsent: 6,
          weeklyAverage: 95.2
        },
        library: {
          totalResources: 1247,
          recentlyAdded: 8,
          mostPopular: ['Mathematics Workbook', 'Science Experiments', 'History Timeline']
        },
        performance: {
          averageGrade: 87.3,
          improvementTrend: 'up',
          completionRate: 92.1
        }
      };
      
      setStats(sampleStats);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getOverallHealth = useCallback(() => {
    const attendanceHealth = stats.attendance.weeklyAverage;
    const performanceHealth = stats.performance.completionRate;
    const assignmentHealth = stats.assignments.total > 0 
      ? ((stats.assignments.graded / stats.assignments.total) * 100)
      : 100;
    
    const overall = (attendanceHealth + performanceHealth + assignmentHealth) / 3;
    
    if (overall >= 90) return { status: 'excellent', score: overall };
    if (overall >= 80) return { status: 'good', score: overall };
    if (overall >= 70) return { status: 'average', score: overall };
    return { status: 'needs_attention', score: overall };
  }, [stats]);

  const getImportantMetrics = useCallback(() => {
    return {
      totalStudents: stats.students.total,
      activeStudents: stats.students.active,
      pendingAssignments: stats.assignments.pending,
      overdueAssignments: stats.assignments.overdue,
      todayAttendance: stats.attendance.todayPresent + stats.attendance.todayAbsent > 0
        ? Math.round((stats.attendance.todayPresent / (stats.attendance.todayPresent + stats.attendance.todayAbsent)) * 100)
        : 0,
      averageGrade: stats.performance.averageGrade,
      completionRate: stats.performance.completionRate
    };
  }, [stats]);

  const resetStats = useCallback(() => {
    setStats(INITIAL_STATS);
    setLastUpdated(null);
  }, []);

  // Auto-refresh stats periodically
  useEffect(() => {
    refreshStats();
    const interval = setInterval(refreshStats, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [refreshStats]);

  return {
    stats,
    loading,
    lastUpdated,
    updateStats,
    updateStudentStats,
    updateAssignmentStats,
    updateAttendanceStats,
    updateLibraryStats,
    updatePerformanceStats,
    refreshStats,
    getOverallHealth,
    getImportantMetrics,
    resetStats
  };
}