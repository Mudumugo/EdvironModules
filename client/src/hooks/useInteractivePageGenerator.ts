import { useState } from "react";

export interface InteractiveElement {
  id: string;
  type: 'button' | 'input' | 'slider' | 'quiz' | 'simulation' | 'drawing' | 'calculator';
  title: string;
  description?: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface InteractivePage {
  id: string;
  title: string;
  subject: string;
  grade: string;
  elements: InteractiveElement[];
  background: string;
  theme: string;
}

export const INTERACTIVE_ELEMENT_TYPES = [
  { 
    type: 'button', 
    name: 'Interactive Button', 
    icon: 'MousePointer',
    description: 'Clickable button that triggers actions'
  },
  { 
    type: 'input', 
    name: 'Text Input', 
    icon: 'Type',
    description: 'Input field for user text entry'
  },
  { 
    type: 'slider', 
    name: 'Value Slider', 
    icon: 'Sliders',
    description: 'Slider for adjusting numeric values'
  },
  { 
    type: 'quiz', 
    name: 'Quiz Question', 
    icon: 'HelpCircle',
    description: 'Multiple choice or fill-in question'
  },
  { 
    type: 'simulation', 
    name: 'Simulation', 
    icon: 'Cpu',
    description: 'Interactive simulation or experiment'
  },
  { 
    type: 'drawing', 
    name: 'Drawing Canvas', 
    icon: 'Brush',
    description: 'Canvas for drawing and sketching'
  },
  { 
    type: 'calculator', 
    name: 'Calculator', 
    icon: 'Calculator',
    description: 'Interactive calculator widget'
  }
];

export const PAGE_THEMES = [
  { id: 'light', name: 'Light', background: '#ffffff', accent: '#3b82f6' },
  { id: 'dark', name: 'Dark', background: '#1f2937', accent: '#60a5fa' },
  { id: 'science', name: 'Science', background: '#e0f2fe', accent: '#0277bd' },
  { id: 'math', name: 'Mathematics', background: '#f3e5f5', accent: '#7b1fa2' },
  { id: 'nature', name: 'Nature', background: '#e8f5e8', accent: '#2e7d32' }
];

export function useInteractivePageGenerator() {
  const [page, setPage] = useState<InteractivePage>({
    id: '',
    title: '',
    subject: '',
    grade: '',
    elements: [],
    background: '#ffffff',
    theme: 'light'
  });
  
  const [selectedElement, setSelectedElement] = useState<InteractiveElement | null>(null);
  const [draggedElement, setDraggedElement] = useState<InteractiveElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState<string>('');

  const updatePage = (updates: Partial<InteractivePage>) => {
    setPage(prev => ({ ...prev, ...updates }));
  };

  const addElement = (type: InteractiveElement['type'], position: { x: number; y: number }) => {
    const newElement: InteractiveElement = {
      id: `element_${Date.now()}`,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Element`,
      position,
      size: { width: 200, height: 100 },
      config: getDefaultConfig(type)
    };
    
    setPage(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
  };

  const updateElement = (elementId: string, updates: Partial<InteractiveElement>) => {
    setPage(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      )
    }));
  };

  const removeElement = (elementId: string) => {
    setPage(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId)
    }));
    
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  const duplicateElement = (elementId: string) => {
    const element = page.elements.find(el => el.id === elementId);
    if (element) {
      const newElement: InteractiveElement = {
        ...element,
        id: `element_${Date.now()}`,
        title: `${element.title} (Copy)`,
        position: { 
          x: element.position.x + 20, 
          y: element.position.y + 20 
        }
      };
      
      setPage(prev => ({
        ...prev,
        elements: [...prev.elements, newElement]
      }));
    }
  };

  const moveElement = (elementId: string, position: { x: number; y: number }) => {
    updateElement(elementId, { position });
  };

  const resizeElement = (elementId: string, size: { width: number; height: number }) => {
    updateElement(elementId, { size });
  };

  const generateInteractivePage = () => {
    setIsGenerating(true);
    
    try {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background: ${page.background};
      min-height: 100vh;
      position: relative;
      overflow-x: auto;
    }
    .page-container {
      position: relative;
      min-height: 600px;
      background: ${page.background};
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .page-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #1f2937;
      text-align: center;
    }
    .page-info {
      text-align: center;
      color: #6b7280;
      margin-bottom: 30px;
    }
    .interactive-element {
      position: absolute;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      background: white;
      padding: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }
    .interactive-element:hover {
      border-color: #3b82f6;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .element-title {
      font-weight: 600;
      margin-bottom: 8px;
      color: #374151;
    }
    .element-button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    .element-button:hover {
      background: #2563eb;
    }
    .element-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
    }
    .element-slider {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #e5e7eb;
      outline: none;
      cursor: pointer;
    }
    .quiz-option {
      display: block;
      margin: 5px 0;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    .quiz-option:hover {
      background: #f3f4f6;
    }
    .drawing-canvas {
      border: 2px dashed #d1d5db;
      border-radius: 6px;
      background: #f9fafb;
      width: 100%;
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      cursor: pointer;
    }
    .calculator-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 5px;
      margin-top: 10px;
    }
    .calc-button {
      padding: 10px;
      border: 1px solid #d1d5db;
      background: #f9fafb;
      border-radius: 4px;
      cursor: pointer;
      text-align: center;
      font-weight: 500;
    }
    .calc-button:hover {
      background: #f3f4f6;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <h1 class="page-title">${page.title}</h1>
    <div class="page-info">${page.subject} - Grade ${page.grade}</div>
    
    ${page.elements.map(element => generateElementHTML(element)).join('')}
  </div>

  <script>
    // Interactive functionality
    function handleButtonClick(elementId) {
      alert('Button clicked: ' + elementId);
    }
    
    function handleSliderChange(elementId, value) {
      console.log('Slider changed:', elementId, value);
      document.getElementById(elementId + '_value').textContent = value;
    }
    
    function handleQuizAnswer(elementId, answer) {
      const feedback = document.getElementById(elementId + '_feedback');
      feedback.textContent = 'Answer selected: ' + answer;
      feedback.style.display = 'block';
    }
    
    function initializeDrawingCanvas(elementId) {
      const canvas = document.getElementById(elementId + '_canvas');
      canvas.addEventListener('click', function() {
        this.innerHTML = '<div style="color: #3b82f6;">Click to start drawing!</div>';
      });
    }
    
    function calculateResult(operation) {
      const display = document.getElementById('calc_display');
      if (operation === '=') {
        try {
          display.value = eval(display.value.replace(/[^0-9+\\-*/().]/g, ''));
        } catch (e) {
          display.value = 'Error';
        }
      } else if (operation === 'C') {
        display.value = '';
      } else {
        display.value += operation;
      }
    }
    
    // Initialize all interactive elements
    document.addEventListener('DOMContentLoaded', function() {
      ${page.elements.filter(el => el.type === 'drawing').map(el => 
        `initializeDrawingCanvas('${el.id}');`
      ).join('\n      ')}
    });
  </script>
</body>
</html>`;

      setGeneratedHTML(html);
      return html;
    } finally {
      setIsGenerating(false);
    }
  };

  const resetPage = () => {
    setPage({
      id: '',
      title: '',
      subject: '',
      grade: '',
      elements: [],
      background: '#ffffff',
      theme: 'light'
    });
    setSelectedElement(null);
    setGeneratedHTML('');
  };

  return {
    page,
    selectedElement,
    draggedElement,
    isGenerating,
    generatedHTML,
    elementTypes: INTERACTIVE_ELEMENT_TYPES,
    themes: PAGE_THEMES,
    
    // Actions
    updatePage,
    addElement,
    updateElement,
    removeElement,
    duplicateElement,
    moveElement,
    resizeElement,
    setSelectedElement,
    setDraggedElement,
    generateInteractivePage,
    resetPage,
    
    // Computed
    hasElements: page.elements.length > 0,
    elementCount: page.elements.length,
  };
}

function getDefaultConfig(type: InteractiveElement['type']): Record<string, any> {
  switch (type) {
    case 'button':
      return { text: 'Click Me', action: 'alert' };
    case 'input':
      return { placeholder: 'Enter text...', type: 'text' };
    case 'slider':
      return { min: 0, max: 100, value: 50, step: 1 };
    case 'quiz':
      return { 
        question: 'What is 2 + 2?', 
        options: ['3', '4', '5', '6'], 
        correct: 1 
      };
    case 'simulation':
      return { type: 'pendulum', speed: 1 };
    case 'drawing':
      return { tools: ['pen', 'eraser'], colors: ['#000000', '#ff0000', '#00ff00', '#0000ff'] };
    case 'calculator':
      return { type: 'basic', precision: 2 };
    default:
      return {};
  }
}

function generateElementHTML(element: InteractiveElement): string {
  const style = `left: ${element.position.x}px; top: ${element.position.y}px; width: ${element.size.width}px; min-height: ${element.size.height}px;`;
  
  let content = '';
  
  switch (element.type) {
    case 'button':
      content = `
        <div class="element-title">${element.title}</div>
        <button class="element-button" onclick="handleButtonClick('${element.id}')">
          ${element.config.text || 'Click Me'}
        </button>
      `;
      break;
    
    case 'input':
      content = `
        <div class="element-title">${element.title}</div>
        <input class="element-input" type="${element.config.type || 'text'}" 
               placeholder="${element.config.placeholder || 'Enter text...'}" />
      `;
      break;
    
    case 'slider':
      content = `
        <div class="element-title">${element.title}</div>
        <input type="range" class="element-slider" 
               min="${element.config.min || 0}" 
               max="${element.config.max || 100}" 
               value="${element.config.value || 50}"
               step="${element.config.step || 1}"
               onchange="handleSliderChange('${element.id}', this.value)" />
        <div>Value: <span id="${element.id}_value">${element.config.value || 50}</span></div>
      `;
      break;
    
    case 'quiz':
      content = `
        <div class="element-title">${element.config.question || 'Quiz Question'}</div>
        ${(element.config.options || []).map((option: string, index: number) => `
          <label class="quiz-option">
            <input type="radio" name="${element.id}_quiz" value="${option}"
                   onchange="handleQuizAnswer('${element.id}', '${option}')" />
            ${option}
          </label>
        `).join('')}
        <div id="${element.id}_feedback" style="display: none; margin-top: 10px; color: #3b82f6;"></div>
      `;
      break;
    
    case 'drawing':
      content = `
        <div class="element-title">${element.title}</div>
        <div class="drawing-canvas" id="${element.id}_canvas">
          Click to start drawing
        </div>
      `;
      break;
    
    case 'calculator':
      content = `
        <div class="element-title">${element.title}</div>
        <input type="text" id="calc_display" readonly style="width: 100%; margin-bottom: 10px; padding: 8px; text-align: right;" />
        <div class="calculator-grid">
          <div class="calc-button" onclick="calculateResult('C')">C</div>
          <div class="calc-button" onclick="calculateResult('/')">/</div>
          <div class="calc-button" onclick="calculateResult('*')">*</div>
          <div class="calc-button" onclick="calculateResult('-')">-</div>
          <div class="calc-button" onclick="calculateResult('7')">7</div>
          <div class="calc-button" onclick="calculateResult('8')">8</div>
          <div class="calc-button" onclick="calculateResult('9')">9</div>
          <div class="calc-button" onclick="calculateResult('+')">+</div>
          <div class="calc-button" onclick="calculateResult('4')">4</div>
          <div class="calc-button" onclick="calculateResult('5')">5</div>
          <div class="calc-button" onclick="calculateResult('6')">6</div>
          <div class="calc-button" onclick="calculateResult('=')" style="grid-row: span 2;">=</div>
          <div class="calc-button" onclick="calculateResult('1')">1</div>
          <div class="calc-button" onclick="calculateResult('2')">2</div>
          <div class="calc-button" onclick="calculateResult('3')">3</div>
          <div class="calc-button" onclick="calculateResult('0')" style="grid-column: span 2;">0</div>
          <div class="calc-button" onclick="calculateResult('.')">.</div>
        </div>
      `;
      break;
    
    default:
      content = `<div class="element-title">${element.title}</div><div>Interactive element</div>`;
  }
  
  return `<div class="interactive-element" style="${style}">${content}</div>`;
}