// Loads the production build over throttled networks, one page load at a time so loads never share bandwidth or CPU.
import { defineConfig, devices } from '@playwright/test';

const viewport = { width: 1280, height: 720 };

export default defineConfig({
  testDir: './perf',
  globalSetup: './perf/global-setup.ts',
  workers: 1,
  retries: 0,
  timeout: 5 * 60_000,
  forbidOnly: !!process.env['CI'],
  reporter: [['list']],
  use: { viewport },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport } }],
});
