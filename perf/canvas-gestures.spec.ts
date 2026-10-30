import { randomUUID } from 'node:crypto';
import { expect, test, type CDPSession, type Page } from '@playwright/test';

const tableCount = 64;

const columnsPerTable = 6;

const moves = 60;

// Main-thread script time for 60 pointer moves over a 64-table schema at 4x CPU. A move that re-renders the editor
// costs about 10 ms here, so 60 of them land near 600 ms; a move that re-renders nothing stays under 100 ms
const budgetMs = 250;

function largeSchema(): string {
  const tables = Array.from({ length: tableCount }, (_table, tableIndex) => ({
    id: randomUUID(),
    name: `table_${tableIndex}`,
    indexes: [],
    columns: Array.from({ length: columnsPerTable }, (_column, columnIndex) => ({
      id: randomUUID(),
      name: `column_${columnIndex}`,
      index: columnIndex,
      type: 'VARCHAR',
      length: 255,
      attributes: ['VISIBLE', 'NOT_NULL'],
    })),
  }));

  const positions = tables.map((table, tableIndex) => ({
    itemId: table.id,
    x: (tableIndex % 8) * 260,
    y: Math.floor(tableIndex / 8) * 300,
  }));

  const schema = {
    id: randomUUID(),
    name: 'Large schema',
    vendor: 'MYSQL:8.0',
    tables,
    groups: [],
    positions,
    relations: [],
  };

  return Buffer.from(JSON.stringify(schema)).toString('base64url');
}

async function scriptMs(cdp: CDPSession): Promise<number> {
  const { metrics } = await cdp.send('Performance.getMetrics');

  return (metrics.find((metric) => metric.name === 'ScriptDuration')?.value ?? 0) * 1000;
}

async function nextFrame(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });
}

async function measureHover(
  page: Page,
  cdp: CDPSession,
  gesture: { from: { x: number; y: number }; to: { x: number; y: number } },
): Promise<number> {
  await page.mouse.move(gesture.from.x, gesture.from.y);

  const before = await scriptMs(cdp);

  for (let move = 1; move <= moves; move += 1) {
    const progress = move / moves;

    await page.mouse.move(
      gesture.from.x + (gesture.to.x - gesture.from.x) * progress,
      gesture.from.y + (gesture.to.y - gesture.from.y) * progress,
    );
    await nextFrame(page);
  }

  return (await scriptMs(cdp)) - before;
}

test(`hovering a ${tableCount}-table canvas stays within ${budgetMs}ms of script`, async ({
  page,
}) => {
  const baseUrl = process.env['PERF_BASE_URL'];

  expect(baseUrl, 'perf/global-setup.ts sets PERF_BASE_URL').toBeDefined();

  if (!baseUrl) return;

  await page.goto(`${baseUrl}/?schema=${largeSchema()}`);
  await expect(page.locator('.react-flow__node')).toHaveCount(tableCount);

  const cdp = await page.context().newCDPSession(page);

  await cdp.send('Performance.enable');
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  const viewport = page.viewportSize() ?? { width: 1280, height: 720 };
  const emptyCorner = { x: viewport.width - 20, y: viewport.height - 120 };

  const hoverMs = await measureHover(page, cdp, {
    from: emptyCorner,
    to: { x: emptyCorner.x - 300, y: emptyCorner.y - 180 },
  });

  console.log(`${moves} moves over ${tableCount} tables at 4x CPU`, {
    hoverMs: Math.round(hoverMs),
  });

  expect(hoverMs, 'script time while hovering the pane').toBeLessThan(budgetMs);
});
