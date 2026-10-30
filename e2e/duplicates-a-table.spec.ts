import { addColumn, addTableAt, columns, openEditor, tableHeaders, tableNodes } from './editor';
import { expect, test } from './fixtures';

test('duplicates a table', async ({ page, step }) => {
  await step('open the editor with table "foo" holding column "id"', async () => {
    await openEditor(page);
    const table = await addTableAt(page, 'foo', { x: 150, y: 200 });
    await addColumn(table, 'id');
  });

  await step('press Ctrl+D on the table header', async () => {
    await tableHeaders(page).press('Control+d');
  });

  await step('see two "foo" tables, each with column "id"', async () => {
    await expect(tableHeaders(page)).toHaveText(['foo', 'foo']);
    await expect(columns(tableNodes(page).nth(0))).toHaveText([/^id/]);
    await expect(columns(tableNodes(page).nth(1))).toHaveText([/^id/]);
  });
});
