import { useState, useCallback } from 'react';
import { InteractiveElement, INTERACTIVE_ELEMENT_TYPES } from './types';

export function useInteractiveElements() {
  const [elements, setElements] = useState<InteractiveElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<InteractiveElement | null>(null);
  const [draggedElement, setDraggedElement] = useState<InteractiveElement | null>(null);

  const addElement = useCallback((type: string, position?: { x: number; y: number }) => {
    const elementType = INTERACTIVE_ELEMENT_TYPES.find(t => t.type === type);
    if (!elementType) return;

    const newElement: InteractiveElement = {
      id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type as any,
      title: elementType.name,
      description: elementType.description,
      config: getDefaultConfig(type),
      position: position || { x: 100, y: 100 },
      size: getDefaultSize(type)
    };

    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
  }, []);

  const updateElement = useCallback((elementId: string, updates: Partial<InteractiveElement>) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ));
    
    if (selectedElement?.id === elementId) {
      setSelectedElement(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedElement]);

  const removeElement = useCallback((elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  }, [selectedElement]);

  const duplicateElement = useCallback((elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const newElement: InteractiveElement = {
      ...element,
      id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20
      }
    };

    setElements(prev => [...prev, newElement]);
  }, [elements]);

  const clearElements = useCallback(() => {
    setElements([]);
    setSelectedElement(null);
  }, []);

  return {
    elements,
    selectedElement,
    draggedElement,
    setElements,
    setSelectedElement,
    setDraggedElement,
    addElement,
    updateElement,
    removeElement,
    duplicateElement,
    clearElements
  };
}

function getDefaultConfig(type: string): Record<string, any> {
  switch (type) {
    case 'button':
      return {
        label: 'Click Me',
        action: 'alert',
        actionData: { message: 'Button clicked!' }
      };
    case 'input':
      return {
        placeholder: 'Enter text here...',
        type: 'text',
        required: false
      };
    case 'slider':
      return {
        min: 0,
        max: 100,
        value: 50,
        step: 1,
        label: 'Value'
      };
    case 'quiz':
      return {
        question: 'Sample question?',
        type: 'multiple-choice',
        options: ['Option A', 'Option B', 'Option C'],
        correctAnswer: 0
      };
    case 'simulation':
      return {
        type: 'physics',
        parameters: {},
        controls: []
      };
    case 'drawing':
      return {
        tools: ['pen', 'eraser', 'shapes'],
        colors: ['black', 'red', 'blue', 'green'],
        background: 'white'
      };
    case 'calculator':
      return {
        type: 'basic',
        functions: ['basic', 'scientific'],
        precision: 2
      };
    default:
      return {};
  }
}

function getDefaultSize(type: string): { width: number; height: number } {
  switch (type) {
    case 'button':
      return { width: 120, height: 40 };
    case 'input':
      return { width: 200, height: 40 };
    case 'slider':
      return { width: 200, height: 60 };
    case 'quiz':
      return { width: 300, height: 200 };
    case 'simulation':
      return { width: 400, height: 300 };
    case 'drawing':
      return { width: 400, height: 300 };
    case 'calculator':
      return { width: 250, height: 350 };
    default:
      return { width: 200, height: 100 };
  }
}