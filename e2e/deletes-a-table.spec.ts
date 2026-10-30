import { addTableAt, menuItem, openEditor, tableHeaders, tableNodes } from './editor';
import { expect, test } from './fixtures';

test('deletes a table', async ({ page, step }) => {
  await step('open the editor with tables "users" and "orders"', async () => {
    await openEditor(page);
    await addTableAt(page, 'users', { x: 150, y: 200 });
    await addTableAt(page, 'orders', { x: 650, y: 200 });

    await expect(tableHeaders(page)).toHaveText(['users', 'orders']);
  });

  await step('press Delete on the "users" header', async () => {
    await tableHeaders(page).filter({ hasText: 'users' }).press('Delete');

    await expect(tableHeaders(page)).toHaveText(['orders']);
  });

  await step('choose Delete in the "orders" header menu', async () => {
    await tableHeaders(page).filter({ hasText: 'orders' }).click({ button: 'right' });
    await menuItem(page, 'Delete').click();
  });

  await step('see no tables left', async () => {
    await expect(tableNodes(page)).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Add Table' })).toBeVisible();
  });
});
