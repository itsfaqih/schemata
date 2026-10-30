import { expect, type Locator, type Page } from '@playwright/test';

// Table nodes, table headers and the canvas have no accessible name, so they are located by
// their `data-test` ids (see `testIdAttribute` in playwright.config.ts).
export function tableNodes(page: Page): Locator {
  return page.getByTestId('table-node');
}

export function tableHeaders(page: Page): Locator {
  return page.getByTestId('table-header');
}

export function tableNamed(page: Page, name: string): Locator {
  return tableNodes(page).filter({
    has: page.getByTestId('table-header').getByText(name, { exact: true }),
  });
}

export function canvas(page: Page): Locator {
  return page.getByTestId('canvas');
}

export function columns(table: Locator): Locator {
  return table.getByRole('listitem');
}

export function columnNamed(table: Locator, name: string): Locator {
  return columns(table).filter({ has: table.page().getByText(name, { exact: true }) });
}

export function menuItem(page: Page, label: string): Locator {
  return page.getByRole('menuitem', { name: new RegExp(`^${label}`) });
}

export async function openEditor(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Add Table' })).toBeVisible();
}

// Creates a table from the canvas context menu at a point of the viewport, so tables never overlap.
export async function addTableAt(
  page: Page,
  name: string,
  position: { x: number; y: number },
): Promise<Locator> {
  await canvas(page).click({ button: 'right', position });
  await menuItem(page, 'Add table').click();
  await tableHeaders(page).getByRole('textbox').fill(name);
  await tableHeaders(page).getByRole('textbox').press('Enter');

  const table = tableNamed(page, name);

  await expect(table).toBeVisible();

  return table;
}

// Adds a column through the "Add field" button and saves it with Enter.
export async function addColumn(table: Locator, name: string): Promise<Locator> {
  await table.hover();
  await table.getByRole('button', { name: /add field/i }).click();
  await table.getByLabel('Name').fill(name);
  await table.getByLabel('Name').press('Enter');

  const column = columnNamed(table, name);

  await expect(column).toBeVisible();

  return column;
}

// The relation menu button has no accessible name and stays hidden until the pointer is over the
// relation line, so the line is hovered at its midpoint, where the button then shows.
export async function relationMenu(page: Page): Promise<void> {
  const relation = page.getByRole('button', { name: /^Edge from/ });

  await relation.hover();
  await relation.getByRole('button').click();
}

// The relation line is the focusable path inside the relation; it has no accessible name of its own.
export function relationLine(page: Page): Locator {
  return page.getByRole('button', { name: /^Edge from/ }).locator('path[tabindex="0"]');
}

// The line's midpoint holds the menu button, so the line is clicked a short way along its path
// from the source table.
export async function clickRelationLine(page: Page): Promise<void> {
  const point = await relationLine(page).evaluate((path: SVGPathElement) => {
    const { x, y } = path.getPointAtLength(path.getTotalLength() * 0.15);
    const matrix = path.getScreenCTM();

    if (!matrix) throw Error('The relation line is not rendered');

    return { x: x * matrix.a + matrix.e, y: y * matrix.d + matrix.f };
  });

  await page.mouse.click(point.x, point.y);
}
