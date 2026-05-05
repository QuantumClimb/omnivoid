import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#111111',
        primary: '#99ccff',
        secondary: '#6699cc',
        accent: {
          1: '#99ccff',
          2: '#6699cc',
          3: '#336699',
        },
        border: '#333333',
        'border-hover': '#99ccff',
      },
      fontFamily: {
        mono: ['var(--font-space-mono)', 'Space Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(153, 204, 255, 0.2)',
        'glow-strong': '0 0 30px rgba(153, 204, 255, 0.5)',
        dark: '4px 4px 8px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideUp: 'slideUp 0.5s ease-out',
        slideDown: 'slideDown 0.5s ease-out',
        scaleIn: 'scaleIn 0.5s ease-out',
        pulse: 'pulse 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(153, 204, 255, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(153, 204, 255, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;