import forms from '@tailwindcss/forms';
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [forms({ strategy: 'class' }), animate],
} satisfies Config;
