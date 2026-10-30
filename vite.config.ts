import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

// The empty editor renders only regular-weight Latin text; other faces load when a screen uses them
const firstScreenFonts = ['inter-latin-400-normal'];

function preloadFirstScreenFonts(): Plugin {
  let base = '/';

  return {
    name: 'preload-first-screen-fonts',
    apply: 'build',
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml(_html, { bundle }) {
      const fileNames = Object.keys(bundle ?? {});

      return firstScreenFonts.map((font) => {
        const fileName = fileNames.find(
          (name) => name.includes(`/${font}-`) && name.endsWith('.woff2'),
        );

        if (!fileName) throw Error(`The build emitted no ${font} woff2 to preload`);

        return {
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'font',
            type: 'font/woff2',
            href: `${base}${fileName}`,
            crossorigin: true,
          },
          injectTo: 'head',
        };
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadFirstScreenFonts()],
  resolve: { tsconfigPaths: true },
});
