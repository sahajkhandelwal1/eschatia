/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E2C47A',
          dark: '#A07A2C',
        },
        space: {
          950: '#040408',
          900: '#080B12',
          800: '#0D1117',
          700: '#131924',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.3em',
        'ultra-wide': '0.5em',
      },
      animation: {
        twinkle: 'twinkle var(--duration, 3s) ease-in-out infinite var(--delay, 0s)',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 'var(--min-opacity, 0.2)' },
          '50%': { opacity: 'var(--max-opacity, 1)' },
        },
      },
    },
  },
  plugins: [],
};
