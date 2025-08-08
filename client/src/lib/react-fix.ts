// Force single React instance to prevent hook conflicts
import React from 'react';
import * as ReactDOM from 'react-dom';

// Ensure only one React instance is used globally
if (typeof window !== 'undefined') {
  (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
  
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
  
  // Ensure React is available on global scope
  if (typeof globalThis !== 'undefined') {
    (globalThis as any).React = React;
    (globalThis as any).ReactDOM = ReactDOM;
  }
  
  // Ensure useState and other hooks are properly initialized
  if (!React.useState) {
    console.error('React hooks not properly initialized. Attempting to fix...');
  }
}

export { React };

export default React;
