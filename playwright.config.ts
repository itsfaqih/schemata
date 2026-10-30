// What this suite leaves out:
// - Browsers: runs on Chromium only; Firefox, WebKit and mobile viewports are not run.
// - Stubs: none. Schemata is client-only (state in IndexedDB, sharing through the URL)
//   and loads no third-party service, so nothing is replaced by a stub.
import { defineConfig, devices } from '@playwright/test';

const viewport = { width: 1280, height: 720 };

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    testIdAttribute: 'data-test',
    viewport,
    screenshot: 'on',
    trace: 'retain-on-failure',
    video: process.env['E2E_VIDEO'] === '1' ? { mode: 'on', size: viewport } : 'off',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport } }],
});
