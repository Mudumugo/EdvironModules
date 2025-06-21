// Re-export from modular page generators
export * from './pageGenerators/types';
export { useScienceExperiments } from './pageGenerators/useScienceExperiments';
export { usePageGeneration } from './pageGenerators/usePageGeneration';

// Legacy compatibility wrapper
export function useSciencePageGenerator() {
  const pageGeneration = usePageGeneration();
  
  return {
    ...pageGeneration.scienceExperiments,
    generatePage: pageGeneration.generateSciencePage,
    isGenerating: pageGeneration.isGenerating
  };
}