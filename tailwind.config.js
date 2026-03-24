/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#050a0e',
        surface: '#0a1520',
        border: '#0d2a3a',
        cyan: {
          DEFAULT: '#00d4ff',
          dim: '#0088cc',
          muted: '#004466',
        },
        text: {
          primary: '#e8f4f8',
          secondary: '#7ab3cc',
          dim: '#3d6b7a',
        },
        node: {
          hub: '#00d4ff',
          pipeline: '#0af5a0',
          projects: '#8b5cf6',
          skills: '#f59e0b',
          certs: '#f43f5e',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
