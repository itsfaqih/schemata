import { addTableAt, columnNamed, columns, menuItem, openEditor } from './editor';
import { expect, test } from './fixtures';

test('edits a column', async ({ page, step }) => {
  const table = page.getByTestId('table-node');
  const column = columns(table);
  const nameTextbox = table.getByLabel('Name');

  await step('open the editor with table "users" and an untitled column', async () => {
    await openEditor(page);
    await addTableAt(page, 'users', { x: 150, y: 100 });
    await table.hover();
    await table.getByRole('button', { name: /add field/i }).click();
    await nameTextbox.press('Enter');

    await expect(
      columnNamed(table, 'untitled').getByText('VARCHAR', { exact: true }),
    ).toBeVisible();
  });

  await step('press E on the column and submit the name "foo" with Enter', async () => {
    await column.click();
    await page.keyboard.press('e');
    await nameTextbox.fill('foo');
    await nameTextbox.press('Enter');

    await expect(column.getByText('foo', { exact: true })).toBeVisible();
  });

  await step('choose Edit in the column menu and submit the type INTEGER with Escape', async () => {
    await column.click({ button: 'right' });
    await menuItem(page, 'Edit').click();
    await table.getByRole('combobox', { name: 'Type' }).click();
    await page.getByTestId('column-type-combobox-INTEGER').click();
    await table.getByRole('combobox', { name: 'Type' }).press('Escape');

    await expect(column.getByText('INTEGER', { exact: true })).toBeVisible();
    await expect(column.getByText('Primary key')).toHaveCount(0);
  });

  await step(
    'double-click the column, tick Primary Key and submit with Enter in the name',
    async () => {
      await column.dblclick();
      await table.getByLabel('Primary Key').check();
      await nameTextbox.press('Enter');
    },
  );

  await step('see column "foo" as an INTEGER primary key', async () => {
    await expect(column.getByText('foo', { exact: true })).toBeVisible();
    await expect(column.getByText('INTEGER', { exact: true })).toBeVisible();
    await expect(column.getByText('Primary key')).toBeAttached();
  });
});
