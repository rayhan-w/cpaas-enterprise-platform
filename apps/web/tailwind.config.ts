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
          DEFAULT: '#fd6b03', // Orange from Jawata Mart Logo
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FD6B03',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#0D1F61',   // Dark Blue
          dark: '#0D1F61',  // Dark Blue
          blue: '#0D1F61',
          navy: '#0D1F61',
          orange: '#FD6B03',
          hover: '#162D85',
          accent: '#FD6B03',
          light: '#FFF7ED',
          tint: '#FFEDD5',
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
