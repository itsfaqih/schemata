import { canvas, openEditor, tableHeaders, tableNodes } from './editor';
import { expect, test } from './fixtures';

test('undoes and redoes a change', async ({ page, step }) => {
  const undo = page.getByRole('button', { name: 'Undo (CTRL + Z)' });
  const redo = page.getByRole('button', { name: 'Redo (CTRL + Y)' });

  await step('open the editor with table "users"', async () => {
    await openEditor(page);

    await expect(undo).toBeDisabled();

    await page.getByRole('button', { name: 'Add Table' }).click();
    await tableHeaders(page).getByRole('textbox').fill('users');
    await tableHeaders(page).getByRole('textbox').press('Enter');

    await expect(tableHeaders(page)).toHaveText(['users']);
  });

  await step('click Undo', async () => {
    await undo.click();

    await expect(tableNodes(page)).toHaveCount(0);
  });

  await step('click Redo', async () => {
    await redo.click();

    await expect(tableHeaders(page)).toHaveText(['users']);
    await expect(redo).toBeDisabled();
  });

  await step('press Ctrl+Z over the canvas', async () => {
    await canvas(page).click({ position: { x: 150, y: 500 } });
    await page.keyboard.press('Control+z');

    await expect(tableNodes(page)).toHaveCount(0);
    // The shortcuts read the undo history of the last render, so the next key waits for Redo to enable.
    await expect(redo).toBeEnabled();
  });

  await step('press Ctrl+Y', async () => {
    await page.keyboard.press('Control+y');
  });

  await step('see table "users" restored', async () => {
    await expect(tableHeaders(page)).toHaveText(['users']);
  });
});
