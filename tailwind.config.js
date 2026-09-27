/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nova: {
          bg: 'var(--nova-bg, #08090C)',
          surface: 'var(--nova-surface, #111319)',
          card: 'var(--nova-card, #161922)',
          cardHover: 'var(--nova-card-hover, #1B1F2B)',
          border: 'rgba(255, 255, 255, 0.08)',
          borderSubtle: 'rgba(255, 255, 255, 0.04)',
          borderHover: 'rgba(255, 255, 255, 0.18)',
          accent: {
            DEFAULT: 'var(--nova-accent, #E5A93C)',
            hover: 'var(--nova-accent-hover, #F0BA5A)',
            subtle: 'rgba(var(--nova-accent-rgb, 229, 169, 60), 0.12)',
            glow: 'rgba(var(--nova-accent-rgb, 229, 169, 60), 0.25)',
          },
          text: {
            primary: '#F8FAFC',
            secondary: '#94A3B8',
            muted: '#64748B',
            dim: '#475569',
          }
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'sans-serif',
        ],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'card': '0 12px 24px -6px rgba(0, 0, 0, 0.6), 0 4px 12px -4px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 20px 35px -8px rgba(0, 0, 0, 0.75), 0 0 15px 1px rgba(255, 255, 255, 0.04)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to top, #08090C 0%, rgba(8, 9, 12, 0.8) 45%, rgba(8, 9, 12, 0.2) 80%, rgba(8, 9, 12, 0.5) 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(22, 25, 34, 0.6) 0%, rgba(17, 19, 25, 0.95) 100%)',
      }
    },
  },
  plugins: [],
}
