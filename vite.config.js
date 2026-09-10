import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import cloudinaryPhotosPlugin from './vite-plugin-cloudinary.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      cloudinaryPhotosPlugin({
        cloudName: env.VITE_CLOUDINARY_CLOUD_NAME || 'ddmfpkfce',
        apiKey: env.VITE_CLOUDINARY_API_KEY || '664168187261325',
        apiSecret: env.VITE_CLOUDINARY_API_SECRET || '8rrx-pYJ8cf2Hi6217SIhmGquDc',
        folder: env.VITE_CLOUDINARY_FOLDER || 'portfolio',
      }),
    ],
    optimizeDeps: {
      include: ['three'],
    },
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
          },
        },
      },
    },
  }
})

