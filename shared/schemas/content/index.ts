// Re-export all content schemas
export * from './library';
export * from './notebooks';

// Legacy compatibility exports for main schema
export { 
  libraryCategories,
  librarySubjects, 
  libraryItems,
  insertLibraryCategorySchema,
  insertLibrarySubjectSchema,
  insertLibraryItemSchema
} from './library';

export {
  notebooks,
  notebookSections,
  notebookPages,
  lockerItems,
  insertNotebookSchema,
  insertNotebookSectionSchema,
  insertNotebookPageSchema,
  insertLockerItemSchema
} from './notebooks';