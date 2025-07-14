import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Performance-optimized Vite configuration
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh for development
      fastRefresh: true,
      // Optimize JSX compilation
      jsxImportSource: undefined,
      babel: {
        plugins: [
          // Remove PropTypes in production
          process.env.NODE_ENV === 'production' && 'babel-plugin-transform-remove-prop-types'
        ].filter(Boolean)
      }
    })
  ],
  
  // Path aliases for cleaner imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'client/src'),
      '@shared': resolve(__dirname, 'shared'),
      '@assets': resolve(__dirname, 'attached_assets')
    }
  },
  
  // Build optimizations
  build: {
    // Enable source maps for debugging
    sourcemap: process.env.NODE_ENV === 'development',
    
    // Optimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true
      }
    },
    
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['@radix-ui/react-tabs', '@radix-ui/react-dialog', '@radix-ui/react-tooltip'],
          'vendor-icons': ['lucide-react', 'react-icons'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers'],
          
          // App chunks
          'dashboard': [
            'client/src/pages/StudentDashboard',
            'client/src/pages/TeacherDashboard', 
            'client/src/pages/AdminDashboard'
          ],
          'auth': [
            'client/src/pages/Login',
            'client/src/pages/SignUp'
          ],
          'library': [
            'client/src/pages/DigitalLibrary',
            'client/src/pages/DigitalLibraryNew'
          ]
        },
        
        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name.includes('vendor')) {
            return 'vendor/[name]-[hash].js';
          }
          return 'chunks/[name]-[hash].js';
        },
        
        // Optimize asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/\.(png|jpe?g|gif|svg|ico)$/i.test(assetInfo.name)) {
            return 'images/[name]-[hash].[ext]';
          }
          if (/\.(woff2?|ttf|eot)$/i.test(assetInfo.name)) {
            return 'fonts/[name]-[hash].[ext]';
          }
          if (ext === 'css') {
            return 'styles/[name]-[hash].[ext]';
          }
          
          return 'assets/[name]-[hash].[ext]';
        }
      }
    },
    
    // Target modern browsers for better performance
    target: 'es2020',
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000
  },
  
  // Development server optimizations
  server: {
    // Enable HMR
    hmr: true,
    
    // Optimize file watching
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/dist/**']
    }
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'wouter',
      '@tanstack/react-query',
      'lucide-react'
    ],
    exclude: [
      // Exclude large dependencies that don't need pre-bundling
    ]
  },
  
  // CSS optimization
  css: {
    // Enable CSS code splitting
    devSourcemap: true,
    
    // PostCSS configuration
    postcss: {
      plugins: [
        // Autoprefixer for browser compatibility
        require('autoprefixer'),
        
        // Remove unused CSS in production
        ...(process.env.NODE_ENV === 'production' ? [
          require('@fullhuman/postcss-purgecss')({
            content: ['./client/src/**/*.{js,jsx,ts,tsx}', './client/index.html'],
            safelist: [
              // Safelist classes that might be added dynamically
              /^theme-/,
              /^dark:/,
              /^hover:/,
              /^focus:/,
              /^active:/
            ]
          })
        ] : [])
      ]
    }
  },
  
  // Performance monitoring
  define: {
    __DEV__: process.env.NODE_ENV === 'development',
    __PERFORMANCE_MONITORING__: true
  }
});