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
        // Color palette as specified in the design requirements
        'saas-bg-light': '#f0f2f4',
        'saas-primary-blue': '#639ac0',
        'saas-secondary-teal': '#6da6af',
        'saas-accent-cyan': '#c5f5f9',
        'saas-accent-red': '#953640',
      },
      spacing: {
        // Consistent spacing system based on 4px increments
        'xs': '0.25rem',  // 4px
        'sm': '0.5rem',  // 8px
        'md': '1rem',    // 16px
        'lg': '1.5rem',  // 24px
        'xl': '2rem',    // 32px
        '2xl': '3rem',   // 48px
      },
      fontSize: {
        // Typography hierarchy
        'h1': ['2rem', { lineHeight: '2.5rem', fontWeight: 'bold' }],
        'h2': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'h3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.5rem', fontWeight: 'normal' }],
        'caption': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
      },
    },
  },
  plugins: [],
};
export default config;