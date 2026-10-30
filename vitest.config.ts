import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      sequence: { shuffle: true },
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'node',
            include: ['src/**/*.test.{ts,tsx}'],
            exclude: ['src/**/*.int.test.{ts,tsx}'],
          },
        },
        {
          extends: true,
          test: {
            name: 'integration',
            include: ['src/**/*.int.test.{ts,tsx}'],
            // Test files share one origin and so one IndexedDB; each clears it, so they take turns
            fileParallelism: false,
            testTimeout: 15_000,
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              instances: [{ browser: 'chromium' }],
              viewport: { width: 1280, height: 720 },
            },
          },
        },
      ],
    },
  }),
);
