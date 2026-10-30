import { randomUUID } from 'node:crypto';
import { expect, test, type CDPSession, type Page } from '@playwright/test';

const tableCount = 64;

const columnsPerTable = 6;

const moves = 60;

// The budgets below hold for a 4x CPU slowdown of the machine they were measured on, which runs the
// calibration workload in about 36 ms. A slower machine, such as a CI runner, is throttled less, so it runs the
// gestures at the speed the budgets assume
const targetSlowdown = 4;

const referenceCalibrationMs = 36;

// Each drag takes a table nothing has moved yet, since a moved table can come to rest under its neighbour's columns
const drags = [
  { tableIndex: 0, by: { x: 300, y: 180 } },
  { tableIndex: 4, by: { x: -300, y: 180 } },
];

// A dragged table that re-renders its columns on every move costs more the more columns it has, so the dragged tables
// are wide enough to set that cost well apart from the move itself
const draggedTableColumns = 30;

// Main-thread script time for 60 pointer moves over a 64-table schema. A hover move that re-renders the
// editor costs about 10 ms on the reference machine, so 60 of them land near 600 ms; one that re-renders nothing stays under 100 ms
const hoverBudgetMs = 250;

// Dragging a table moves it in React Flow's store on every move. Re-rendering its 30 columns each time costs 830-860 ms
// on the reference machine, the better of two drags; moving it alone costs 270-280 ms
const dragBudgetMs = 500;

const renames = 5;

// Renaming a table records the canvas for undo and saves it. When that re-renders every table and column, 5 renames
// cost about 3.7 s here; when only the renamed table re-renders, about 550 ms
const renameBudgetMs = 1000;

function largeSchema(): string {
  const tables = Array.from({ length: tableCount }, (_table, tableIndex) => ({
    id: randomUUID(),
    name: `table_${tableIndex}`,
    indexes: [],
    columns: Array.from(
      {
        length: drags.some((drag) => drag.tableIndex === tableIndex)
          ? draggedTableColumns
          : columnsPerTable,
      },
      (_column, columnIndex) => ({
        id: randomUUID(),
        name: `column_${columnIndex}`,
        index: columnIndex,
        type: 'VARCHAR',
        length: 255,
        attributes: ['VISIBLE', 'NOT_NULL'],
      }),
    ),
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

// Median time of a fixed allocation-heavy workload, run in the page before any throttling
async function calibrationMs(page: Page): Promise<number> {
  return await page.evaluate(() => {
    // oxlint-disable-next-line unicorn/consistent-function-scoping -- page.evaluate sends only this callback to the browser
    function work(): number {
      const rows = Array.from({ length: 100_000 }, (_row, rowIndex) => ({
        id: `row-${rowIndex}`,
        cells: Array.from({ length: 6 }, (_cell, cellIndex) => ({
          name: `column_${cellIndex}`,
          value: rowIndex * cellIndex,
        })),
      }));

      return (
        rows.reduce(
          (sum, row) => sum + row.cells.reduce((cells, cell) => cells + cell.value, 0),
          0,
        ) +
        JSON.stringify(rows.slice(0, 10_000)).length +
        rows.map((row) => row.id).toSorted().length
      );
    }

    work();

    const times = Array.from({ length: 7 }, () => {
      const start = performance.now();

      work();

      return performance.now() - start;
    });

    return times.toSorted((a, b) => a - b)[3] ?? 0;
  });
}

async function openLargeSchema(page: Page): Promise<CDPSession | undefined> {
  const baseUrl = process.env['PERF_BASE_URL'];

  expect(baseUrl, 'perf/global-setup.ts sets PERF_BASE_URL').toBeDefined();

  if (!baseUrl) return undefined;

  await page.goto(`${baseUrl}/?schema=${largeSchema()}`);
  await expect(page.locator('.react-flow__node')).toHaveCount(tableCount);

  const cdp = await page.context().newCDPSession(page);

  const rate = Math.max(1, (targetSlowdown * referenceCalibrationMs) / (await calibrationMs(page)));

  console.log(
    `CPU throttled ${rate.toFixed(2)}x for a ${targetSlowdown}x slowdown of the reference machine`,
  );

  await cdp.send('Performance.enable');
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });

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

  console.log(`${moves} hover moves over ${tableCount} tables`, {
    hoverMs: Math.round(hoverMs),
  });

  expect(hoverMs, 'script time while hovering the canvas').toBeLessThan(hoverBudgetMs);
});

test(`dragging a table on a ${tableCount}-table canvas stays within ${dragBudgetMs}ms of script`, async ({
  page,
}) => {
  const cdp = await openLargeSchema(page);

  if (!cdp) return;

  // A busy machine can slow one drag; the slow code this guards against is slow on both, so the faster one counts
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

  console.log(`${moves} drag moves over ${tableCount} tables, better of 2`, {
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

  console.log(`${renames} renames over ${tableCount} tables`, {
    renameMs: Math.round(renameMs),
  });

  expect(renameMs, 'script time while renaming tables').toBeLessThan(renameBudgetMs);
});
