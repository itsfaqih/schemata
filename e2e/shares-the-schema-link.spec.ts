import {
  addColumn,
  addTableAt,
  canvas,
  columnNamed,
  openEditor,
  tableHeaders,
  tableNamed,
} from './editor';
import { expect, test } from './fixtures';

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test('shares the schema link', async ({ page, step }) => {
  await step('open the editor and name the schema "Shop"', async () => {
    await openEditor(page);
    await page.getByRole('button', { name: 'Change title' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Shop');
    await page.getByRole('textbox', { name: 'Name' }).press('Enter');

    await expect(page.getByText('Shop', { exact: true })).toBeVisible();
  });

  await step('add table "users" with column "id"', async () => {
    await addColumn(await addTableAt(page, 'users', { x: 100, y: 150 }), 'id');
  });

  await step('click "Share link"', async () => {
    await page.getByRole('button', { name: 'Share link (CTRL + S)' }).click();

    await expect(page.getByText('URL copied to clipboard')).toBeVisible();
    await expect(page).toHaveURL(/\?schema=/);
  });

  await step('add table "orders" and press Ctrl+S', async () => {
    await addTableAt(page, 'orders', { x: 700, y: 150 });
    await canvas(page).click({ position: { x: 400, y: 500 } });
    await page.keyboard.press('Control+s');
  });

  await step('open the copied link', async () => {
    const link = await page.evaluate(async () => await navigator.clipboard.readText());

    await page.goto(link);
  });

  await step('see the shared schema with both tables', async () => {
    await expect(page.getByText('Shop', { exact: true })).toBeVisible();
    await expect(tableHeaders(page)).toHaveText(['users', 'orders']);
    await expect(columnNamed(tableNamed(page, 'users'), 'id')).toBeVisible();
  });
});
