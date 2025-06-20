// Main exports for the book-viewer module
export * from "./types";
export * from "./utils";
export * from "./converters";
export * from "./mediaAssets";
export * from "./pageGenerators";
export * from "./worksheetGenerators";

// Re-export the main functions for backward compatibility
export { 
  shouldUseBookViewer, 
  shouldUseWorksheetViewer,
  convertResourceToBookConfig,
  convertResourceToWorksheetConfig
} from "./utils";
export { convertResourceToBookConfig as default } from "./converters";