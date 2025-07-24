// Force single React instance to prevent hook conflicts
import * as React from 'react';

// Ensure only one React instance is used
if (typeof window !== 'undefined') {
  (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
  
  // Override React to prevent multiple instances
  if (!(window as any).React) {
    (window as any).React = React;
  }
}

export default React;