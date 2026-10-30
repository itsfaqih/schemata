import { addTableAt, columns, menuItem, openEditor, tableHeaders } from './editor';
import { expect, test } from './fixtures';

test('duplicates a column', async ({ page, step }) => {
  const table = page.getByTestId('table-node');

  await step('open the editor with table "foo" holding column "bar"', async () => {
    await openEditor(page);
    await addTableAt(page, 'foo', { x: 150, y: 100 });
    await tableHeaders(page).press('Shift+Enter');
    await table.getByLabel('Name').fill('bar');
    await table.getByLabel('Name').press('Enter');

    await expect(columns(table)).toHaveText([/^bar/]);
  });

  await step('choose Duplicate in the column menu', async () => {
    await columns(table).first().click({ button: 'right' });
    await menuItem(page, 'Duplicate').click();

    await expect(columns(table)).toHaveText([/^bar/, /^bar/]);
  });

  await step('press Ctrl+D on the column', async () => {
    await columns(table).first().click();
    await page.keyboard.press('Control+d');
  });

  await step('see three "bar" columns', async () => {
    await expect(columns(table)).toHaveText([/^barVARCHAR/, /^barVARCHAR/, /^barVARCHAR/]);
  });
});
