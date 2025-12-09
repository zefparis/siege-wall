/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          DEFAULT: '#00FFD1',
          dark: '#00B894',
          glow: 'rgba(0, 255, 209, 0.5)',
        },
        danger: {
          DEFAULT: '#FF4757',
          dark: '#C0392B',
          glow: 'rgba(255, 71, 87, 0.5)',
        },
        bg: {
          primary: '#0A0A0F',
          secondary: '#12121A',
          card: '#1A1A25',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#8B8B9A',
        },
        accent: {
          purple: '#9B59B6',
          orange: '#F39C12',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'matrix-fall': 'matrix-fall 10s linear infinite',
        'shield-rotate': 'shield-rotate 20s linear infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-out': 'fade-out 0.5s ease-out forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 209, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 209, 0.6)' },
        },
        'matrix-fall': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'shield-rotate': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
