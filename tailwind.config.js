/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#f0d080',
          400: '#e8c050',
          500: '#c9a84c',
          600: '#a8872a',
          700: '#886a10',
        },
        navy: {
          800: '#0e1628',
          900: '#070d1a',
          950: '#040810',
        },
        teal: {
          700: '#0f4a4a',
          800: '#093636',
          900: '#051f1f',
        },
        cream: '#f5ede0',
        champagne: '#f2e0b4',
        emerald: {
          300: '#2d8659',
          400: '#45a678',
          500: '#1a4d3e',
          600: '#0f3d30',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'serif'],
      },
      animation: {
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(201,168,76,0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(201,168,76,0.7)' },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: 0, transform: 'translateX(-30px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: 0, transform: 'translateX(30px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(45, 134, 89, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(45, 134, 89, 0.6)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #c9a84c 0%, #f0d080 50%, #c9a84c 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0e1628 0%, #093636 100%)',
        'gradient-emerald': 'linear-gradient(135deg, #2d8659 0%, #1a4d3e 100%)',
        'gradient-gold': 'linear-gradient(135deg, #d4af37 0%, #e6c547 100%)',
        'gradient-premium': 'linear-gradient(135deg, #1a4d3e 0%, #d4af37 100%)',
      },
      fontSize: {
        'xs': ['0.82rem', { lineHeight: '1.5' }],
        'sm': ['0.95rem', { lineHeight: '1.6' }],
        'base': ['1.05rem', { lineHeight: '1.65' }],
        'lg': ['1.15rem', { lineHeight: '1.6' }],
        'xl': ['1.3rem', { lineHeight: '1.5' }],
        '2xl': ['1.6rem', { lineHeight: '1.4' }],
        '3xl': ['2rem', { lineHeight: '1.35' }],
        '4xl': ['2.5rem', { lineHeight: '1.2' }],
        '5xl': ['3.1rem', { lineHeight: '1.1' }],
        '6xl': ['3.8rem', { lineHeight: '1.05' }],
        '7xl': ['4.7rem', { lineHeight: '1' }],
      },
    },
  },
  plugins: [],
}
