import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/ },
            { name: 'chakra', test: /node_modules[\\/](@chakra-ui|@ark-ui|@zag-js|@emotion|@pandacss)[\\/]/ },
            { name: 'data', test: /node_modules[\\/](@tanstack|axios|mobx|mobx-react-lite|mobx-persist-store)[\\/]/ },
            { name: 'i18n', test: /node_modules[\\/](i18next|react-i18next|i18next-browser-languagedetector)[\\/]/ },
          ],
        },
      },
    },
  },
})
