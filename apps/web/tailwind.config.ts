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
        background: '#FAF8F5',
        foreground: '#1B241B',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1B241B',
        },
        brand: {
          DEFAULT: '#0D5435', // Ghorer Bazar Signature Forest Green
          hover: '#093D26',
          light: '#E7F2EC',
          tint: '#F0F7F3',
          dark: '#062919',
        },
        linen: '#FAF8F5',
        charcoal: {
          DEFAULT: '#1B241B',
          light: '#2D382D',
          muted: '#526052',
          subtle: '#879787',
        },
        border: '#E3EBE5',
        subtle: '#E3EBE5',
        bkash: {
          DEFAULT: '#E2136E',
          dark: '#B50057',
        },
        nagad: {
          DEFAULT: '#F4821F',
          dark: '#D06A10',
        },
        sage: {
          DEFAULT: '#107C41',
          light: '#E6F4EA',
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
