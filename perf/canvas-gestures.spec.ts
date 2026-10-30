import { randomUUID } from 'node:crypto';
import { expect, test, type CDPSession, type Page } from '@playwright/test';

const tableCount = 64;

const columnsPerTable = 6;

const moves = 60;

// Main-thread script time for 60 pointer moves over a 64-table schema at 4x CPU. A hover move that re-renders the
// editor costs about 10 ms here, so 60 of them land near 600 ms; one that re-renders nothing stays under 100 ms
const hoverBudgetMs = 250;

// Dragging a table moves it in React Flow's store on every move. Re-rendering its columns each time lands near 600 ms;
// moving it alone stays under 300 ms
const dragBudgetMs = 450;

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

async function measureGesture(
  page: Page,
  cdp: CDPSession,
  gesture: { from: { x: number; y: number }; to: { x: number; y: number }; pressed: boolean },
): Promise<number> {
  await page.mouse.move(gesture.from.x, gesture.from.y);

  if (gesture.pressed) await page.mouse.down();

  const before = await scriptMs(cdp);

  for (let move = 1; move <= moves; move += 1) {
    const progress = move / moves;

    await page.mouse.move(
      gesture.from.x + (gesture.to.x - gesture.from.x) * progress,
      gesture.from.y + (gesture.to.y - gesture.from.y) * progress,
    );
    await nextFrame(page);
  }

  const elapsed = (await scriptMs(cdp)) - before;

  if (gesture.pressed) await page.mouse.up();

  return elapsed;
}

async function openLargeSchema(page: Page): Promise<CDPSession | undefined> {
  const baseUrl = process.env['PERF_BASE_URL'];

  expect(baseUrl, 'perf/global-setup.ts sets PERF_BASE_URL').toBeDefined();

  if (!baseUrl) return undefined;

  await page.goto(`${baseUrl}/?schema=${largeSchema()}`);
  await expect(page.locator('.react-flow__node')).toHaveCount(tableCount);

  const cdp = await page.context().newCDPSession(page);

  await cdp.send('Performance.enable');
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  return cdp;
}

test(`hovering a ${tableCount}-table canvas stays within ${hoverBudgetMs}ms of script`, async ({
  page,
}) => {
  const cdp = await openLargeSchema(page);

  if (!cdp) return;

  const viewport = page.viewportSize() ?? { width: 1280, height: 720 };
  const corner = { x: viewport.width - 20, y: viewport.height - 120 };

  const hoverMs = await measureGesture(page, cdp, {
    from: corner,
    to: { x: corner.x - 300, y: corner.y - 180 },
    pressed: false,
  });

  console.log(`${moves} hover moves over ${tableCount} tables at 4x CPU`, {
    hoverMs: Math.round(hoverMs),
  });

  expect(hoverMs, 'script time while hovering the canvas').toBeLessThan(hoverBudgetMs);
});

test(`dragging a table on a ${tableCount}-table canvas stays within ${dragBudgetMs}ms of script`, async ({
  page,
}) => {
  const cdp = await openLargeSchema(page);

  if (!cdp) return;

  const table = page.locator('.react-flow__node').first();
  const before = await table.boundingBox();

  expect(before, 'the first table is on screen').not.toBeNull();

  if (!before) return;

  const grip = { x: before.x + 40, y: before.y + 12 };

  const dragMs = await measureGesture(page, cdp, {
    from: grip,
    to: { x: grip.x + 300, y: grip.y + 180 },
    pressed: true,
  });

  console.log(`${moves} drag moves over ${tableCount} tables at 4x CPU`, {
    dragMs: Math.round(dragMs),
  });

  expect((await table.boundingBox())?.x, 'the table followed the pointer').toBeGreaterThan(
    before.x + 200,
  );
  expect(dragMs, 'script time while dragging a table').toBeLessThan(dragBudgetMs);
});
