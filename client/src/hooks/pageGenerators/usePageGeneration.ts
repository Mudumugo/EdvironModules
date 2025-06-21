import { useState, useCallback } from 'react';
import { GeneratedPage, InteractivePage, ScienceExperiment } from './types';
import { useInteractiveElements } from './useInteractiveElements';
import { useScienceExperiments } from './useScienceExperiments';

export function usePageGeneration() {
  const [generatedPages, setGeneratedPages] = useState<GeneratedPage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPage, setSelectedPage] = useState<GeneratedPage | null>(null);

  const interactiveElements = useInteractiveElements();
  const scienceExperiments = useScienceExperiments();

  const generateInteractivePage = useCallback(async (
    subject: string, 
    grade: string, 
    topic: string, 
    difficulty: string
  ) => {
    setIsGenerating(true);
    
    try {
      const interactivePage: InteractivePage = {
        id: `page_${Date.now()}`,
        title: `Interactive ${subject}: ${topic}`,
        subject,
        grade,
        elements: [],
        background: 'white',
        theme: 'default'
      };

      const page: GeneratedPage = {
        id: interactivePage.id,
        type: 'interactive',
        title: interactivePage.title,
        content: interactivePage,
        metadata: {
          subject,
          grade,
          difficulty,
          estimatedTime: calculateEstimatedTime(difficulty, 'interactive'),
          tags: [subject.toLowerCase(), grade.toLowerCase(), 'interactive']
        }
      };

      setGeneratedPages(prev => [...prev, page]);
      setSelectedPage(page);
    } catch (error) {
      console.error('Failed to generate interactive page:', error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateSciencePage = useCallback(async (
    subject: string, 
    grade: string, 
    topic: string, 
    difficulty: string
  ) => {
    setIsGenerating(true);
    
    try {
      await scienceExperiments.generateExperiment(subject, grade, topic);
      
      if (scienceExperiments.selectedExperiment) {
        const page: GeneratedPage = {
          id: `page_${Date.now()}`,
          type: 'science',
          title: scienceExperiments.selectedExperiment.title,
          content: scienceExperiments.selectedExperiment,
          metadata: {
            subject,
            grade,
            difficulty,
            estimatedTime: calculateEstimatedTime(difficulty, 'science'),
            tags: [subject.toLowerCase(), grade.toLowerCase(), 'experiment', 'science']
          }
        };

        setGeneratedPages(prev => [...prev, page]);
        setSelectedPage(page);
      }
    } catch (error) {
      console.error('Failed to generate science page:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [scienceExperiments]);

  const generateWorksheetPage = useCallback(async (
    subject: string, 
    grade: string, 
    topic: string, 
    difficulty: string
  ) => {
    setIsGenerating(true);
    
    try {
      const worksheet = generateWorksheetContent(subject, grade, topic, difficulty);
      
      const page: GeneratedPage = {
        id: `page_${Date.now()}`,
        type: 'worksheet',
        title: `${subject} Worksheet: ${topic}`,
        content: worksheet,
        metadata: {
          subject,
          grade,
          difficulty,
          estimatedTime: calculateEstimatedTime(difficulty, 'worksheet'),
          tags: [subject.toLowerCase(), grade.toLowerCase(), 'worksheet', 'practice']
        }
      };

      setGeneratedPages(prev => [...prev, page]);
      setSelectedPage(page);
    } catch (error) {
      console.error('Failed to generate worksheet page:', error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const updatePage = useCallback((pageId: string, updates: Partial<GeneratedPage>) => {
    setGeneratedPages(prev => prev.map(page => 
      page.id === pageId ? { ...page, ...updates } : page
    ));
    
    if (selectedPage?.id === pageId) {
      setSelectedPage(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedPage]);

  const removePage = useCallback((pageId: string) => {
    setGeneratedPages(prev => prev.filter(page => page.id !== pageId));
    if (selectedPage?.id === pageId) {
      setSelectedPage(null);
    }
  }, [selectedPage]);

  const exportPage = useCallback((pageId: string, format: 'pdf' | 'html' | 'json') => {
    const page = generatedPages.find(p => p.id === pageId);
    if (!page) return;

    // Implementation would depend on the export format
    console.log(`Exporting page ${pageId} as ${format}`, page);
  }, [generatedPages]);

  return {
    generatedPages,
    selectedPage,
    isGenerating,
    interactiveElements,
    scienceExperiments,
    setSelectedPage,
    generateInteractivePage,
    generateSciencePage,
    generateWorksheetPage,
    updatePage,
    removePage,
    exportPage
  };
}

function calculateEstimatedTime(difficulty: string, type: string): string {
  const baseTime = {
    'interactive': 15,
    'science': 30,
    'worksheet': 20,
    'assessment': 25
  }[type] || 20;

  const difficultyMultiplier = {
    'easy': 0.8,
    'medium': 1.0,
    'hard': 1.3,
    'advanced': 1.6
  }[difficulty.toLowerCase()] || 1.0;

  const estimatedMinutes = Math.round(baseTime * difficultyMultiplier);
  return `${estimatedMinutes} minutes`;
}

function generateWorksheetContent(subject: string, grade: string, topic: string, difficulty: string) {
  // This would typically use templates or AI generation
  // For now, returning a basic structure
  
  return {
    title: `${subject} Worksheet: ${topic}`,
    instructions: `Complete the following exercises on ${topic}.`,
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: `Sample ${subject} question about ${topic}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0
      },
      {
        id: 2,
        type: 'short-answer',
        question: `Explain the concept of ${topic} in your own words.`,
        expectedLength: 'paragraph'
      },
      {
        id: 3,
        type: 'problem-solving',
        question: `Solve this ${topic} problem step by step.`,
        showWork: true
      }
    ],
    answer_key: {
      1: 'Option A',
      2: 'Sample explanation would go here',
      3: 'Step-by-step solution would be provided'
    }
  };
}