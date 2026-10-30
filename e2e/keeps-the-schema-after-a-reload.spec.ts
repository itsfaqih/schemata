import {
  addColumn,
  addTableAt,
  columnNamed,
  openEditor,
  reloadOnceStored,
  tableHeaders,
  tableNamed,
} from './editor';
import { expect, test } from './fixtures';

test('keeps the schema after a reload', async ({ page, step }) => {
  await step('open the editor and name the schema "Shop"', async () => {
    await openEditor(page);
    await page.getByRole('button', { name: 'Change title' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Shop');
    await page.getByRole('textbox', { name: 'Name' }).press('Enter');

    await expect(page.getByText('Shop', { exact: true })).toBeVisible();
  });

  await step('add table "users" with column "email"', async () => {
    await addColumn(await addTableAt(page, 'users', { x: 100, y: 150 }), 'email');
  });

  await step('reload the page', async () => {
    await reloadOnceStored(page, '"email"');
  });

  await step('see "Shop" with table "users" and column "email"', async () => {
    await expect(page.getByText('Shop', { exact: true })).toBeVisible();
    await expect(tableHeaders(page)).toHaveText(['users']);
    await expect(columnNamed(tableNamed(page, 'users'), 'email')).toBeVisible();
  });
});
