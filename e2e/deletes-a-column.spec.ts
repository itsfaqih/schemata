import { addColumn, addTableAt, columns, menuItem, openEditor } from './editor';
import { expect, test } from './fixtures';

test('deletes a column', async ({ page, step }) => {
  const table = page.getByTestId('table-node');

  await step('open the editor with table "users" holding columns "id" and "email"', async () => {
    await openEditor(page);
    await addTableAt(page, 'users', { x: 150, y: 100 });
    await addColumn(table, 'id');
    await addColumn(table, 'email');

    await expect(columns(table)).toHaveText([/^id/, /^email/]);
  });

  await step('press Delete on column "id"', async () => {
    await columns(table).first().click();
    await page.keyboard.press('Delete');

    await expect(columns(table)).toHaveText([/^email/]);
  });

  await step('choose Delete in the menu of column "email"', async () => {
    await columns(table).first().click({ button: 'right' });
    await menuItem(page, 'Delete').click();
  });

  await step('see no columns left', async () => {
    await expect(columns(table)).toHaveCount(0);
    await expect(page.getByTestId('table-header')).toHaveText('users');
  });
});
