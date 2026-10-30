import forms from '@tailwindcss/forms';
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import radix from 'tailwindcss-radix';
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

// tailwindcss-radix types `config` as `| undefined`, which Config rejects under exactOptionalPropertyTypes
const radixPlugin = radix({ variantPrefix: 'rdx' });

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [forms({ strategy: 'class' }), plugin(radixPlugin.handler, radixPlugin.config), animate],
} satisfies Config;
