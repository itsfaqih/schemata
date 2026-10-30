import { addTableAt, canvas, menuItem, openEditor, tableHeaders } from './editor';
import { expect, test } from './fixtures';

test('rejects a duplicate table name', async ({ page, step }) => {
  const nameInput = tableHeaders(page).getByRole('textbox');

  await step('open the editor with table "users"', async () => {
    await openEditor(page);
    await addTableAt(page, 'users', { x: 100, y: 150 });
  });

  await step('add a table and submit the name "Users" with Enter', async () => {
    await canvas(page).click({ button: 'right', position: { x: 700, y: 150 } });
    await menuItem(page, 'Add table').click();
    await nameInput.fill('Users');
    await nameInput.press('Enter');
  });

  await step('submit it again with Escape', async () => {
    await nameInput.press('Escape');
  });

  await step('see the new table still asking for a name', async () => {
    await expect(nameInput).toHaveValue('Users');
    await expect(tableHeaders(page).getByText('users', { exact: true })).toHaveCount(1);
  });
});
