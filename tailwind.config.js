const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: 'jit',
  content: [
    './app/**/*.{tsx, jsx, js, ts}',
    './page/**/*.{tsx, jsx, js, ts}',
    './components/**/*.{tsx, jsx, js, ts}',
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-inter)', ...fontFamily.sans],
    },
    extend: {
      colors: {
        accent: '#B809C3',
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        marquee2: 'marquee2 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
};
