/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base:     '#0A0A0F',
        surface:  '#111118',
        elevated: '#18181F',
        card:     '#1E1E26',
        border:   '#2A2A35',
        accent:   '#6366F1',
        emerald:  '#34D399',
        violet:   '#8B5CF6',
        amber:    '#FBBF24',
        rose:     '#FB7185',
        text: {
          primary:   '#EDEDED',
          secondary: '#A1A1AA',
          dim:       '#52525B',
          muted:     '#71717A',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
