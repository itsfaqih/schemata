import { addColumn, addTableAt, columnNamed, menuItem, openEditor, tableNodes } from './editor';
import { expect, test } from './fixtures';

test('keeps focus in the relation dialog', async ({ page, step }) => {
  const dialog = page.getByRole('dialog', { name: 'Add Relation' });

  await step('open the editor with table "organizations"', async () => {
    await openEditor(page);
    await addColumn(await addTableAt(page, 'organizations', { x: 100, y: 150 }), 'id');
  });

  await step('choose "Add relation" in the menu of column organizations.id', async () => {
    await columnNamed(tableNodes(page).first(), 'id').click({ button: 'right' });
    await menuItem(page, 'Add relation').click();

    await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();
  });

  await step('press Tab', async () => {
    await page.keyboard.press('Tab');

    await expect(dialog.getByRole('textbox', { name: 'Table' })).toBeFocused();
  });

  await step('click outside the dialog', async () => {
    await page.mouse.click(20, 600);

    await expect(dialog).toBeVisible();
  });

  await step('press Escape', async () => {
    await page.keyboard.press('Escape');

    await expect(dialog).toBeHidden();
  });
});
