// Re-export from modular page generators
export * from './pageGenerators/types';
export { useInteractiveElements } from './pageGenerators/useInteractiveElements';
export { useScienceExperiments } from './pageGenerators/useScienceExperiments';
export { usePageGeneration } from './pageGenerators/usePageGeneration';

// Legacy compatibility wrapper
export function usePageGenerators() {
  const pageGeneration = usePageGeneration();
  
  return {
    // Interactive page generation
    interactive: {
      ...pageGeneration.interactiveElements,
      generatePage: pageGeneration.generateInteractivePage
    },
    
    // Science experiment generation
    science: {
      ...pageGeneration.scienceExperiments,
      generatePage: pageGeneration.generateSciencePage
    },
    
    // Worksheet generation
    worksheet: {
      generatePage: pageGeneration.generateWorksheetPage
    },
    
    // General page management
    pages: pageGeneration.generatedPages,
    selectedPage: pageGeneration.selectedPage,
    isGenerating: pageGeneration.isGenerating,
    setSelectedPage: pageGeneration.setSelectedPage,
    updatePage: pageGeneration.updatePage,
    removePage: pageGeneration.removePage,
    exportPage: pageGeneration.exportPage
  };
}