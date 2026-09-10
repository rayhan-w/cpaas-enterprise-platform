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
        background: '#FAFCF7',
        foreground: '#0E140E',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0E140E',
        },
        brand: {
          DEFAULT: '#6CAE14', // Leaf Green from Jawata Mart Logo
          hover: '#5B960E',
          accent: '#9ED114', // Exact Logo Lime Leaf
          light: '#F1F8E8',
          tint: '#E8F5D3',
          dark: '#0B0F0B',   // Logo Black
        },
        linen: '#FAFCF7',
        charcoal: {
          DEFAULT: '#0E140E',
          light: '#1B241B',
          muted: '#526052',
          subtle: '#879787',
        },
        border: '#DFECCE',
        subtle: '#DFECCE',
        bkash: {
          DEFAULT: '#E2136E',
          dark: '#B50057',
        },
        nagad: {
          DEFAULT: '#F4821F',
          dark: '#D06A10',
        },
        sage: {
          DEFAULT: '#78B81B',
          light: '#F1F8E8',
        },
        amber: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'ag-card': '0 4px 20px -2px rgba(26, 21, 18, 0.08), 0 2px 6px -1px rgba(26, 21, 18, 0.04)',
        'ag-hover': '0 16px 36px -4px rgba(26, 21, 18, 0.12), 0 4px 12px -2px rgba(196, 115, 126, 0.12)',
        'elevation-1': '0 1px 3px rgba(26, 21, 18, 0.06), 0 1px 2px rgba(26, 21, 18, 0.04)',
        'elevation-2': '0 4px 12px rgba(26, 21, 18, 0.08), 0 2px 4px rgba(26, 21, 18, 0.04)',
        'elevation-3': '0 8px 24px rgba(26, 21, 18, 0.10), 0 4px 8px rgba(26, 21, 18, 0.06)',
        'elevation-4': '0 16px 40px rgba(26, 21, 18, 0.14), 0 6px 12px rgba(26, 21, 18, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
