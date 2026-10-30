import { addTableAt, openEditor, tableHeaders } from './editor';
import { expect, test } from './fixtures';

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test('shares the schema without a deleted table', async ({ page, step }) => {
  await step('open the editor with tables "users" and "orders"', async () => {
    await openEditor(page);
    await addTableAt(page, 'users', { x: 150, y: 200 });
    await addTableAt(page, 'orders', { x: 650, y: 200 });
  });

  await step('press Delete on the "users" header', async () => {
    await tableHeaders(page).filter({ hasText: 'users' }).press('Delete');

    await expect(tableHeaders(page)).toHaveText(['orders']);
  });

  await step('copy the share link and open it', async () => {
    await page.getByRole('button', { name: 'Share link (CTRL + S)' }).click();
    await expect(page.getByText('URL copied to clipboard')).toBeVisible();

    const link = await page.evaluate(async () => await navigator.clipboard.readText());

    await page.goto(link);
  });

  await step('see only table "orders"', async () => {
    await expect(page.getByRole('button', { name: 'Add Table' })).toBeVisible();
    await expect(tableHeaders(page)).toHaveText(['orders']);
  });
});
