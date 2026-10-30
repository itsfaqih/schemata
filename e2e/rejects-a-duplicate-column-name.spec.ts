import { addColumn, addTableAt, columns, openEditor } from './editor';
import { expect, test } from './fixtures';

test('rejects a duplicate column name', async ({ page, step }) => {
  const table = page.getByTestId('table-node');
  const nameTextbox = table.getByLabel('Name');

  await step('open the editor with table "users" holding column "email"', async () => {
    await openEditor(page);
    await addColumn(await addTableAt(page, 'users', { x: 150, y: 100 }), 'email');
  });

  await step('add a column and submit the name "Email" with Enter', async () => {
    await table.hover();
    await table.getByRole('button', { name: /add field/i }).click();
    await nameTextbox.fill('Email');
    await nameTextbox.press('Enter');
  });

  await step('see the name rejected as already used', async () => {
    await expect(table.getByText('Column name is already used')).toBeVisible();
    await expect(nameTextbox).toHaveValue('Email');
    await expect(columns(table)).toHaveText([/^emailVARCHAR/, /Column name is already used/]);
  });
});
