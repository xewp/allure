/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        obsidian: '#0B0B0D',
        ink: '#151418',
        porcelain: '#F4F0E8',
        oxblood: {
          DEFAULT: '#7C2339',
          light: '#9A344F',
          dark: '#5E192B',
        },
        brass: {
          DEFAULT: '#C5A46D',
          light: '#D8BE92',
          dark: '#9B7B49',
        },
        taupe: '#AAA19A',
        success: '#39705B',
        danger: '#A94444',
        gold: {
          DEFAULT: '#C5A46D',
          light: '#D8BE92',
          dark: '#9B7B49',
        },
        charcoal: '#151418',
        'warm-gray': '#625D59',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      fontSize: {
        '7xl': '5rem',
        '8xl': '6rem',
        '9xl': '7rem',
      },
      boxShadow: {
        'gold': '0 12px 32px rgba(11, 11, 13, 0.18)',
        'gold-lg': '0 18px 48px rgba(11, 11, 13, 0.24)',
        'elegant': '0 16px 45px rgba(11, 11, 13, 0.22)',
        'editorial': '0 20px 60px rgba(11, 11, 13, 0.16)',
      },
      animation: {
        'fade-in-slow': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
