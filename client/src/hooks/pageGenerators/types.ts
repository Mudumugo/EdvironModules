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

export interface ScienceExperiment {
  id: string;
  title: string;
  subject: string;
  grade: string;
  description: string;
  materials: string[];
  steps: string[];
  safetyNotes: string[];
  expectedResults: string;
  explanation: string;
  variations: string[];
}

export interface GeneratedPage {
  id: string;
  type: 'interactive' | 'science' | 'worksheet' | 'assessment';
  title: string;
  content: any;
  metadata: {
    subject: string;
    grade: string;
    difficulty: string;
    estimatedTime: string;
    tags: string[];
  };
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
    description: 'Interactive simulation or model'
  },
  { 
    type: 'drawing', 
    name: 'Drawing Canvas', 
    icon: 'Pencil',
    description: 'Drawing and annotation tool'
  },
  { 
    type: 'calculator', 
    name: 'Calculator', 
    icon: 'Calculator',
    description: 'Mathematical calculator widget'
  }
];

export const SCIENCE_SUBJECTS = [
  'Physics',
  'Chemistry', 
  'Biology',
  'Earth Science',
  'Environmental Science',
  'Astronomy'
];

export const GRADE_LEVELS = [
  'Elementary (K-5)',
  'Middle School (6-8)', 
  'High School (9-12)',
  'Advanced (College Level)'
];