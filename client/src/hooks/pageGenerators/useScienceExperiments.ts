import { useState, useCallback } from 'react';
import { ScienceExperiment, SCIENCE_SUBJECTS, GRADE_LEVELS } from './types';

export function useScienceExperiments() {
  const [experiments, setExperiments] = useState<ScienceExperiment[]>([]);
  const [selectedExperiment, setSelectedExperiment] = useState<ScienceExperiment | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateExperiment = useCallback(async (subject: string, grade: string, topic?: string) => {
    setIsGenerating(true);
    
    try {
      // Simulate experiment generation based on subject and grade
      const newExperiment = await createExperimentTemplate(subject, grade, topic);
      setExperiments(prev => [...prev, newExperiment]);
      setSelectedExperiment(newExperiment);
    } catch (error) {
      console.error('Failed to generate experiment:', error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const updateExperiment = useCallback((experimentId: string, updates: Partial<ScienceExperiment>) => {
    setExperiments(prev => prev.map(exp => 
      exp.id === experimentId ? { ...exp, ...updates } : exp
    ));
    
    if (selectedExperiment?.id === experimentId) {
      setSelectedExperiment(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedExperiment]);

  const removeExperiment = useCallback((experimentId: string) => {
    setExperiments(prev => prev.filter(exp => exp.id !== experimentId));
    if (selectedExperiment?.id === experimentId) {
      setSelectedExperiment(null);
    }
  }, [selectedExperiment]);

  const duplicateExperiment = useCallback((experimentId: string) => {
    const experiment = experiments.find(exp => exp.id === experimentId);
    if (!experiment) return;

    const newExperiment: ScienceExperiment = {
      ...experiment,
      id: `experiment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `${experiment.title} (Copy)`
    };

    setExperiments(prev => [...prev, newExperiment]);
  }, [experiments]);

  return {
    experiments,
    selectedExperiment,
    isGenerating,
    setSelectedExperiment,
    generateExperiment,
    updateExperiment,
    removeExperiment,
    duplicateExperiment
  };
}

async function createExperimentTemplate(subject: string, grade: string, topic?: string): Promise<ScienceExperiment> {
  // This would typically call an API or use a template system
  // For now, returning a template based on subject
  
  const experimentTemplates = {
    'Physics': {
      title: topic || 'Simple Pendulum Motion',
      description: 'Investigate the relationship between pendulum length and period of oscillation.',
      materials: [
        'String or fishing line (1 meter)',
        'Various small masses (washers, coins)',
        'Stopwatch',
        'Ruler or measuring tape',
        'Support stand or hook'
      ],
      steps: [
        'Set up the pendulum with a 50cm string length',
        'Attach a small mass to the end of the string',
        'Pull the mass to a small angle (less than 15 degrees)',
        'Release and time 10 complete oscillations',
        'Calculate the period (total time ÷ 10)',
        'Repeat with different string lengths',
        'Record all measurements in a data table'
      ],
      safetyNotes: [
        'Keep the pendulum angle small to avoid hitting objects',
        'Ensure the support is stable and secure',
        'Be careful not to get hit by the swinging mass'
      ],
      expectedResults: 'Longer pendulums will have longer periods of oscillation.',
      explanation: 'The period of a simple pendulum depends on its length and gravity, following the formula T = 2π√(L/g).',
      variations: [
        'Test different masses to see if mass affects the period',
        'Try different starting angles',
        'Use different materials for the pendulum bob'
      ]
    },
    'Chemistry': {
      title: topic || 'Acid-Base Indicator Reactions',
      description: 'Observe color changes when natural indicators are mixed with acids and bases.',
      materials: [
        'Red cabbage leaves',
        'Hot water',
        'Clear containers',
        'Household acids (lemon juice, vinegar)',
        'Household bases (baking soda solution, soap)',
        'Dropper or spoon'
      ],
      steps: [
        'Boil red cabbage leaves in water for 10 minutes',
        'Strain the purple liquid (this is your indicator)',
        'Pour small amounts into separate containers',
        'Add a few drops of lemon juice to one container',
        'Add baking soda solution to another container',
        'Observe and record color changes',
        'Test other household substances'
      ],
      safetyNotes: [
        'Adult supervision required when using hot water',
        'Do not taste any solutions',
        'Wash hands thoroughly after the experiment'
      ],
      expectedResults: 'The indicator will turn red/pink with acids and green/blue with bases.',
      explanation: 'Natural indicators contain anthocyanins that change color depending on pH levels.',
      variations: [
        'Try other natural indicators like turmeric or beetroot',
        'Test the pH of various household items',
        'Create a pH color chart'
      ]
    },
    'Biology': {
      title: topic || 'Plant Phototropism Investigation',
      description: 'Observe how plants grow toward light sources.',
      materials: [
        'Small potted plants or seedlings',
        'Cardboard box',
        'Scissors or knife',
        'Tape',
        'Ruler',
        'Camera (optional)'
      ],
      steps: [
        'Cut a small hole in one side of the cardboard box',
        'Place the plant inside the box',
        'Position the box so the hole faces a light source',
        'Seal the box except for the hole',
        'Observe the plant daily for one week',
        'Measure and record the direction of growth',
        'Take photos to document changes'
      ],
      safetyNotes: [
        'Ensure the plant gets adequate light through the hole',
        'Water the plant as needed',
        'Use care when cutting the cardboard'
      ],
      expectedResults: 'The plant will bend and grow toward the light source.',
      explanation: 'Plants exhibit phototropism, growing toward light due to auxin hormone distribution.',
      variations: [
        'Try different colored lights',
        'Test with multiple light sources',
        'Compare with a control plant in normal lighting'
      ]
    }
  };

  const template = experimentTemplates[subject as keyof typeof experimentTemplates] || experimentTemplates['Physics'];
  
  return {
    id: `experiment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    subject,
    grade,
    ...template
  };
}