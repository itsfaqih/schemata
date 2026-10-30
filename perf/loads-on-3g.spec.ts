import { expect, test, type Browser } from '@playwright/test';

type NetworkProfile = {
  latencyMs: number;
  downloadKbps: number;
  uploadKbps: number;
  cpuSlowdown: number;
};

// Lighthouse's mobile presets with its 4x CPU slowdown, applied the way DevTools applies them: RTT × 3.75 per
// request, throughput × 0.9. fast-3g is DevTools' Fast 3G preset (now named Slow 4G) and gates the build;
// regular-3g needs more than 4.4s for React and an empty React Flow canvas alone, so it is measured on demand
const profiles = new Map<string, NetworkProfile>([
  [
    'fast-3g',
    { latencyMs: 150 * 3.75, downloadKbps: 1600 * 0.9, uploadKbps: 750 * 0.9, cpuSlowdown: 4 },
  ],
  [
    'regular-3g',
    { latencyMs: 300 * 3.75, downloadKbps: 700 * 0.9, uploadKbps: 700 * 0.9, cpuSlowdown: 4 },
  ],
]);

const profileName = process.env['PERF_PROFILE'] ?? 'fast-3g';

const runs = Number(process.env['PERF_RUNS'] ?? '5');

const budgetMs = 5000;

type LoadSample = {
  firstContentfulPaintMs: number;
  largestContentfulPaintMs: number;
  loadEventMs: number;
  editorReadyMs: number;
  fontsLoadedMs: number;
  loadedMs: number;
  requests: number;
  failedRequests: number;
  transferredKb: number;
  htmlEncoding: string;
};

async function loadOnce(
  browser: Browser,
  baseUrl: string,
  profile: NetworkProfile,
): Promise<LoadSample> {
  const context = await browser.newContext();
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);

  const statuses = new Map<string, number>();
  let failedRequests = 0;
  let transferredBytes = 0;
  let htmlEncoding = 'none';

  cdp.on('Network.responseReceived', ({ requestId, response, type }) => {
    statuses.set(requestId, response.status);

    if (type === 'Document') {
      htmlEncoding = response.headers['content-encoding'] ?? 'none';
    }
  });
  cdp.on('Network.loadingFinished', ({ encodedDataLength }) => {
    transferredBytes += encodedDataLength;
  });
  cdp.on('Network.loadingFailed', () => {
    failedRequests += 1;
  });

  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: profile.latencyMs,
    downloadThroughput: (profile.downloadKbps * 1024) / 8,
    uploadThroughput: (profile.uploadKbps * 1024) / 8,
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: profile.cpuSlowdown });

  await page.addInitScript(() => {
    const observer = new MutationObserver(() => {
      if (document.querySelector('[data-test="create-table-button"]')) {
        observer.disconnect();
        requestAnimationFrame(() => performance.mark('editor-ready'));
      }
    });

    observer.observe(document, { childList: true, subtree: true });
  });

  await page.goto(baseUrl, { waitUntil: 'load', timeout: 60_000 });
  await page.waitForFunction(() => performance.getEntriesByName('editor-ready').length > 0, null, {
    timeout: 60_000,
  });

  const timings = await page.evaluate(async () => {
    const largestContentfulPaintMs = await new Promise<number>((resolve) => {
      new PerformanceObserver((list) => resolve(list.getEntries().at(-1)?.startTime ?? 0)).observe({
        type: 'largest-contentful-paint',
        buffered: true,
      });
    });

    const navigation = performance
      .getEntriesByType('navigation')
      .find((entry) => entry instanceof PerformanceNavigationTiming);

    await document.fonts.ready;

    const fontEnds = performance
      .getEntriesByType('resource')
      .flatMap((entry) =>
        entry instanceof PerformanceResourceTiming && /\.woff2?$/.test(entry.name)
          ? [entry.responseEnd]
          : [],
      );

    return {
      firstContentfulPaintMs:
        performance.getEntriesByName('first-contentful-paint').at(0)?.startTime ?? 0,
      largestContentfulPaintMs,
      loadEventMs: navigation?.loadEventEnd ?? 0,
      editorReadyMs: performance.getEntriesByName('editor-ready').at(0)?.startTime ?? 0,
      fontsLoadedMs: Math.max(0, ...fontEnds),
    };
  });

  await context.close();

  return {
    ...timings,
    loadedMs: Math.max(timings.loadEventMs, timings.editorReadyMs, timings.fontsLoadedMs),
    requests: statuses.size,
    failedRequests:
      failedRequests + [...statuses.values()].filter((status) => status >= 400).length,
    transferredKb: Math.round(transferredBytes / 1024),
    htmlEncoding,
  };
}

test(`loads the editor within ${budgetMs / 1000}s on ${profileName}`, async ({ browser }) => {
  const baseUrl = process.env['PERF_BASE_URL'];
  const profile = profiles.get(profileName);

  expect(baseUrl, 'perf/global-setup.ts sets PERF_BASE_URL').toBeDefined();
  expect(profile, `PERF_PROFILE is one of ${[...profiles.keys()].join(', ')}`).toBeDefined();

  if (!baseUrl || !profile) return;

  const samples: LoadSample[] = [];

  for (let run = 0; run < runs; run += 1) {
    samples.push(await loadOnce(browser, baseUrl, profile));
  }

  console.log(`${profileName}, CPU slowdown ${profile.cpuSlowdown}x, ${runs} cold loads`);
  console.table(
    samples.map((sample) => ({
      ...sample,
      firstContentfulPaintMs: Math.round(sample.firstContentfulPaintMs),
      largestContentfulPaintMs: Math.round(sample.largestContentfulPaintMs),
      loadEventMs: Math.round(sample.loadEventMs),
      editorReadyMs: Math.round(sample.editorReadyMs),
      fontsLoadedMs: Math.round(sample.fontsLoadedMs),
      loadedMs: Math.round(sample.loadedMs),
    })),
  );

  for (const sample of samples) {
    expect(sample.failedRequests, 'every request succeeds').toBe(0);
    expect(sample.htmlEncoding, 'the server compresses like production').toBe('br');
  }

  expect(Math.max(...samples.map((sample) => sample.loadedMs)), 'slowest cold load').toBeLessThan(
    budgetMs,
  );
});
