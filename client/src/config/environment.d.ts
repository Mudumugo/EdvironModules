/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUILD_TYPE: 'global' | 'tenant' | 'development'
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}