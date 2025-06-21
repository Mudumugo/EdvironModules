import { useState, useCallback, useEffect } from 'react';
import { RecentActivity } from './types';

export function useRecentActivity() {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<RecentActivity['type'] | 'all'>('all');
  const [maxItems, setMaxItems] = useState(20);

  const addActivity = useCallback((activity: Omit<RecentActivity, 'id' | 'timestamp'>) => {
    const newActivity: RecentActivity = {
      ...activity,
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    setActivities(prev => [newActivity, ...prev.slice(0, maxItems - 1)]);
  }, [maxItems]);

  const markActivityAsRead = useCallback((activityId: string) => {
    // This would typically update a read status if needed
    console.log('Marking activity as read:', activityId);
  }, []);

  const removeActivity = useCallback((activityId: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== activityId));
  }, []);

  const getFilteredActivities = useCallback(() => {
    if (filter === 'all') {
      return activities;
    }
    return activities.filter(activity => activity.type === filter);
  }, [activities, filter]);

  const getActivitiesByPriority = useCallback((priority: RecentActivity['priority']) => {
    return activities.filter(activity => activity.priority === priority);
  }, [activities]);

  const getRecentActivities = useCallback((hours: number = 24) => {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return activities.filter(activity => activity.timestamp > cutoff);
  }, [activities]);

  const clearAllActivities = useCallback(() => {
    setActivities([]);
  }, []);

  const clearOldActivities = useCallback((daysOld: number = 30) => {
    const cutoff = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    setActivities(prev => prev.filter(activity => activity.timestamp > cutoff));
  }, []);

  const getActivityCounts = useCallback(() => {
    return activities.reduce((counts, activity) => {
      counts[activity.type] = (counts[activity.type] || 0) + 1;
      return counts;
    }, {} as Record<RecentActivity['type'], number>);
  }, [activities]);

  const simulateRecentActivities = useCallback(() => {
    const sampleActivities: Omit<RecentActivity, 'id' | 'timestamp'>[] = [
      {
        type: 'assignment',
        title: 'Math Homework Submitted',
        description: 'Student John Doe submitted Math Assignment #5',
        user: 'John Doe',
        status: 'submitted',
        priority: 'low'
      },
      {
        type: 'grade',
        title: 'Science Quiz Graded',
        description: 'Quiz #3 has been graded for Biology class',
        user: 'Teacher Smith',
        status: 'completed',
        priority: 'medium'
      },
      {
        type: 'attendance',
        title: 'Attendance Recorded',
        description: 'Morning attendance taken for Class 10A',
        user: 'Teacher Johnson',
        status: 'completed',
        priority: 'low'
      },
      {
        type: 'message',
        title: 'New Message Received',
        description: 'Parent inquiry about upcoming field trip',
        user: 'Sarah Wilson (Parent)',
        status: 'unread',
        priority: 'high'
      },
      {
        type: 'resource',
        title: 'New Library Resource',
        description: 'Digital textbook "Advanced Chemistry" has been added',
        user: 'Librarian',
        status: 'available',
        priority: 'low'
      }
    ];

    sampleActivities.forEach(activity => addActivity(activity));
  }, [addActivity]);

  // Load sample data on mount for demo purposes
  useEffect(() => {
    if (activities.length === 0) {
      simulateRecentActivities();
    }
  }, [activities.length, simulateRecentActivities]);

  return {
    activities: getFilteredActivities(),
    allActivities: activities,
    loading,
    filter,
    maxItems,
    setFilter,
    setMaxItems,
    addActivity,
    markActivityAsRead,
    removeActivity,
    getActivitiesByPriority,
    getRecentActivities,
    clearAllActivities,
    clearOldActivities,
    getActivityCounts,
    simulateRecentActivities
  };
}