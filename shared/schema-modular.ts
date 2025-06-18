// Modular schema system - Re-export from domain-specific modules
export * from "./schemas/core";
export * from "./schemas/users"; 
export * from "./schemas/library";

// Import additional schemas that haven't been modularized yet
export * from "./schema";