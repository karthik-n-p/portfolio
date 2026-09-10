/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        enric: {
          red:    '#E8342A',
          black:  '#171717',
          gray:   '#5C5C5C',
          muted:  '#A3A3A3',
          border: '#E0E0E0',
          card:   '#F7F7F7',
          canvas: '#FFFFFF',
          dark:   '#141414',
        },
      },
      fontFamily: {
        notch:       ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        headline:    ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans:        ['"Inter"', 'system-ui', 'sans-serif'],
        editorial:   ['"Playfair Display"', 'Georgia', 'serif'],
        cinzel:      ['"Cinzel"', 'serif'],
        handwriting: ['"Gloria Hallelujah"', 'cursive'],
        mono:        ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'marquee-left':  'marqueeLeft 35s linear infinite',
        'marquee-right': 'marqueeRight 35s linear infinite',
        'spin-slow':     'spin 12s linear infinite',
      },
      keyframes: {
        marqueeLeft: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRight: {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
}
