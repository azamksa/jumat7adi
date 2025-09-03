import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    compression()
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'game': [
            './src/components/QuestionPage.jsx',
            './src/components/AnswerPage.jsx',
            './src/components/QuestionsListPage.jsx'
          ]
        }
      }
    },
    sourcemap: false
  }
})
