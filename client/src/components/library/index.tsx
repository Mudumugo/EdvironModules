export * from './LibraryHeader';
export * from './LibrarySearchFilters';
export * from './PrimaryLayout';
export * from './SecondaryLayout';
export * from './LibraryResourceTypes';

// Layout configuration
export function getLayoutConfig(gradeLevel: string) {
  const configs = {
    primary: {
      title: "My Learning Library",
      showAdvancedFilters: false,
      columns: 2,
      cardSize: "large",
      showCategories: true,
      colorScheme: "playful"
    },
    secondary: {
      title: "Digital Library",
      showAdvancedFilters: true,
      columns: 3,
      cardSize: "medium",
      showCategories: true,
      colorScheme: "professional"
    },
    teacher: {
      title: "Teaching Resources",
      showAdvancedFilters: true,
      columns: 4,
      cardSize: "compact",
      showCategories: true,
      colorScheme: "professional"
    }
  };
  
  return configs[gradeLevel as keyof typeof configs] || configs.secondary;
}