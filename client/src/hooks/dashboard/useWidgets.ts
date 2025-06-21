import { useState, useCallback } from 'react';
import { DashboardWidget } from './types';

export function useWidgets(initialWidgets: DashboardWidget[] = []) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(initialWidgets);
  const [selectedWidget, setSelectedWidget] = useState<DashboardWidget | null>(null);

  const addWidget = useCallback((widget: Omit<DashboardWidget, 'id'>) => {
    const newWidget: DashboardWidget = {
      ...widget,
      id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setWidgets(prev => [...prev, newWidget]);
    return newWidget.id;
  }, []);

  const updateWidget = useCallback((widgetId: string, updates: Partial<DashboardWidget>) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId ? { ...widget, ...updates } : widget
    ));
  }, []);

  const removeWidget = useCallback((widgetId: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== widgetId));
    if (selectedWidget?.id === widgetId) {
      setSelectedWidget(null);
    }
  }, [selectedWidget]);

  const moveWidget = useCallback((widgetId: string, position: { x: number; y: number }) => {
    updateWidget(widgetId, { position });
  }, [updateWidget]);

  const resizeWidget = useCallback((widgetId: string, size: 'small' | 'medium' | 'large') => {
    updateWidget(widgetId, { size });
  }, [updateWidget]);

  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      updateWidget(widgetId, { isVisible: !widget.isVisible });
    }
  }, [widgets, updateWidget]);

  const duplicateWidget = useCallback((widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      const newWidget = {
        ...widget,
        title: `${widget.title} (Copy)`,
        position: {
          x: widget.position.x + 20,
          y: widget.position.y + 20
        }
      };
      delete (newWidget as any).id;
      return addWidget(newWidget);
    }
  }, [widgets, addWidget]);

  const getVisibleWidgets = useCallback(() => {
    return widgets.filter(widget => widget.isVisible);
  }, [widgets]);

  const getWidgetsByType = useCallback((type: DashboardWidget['type']) => {
    return widgets.filter(widget => widget.type === type);
  }, [widgets]);

  const resetWidgets = useCallback(() => {
    setWidgets(initialWidgets);
    setSelectedWidget(null);
  }, [initialWidgets]);

  return {
    widgets,
    selectedWidget,
    setSelectedWidget,
    addWidget,
    updateWidget,
    removeWidget,
    moveWidget,
    resizeWidget,
    toggleWidgetVisibility,
    duplicateWidget,
    getVisibleWidgets,
    getWidgetsByType,
    resetWidgets
  };
}