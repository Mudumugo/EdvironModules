// Main export file for page generators
export * from './types';
export { useInteractiveElements } from './useInteractiveElements';
export { useScienceExperiments } from './useScienceExperiments';
export { usePageGeneration } from './usePageGeneration';

// Re-export legacy hooks for backward compatibility
export { useInteractivePageGenerator } from '../useInteractivePageGenerator';
export { useSciencePageGenerator } from '../useSciencePageGenerator';
export { usePageGenerators } from '../usePageGenerators';