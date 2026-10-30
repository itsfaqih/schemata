import { randomUUID } from 'node:crypto';
import { expect, test, type CDPSession, type Page } from '@playwright/test';

const tableCount = 64;

const columnsPerTable = 6;

const moves = 60;

// Main-thread script time for 60 pointer moves over a 64-table schema at 4x CPU. A hover move that re-renders the
// editor costs about 10 ms here, so 60 of them land near 600 ms; one that re-renders nothing stays under 100 ms
const hoverBudgetMs = 250;

// Dragging a table moves it in React Flow's store on every move. Re-rendering its columns each time costs 310-370 ms
// here, the better of two drags; moving it alone costs 190-210 ms
const dragBudgetMs = 260;

const renames = 5;

// Renaming a table records the canvas for undo and saves it. When that re-renders every table and column, 5 renames
// cost about 3.7 s here; when only the renamed table re-renders, about 550 ms
const renameBudgetMs = 1000;

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

  // A busy machine can slow one drag; the slow code this guards against is slow on both, so the faster one counts.
  // Each drag takes a table nothing has moved yet, since a moved table can come to rest under its neighbour's columns
  const drags = [
    { tableIndex: 0, by: { x: 300, y: 180 } },
    { tableIndex: 4, by: { x: -300, y: 180 } },
  ];

  const dragTimesMs: number[] = [];

  for (const drag of drags) {
    const header = page.locator('[data-test="table-header"]').nth(drag.tableIndex);
    const start = await header.boundingBox();

    expect(start, `table ${drag.tableIndex} is on screen`).not.toBeNull();

    if (!start) return;

    // The header's top padding is a drag handle; its name and the columns below are not
    const grip = { x: start.x + 40, y: start.y + 8 };

    dragTimesMs.push(
      await measureGesture(page, cdp, {
        from: grip,
        to: { x: grip.x + drag.by.x, y: grip.y + drag.by.y },
        pressed: true,
      }),
    );

    expect(
      Math.abs(((await header.boundingBox())?.x ?? start.x) - start.x),
      `table ${drag.tableIndex} followed the pointer`,
    ).toBeGreaterThan(200);
  }

  const dragMs = Math.min(...dragTimesMs);

  console.log(`${moves} drag moves over ${tableCount} tables at 4x CPU, better of 2`, {
    dragTimesMs: dragTimesMs.map(Math.round),
  });

  expect(dragMs, 'script time while dragging a table').toBeLessThan(dragBudgetMs);
});

test(`renaming ${renames} tables on a ${tableCount}-table canvas stays within ${renameBudgetMs}ms of script`, async ({
  page,
}) => {
  const cdp = await openLargeSchema(page);

  if (!cdp) return;

  let renameMs = 0;

  for (let rename = 0; rename < renames; rename += 1) {
    const header = page.locator('[data-test="table-header"]').nth(rename);
    const nameInput = header.getByRole('textbox');

    await header.press('e');
    await nameInput.fill(`renamed_${rename}`);

    const before = await scriptMs(cdp);

    await nameInput.press('Enter');
    await expect(header).toHaveText(`renamed_${rename}`);
    await nextFrame(page);
    await nextFrame(page);

    renameMs += (await scriptMs(cdp)) - before;
  }

  console.log(`${renames} renames over ${tableCount} tables at 4x CPU`, {
    renameMs: Math.round(renameMs),
  });

  expect(renameMs, 'script time while renaming tables').toBeLessThan(renameBudgetMs);
});
