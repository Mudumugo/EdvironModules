import { useState, useCallback } from 'react';
import { QuickAction } from './types';

const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'new_assignment',
    title: 'New Assignment',
    description: 'Create a new assignment for students',
    icon: 'FileText',
    action: () => console.log('Navigate to new assignment'),
    category: 'academic',
    isEnabled: true
  },
  {
    id: 'take_attendance',
    title: 'Take Attendance',
    description: 'Record student attendance',
    icon: 'Users',
    action: () => console.log('Navigate to attendance'),
    category: 'administrative',
    isEnabled: true
  },
  {
    id: 'send_message',
    title: 'Send Message',
    description: 'Send message to students or parents',
    icon: 'Mail',
    action: () => console.log('Navigate to messaging'),
    category: 'communication',
    isEnabled: true
  },
  {
    id: 'grade_assignments',
    title: 'Grade Assignments',
    description: 'Review and grade student submissions',
    icon: 'Star',
    action: () => console.log('Navigate to grading'),
    category: 'academic',
    isEnabled: true
  },
  {
    id: 'library_search',
    title: 'Search Library',
    description: 'Find educational resources',
    icon: 'Search',
    action: () => console.log('Navigate to library'),
    category: 'tools',
    isEnabled: true
  },
  {
    id: 'schedule_event',
    title: 'Schedule Event',
    description: 'Create calendar event or meeting',
    icon: 'Calendar',
    action: () => console.log('Navigate to calendar'),
    category: 'administrative',
    isEnabled: true
  }
];

export function useQuickActions() {
  const [quickActions, setQuickActions] = useState<QuickAction[]>(DEFAULT_QUICK_ACTIONS);
  const [favoriteActions, setFavoriteActions] = useState<string[]>([]);

  const executeAction = useCallback((actionId: string) => {
    const action = quickActions.find(a => a.id === actionId);
    if (action && action.isEnabled) {
      action.action();
    }
  }, [quickActions]);

  const toggleActionEnabled = useCallback((actionId: string) => {
    setQuickActions(prev => prev.map(action => 
      action.id === actionId ? { ...action, isEnabled: !action.isEnabled } : action
    ));
  }, []);

  const addToFavorites = useCallback((actionId: string) => {
    setFavoriteActions(prev => 
      prev.includes(actionId) ? prev : [...prev, actionId]
    );
  }, []);

  const removeFromFavorites = useCallback((actionId: string) => {
    setFavoriteActions(prev => prev.filter(id => id !== actionId));
  }, []);

  const getActionsByCategory = useCallback((category: QuickAction['category']) => {
    return quickActions.filter(action => action.category === category && action.isEnabled);
  }, [quickActions]);

  const getFavoriteActions = useCallback(() => {
    return quickActions.filter(action => 
      favoriteActions.includes(action.id) && action.isEnabled
    );
  }, [quickActions, favoriteActions]);

  const getEnabledActions = useCallback(() => {
    return quickActions.filter(action => action.isEnabled);
  }, [quickActions]);

  const addCustomAction = useCallback((action: Omit<QuickAction, 'id'>) => {
    const newAction: QuickAction = {
      ...action,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setQuickActions(prev => [...prev, newAction]);
    return newAction.id;
  }, []);

  const updateAction = useCallback((actionId: string, updates: Partial<QuickAction>) => {
    setQuickActions(prev => prev.map(action => 
      action.id === actionId ? { ...action, ...updates } : action
    ));
  }, []);

  const removeAction = useCallback((actionId: string) => {
    setQuickActions(prev => prev.filter(action => action.id !== actionId));
    removeFromFavorites(actionId);
  }, [removeFromFavorites]);

  return {
    quickActions,
    favoriteActions,
    executeAction,
    toggleActionEnabled,
    addToFavorites,
    removeFromFavorites,
    getActionsByCategory,
    getFavoriteActions,
    getEnabledActions,
    addCustomAction,
    updateAction,
    removeAction
  };
}