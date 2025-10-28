/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
          light: '#818cf8',
        },
        secondary: {
          DEFAULT: '#8b5cf6',
          dark: '#7c3aed',
          light: '#a78bfa',
        },
        accent: {
          DEFAULT: '#ec4899',
          dark: '#db2777',
          light: '#f472b6',
        },
        dark: {
          DEFAULT: '#0a0a1a',
          darker: '#05050f',
          card: '#0f0f23',
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        'gradient-accent': 'linear-gradient(135deg, #ec4899, #8b5cf6)',
        'gradient-full': 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
        'dark-gradient': 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #16213e 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.5)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.6)',
        'card': '0 4px 15px rgba(99, 102, 241, 0.3)',
        'card-hover': '0 8px 30px rgba(99, 102, 241, 0.4)',
      },
    },
  },
  plugins: [],
}
