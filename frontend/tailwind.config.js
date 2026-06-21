/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#10172A',
          light: '#1A2238',
          lighter: '#252E48',
        },
        paper: '#F7F4ED',
        amber: {
          DEFAULT: '#F2A93B',
          dark: '#D6911F',
          light: '#FCE5BC',
        },
        teal: {
          DEFAULT: '#2DD4BF',
          dark: '#15A395',
          light: '#CFFAF4',
        },
        coral: {
          DEFAULT: '#FB6F5C',
          dark: '#E14C38',
          light: '#FFE0DA',
        },
        slate: {
          DEFAULT: '#7C879B',
          dark: '#525C6E',
          light: '#C9CFDB',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 23, 42, 0.06), 0 4px 12px rgba(16, 23, 42, 0.06)',
        lifted: '0 8px 24px rgba(16, 23, 42, 0.12)',
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
};
