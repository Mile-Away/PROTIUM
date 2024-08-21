import { type Config } from 'tailwindcss';

export default {
  content: ['./{src,mdx}/**/*.{js,mjs,jsx,ts,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      lineHeight: {
        12: '3rem',
        16: '4rem',
      },
      fontSize: {
        '2xs': '.6875rem',
      },
      width: {
        '8xl': '88rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      fontFamily: {
        sans: 'var(--font-inter)',
        display: 'var(--font-mona-sans)',
      },
      backgroundImage: {
        'gradient-flow': 'linear-gradient(90deg, #895CFF, #2970ff)',
        // "conic-gradient": 'conic-gradient(#EEEEEE22, #F0C237, #EEEEEE22 30%)',
        "conic-gradient": 'conic-gradient(#EEEEEE22, rgba(253,244,271), #EEEEEE22 30%)',
      },
      opacity: {
        2.5: '0.025',
        7.5: '0.075',
        15: '0.15',
      },
      screens: {
        xl: '1281px',
      },
      animation: {
        'bounce-x': 'bounce-x 1.25s infinite',
        'gradient-flow': 'gradient-flow 12s linear infinite',
        "gradient-conic": 'gradient-conic 5s linear infinite',
      },
      keyframes: {
        'bounce-x': {
          '0%, 100%': { transform: 'translateX(0%)' },
          '50%': { transform: 'translateX(20%)' },
        },
        'gradient-flow': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        'gradient-conic': {
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  variants: {
    extend: {
      animation: ['hover', 'focus', 'group-hover'],
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms')({
      strategy: 'class', // only generate classes
    }),
  ],
} satisfies Config;
