import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { test as base, type TestInfo } from '@playwright/test';

export { expect } from '@playwright/test';

type Step = (title: string, body: () => Promise<void>) => Promise<void>;

type Fixtures = {
  step: Step;
  flowVideo: void;
};

const artifactsDir = path.resolve(import.meta.dirname, '..', 'e2e-artifacts');

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replaceAll("'", '')
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-|-$/g, '');
}

function flowDirOf(testInfo: TestInfo): string {
  return path.join(artifactsDir, slugify(testInfo.title));
}

// Only the first copy of a `--repeat-each` run writes artifacts, so repeats never overwrite each other.
function writesArtifacts(testInfo: TestInfo): boolean {
  return testInfo.repeatEachIndex === 0;
}

async function writeArtifact(testInfo: TestInfo, file: string, body: Buffer): Promise<void> {
  if (writesArtifacts(testInfo)) {
    await writeFile(file, body);
  }
}

export const test = base.extend<Fixtures>({
  // oxlint-disable-next-line no-empty-pattern -- Playwright requires a destructured first argument
  baseURL: async ({}, use) => {
    const baseURL = process.env['E2E_BASE_URL'];

    if (!baseURL) {
      throw new Error('E2E_BASE_URL is not set: the e2e global setup did not start the app');
    }

    await use(baseURL);
  },

  step: async ({ page }, use, testInfo) => {
    const flowDir = flowDirOf(testInfo);
    let stepNumber = 0;

    if (writesArtifacts(testInfo)) {
      await rm(flowDir, { recursive: true, force: true });
      await mkdir(flowDir, { recursive: true });
    }

    await use(async (title, body) => {
      await base.step(title, async () => {
        await body();

        stepNumber += 1;

        const name = `${String(stepNumber).padStart(2, '0')}-${slugify(title)}`;

        const screenshot = await page.screenshot({
          fullPage: true,
          mask: [page.locator('input[type="password"]')],
        });

        await testInfo.attach(name, { body: screenshot, contentType: 'image/png' });
        await writeArtifact(testInfo, path.join(flowDir, `${name}.png`), screenshot);
      });
    });
  },

  flowVideo: [
    async ({ page }, use, testInfo) => {
      await use();

      const video = page.video();

      if (!video || !writesArtifacts(testInfo)) {
        return;
      }

      // The runner finishes writing a video only once its context closes.
      await page.context().close();

      const videoPath = path.join(flowDirOf(testInfo), 'video.webm');

      await mkdir(path.dirname(videoPath), { recursive: true });
      await video.saveAs(videoPath);
      await testInfo.attach('video', { path: videoPath, contentType: 'video/webm' });
    },
    { auto: true },
  ],
});
