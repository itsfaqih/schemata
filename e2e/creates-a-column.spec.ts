import { addTableAt, columnNamed, columns, menuItem, openEditor, tableHeaders } from './editor';
import { expect, test } from './fixtures';

test('creates a column', { tag: '@smoke' }, async ({ page, step }) => {
  const table = page.getByTestId('table-node');
  const nameTextbox = table.getByLabel('Name');
  const primaryKey = table.getByLabel('Primary Key');

  await step('open the editor with table "users"', async () => {
    await openEditor(page);
    await addTableAt(page, 'users', { x: 150, y: 100 });
  });

  await step('click "Add field" and submit no name with Escape', async () => {
    await table.hover();
    await table.getByRole('button', { name: /add field/i }).click();
    await nameTextbox.press('Escape');

    await expect(columns(table)).toHaveCount(1);
  });

  await step(
    'choose "Add field" in the header menu, name it "id", tick Primary Key, submit with Enter',
    async () => {
      await tableHeaders(page).click({ button: 'right' });
      await menuItem(page, 'Add field').click();
      await nameTextbox.fill('id');
      await primaryKey.check();
      await nameTextbox.press('Enter');

      await expect(columns(table)).toHaveCount(2);
    },
  );

  await step('press Shift+Enter on the header, name it "email", submit with Enter', async () => {
    await tableHeaders(page).press('Shift+Enter');
    await nameTextbox.fill('email');
    await nameTextbox.press('Enter');

    await expect(columns(table)).toHaveCount(3);
  });

  await step(
    'press Shift+Enter on a column, name it "code", tick Primary Key, submit with Escape',
    async () => {
      await columnNamed(table, 'email').click();
      await page.keyboard.press('Shift+Enter');
      await nameTextbox.fill('code');
      await primaryKey.check();
      await primaryKey.press('Escape');

      await expect(columns(table)).toHaveCount(4);
    },
  );

  await step('see the four columns with their names, types and keys', async () => {
    const untitled = columnNamed(table, 'untitled');
    const id = columnNamed(table, 'id');
    const email = columnNamed(table, 'email');
    const code = columnNamed(table, 'code');

    await expect(untitled.getByText('VARCHAR', { exact: true })).toBeVisible();
    await expect(untitled.getByText('Primary key')).toHaveCount(0);
    await expect(id.getByText('VARCHAR', { exact: true })).toBeVisible();
    await expect(id.getByText('Primary key')).toBeAttached();
    await expect(email.getByText('VARCHAR', { exact: true })).toBeVisible();
    await expect(email.getByText('Primary key')).toHaveCount(0);
    await expect(code.getByText('VARCHAR', { exact: true })).toBeVisible();
    await expect(code.getByText('Primary key')).toBeAttached();
  });
});
