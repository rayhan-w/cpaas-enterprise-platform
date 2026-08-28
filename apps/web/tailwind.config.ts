import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        primary: {
          DEFAULT: '#e11d48',
          hover: '#be123c',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f8fafc',
          foreground: '#1e293b',
        },
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        accent: {
          DEFAULT: '#fff1f2',
          foreground: '#9f1239',
        },
        navy: {
          DEFAULT: '#1a2238',
          deep: '#101524',
          soft: '#232d4b',
          foreground: '#f8fafc',
        },
        surface: '#f8fafc',
        border: '#e2e8f0',
        input: '#f1f5f9',
        ring: '#e11d48',
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Plus Jakarta Sans', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
      },
      boxShadow: {
        elevated: '0 18px 40px -18px rgba(16, 21, 36, 0.25)',
        pink: '0 14px 34px -14px rgba(225, 29, 72, 0.55)',
      },
    },
  },
  plugins: [],
};

export default config;
