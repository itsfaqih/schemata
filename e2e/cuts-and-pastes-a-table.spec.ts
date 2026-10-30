import { addTableAt, canvas, menuItem, openEditor, tableHeaders, tableNodes } from './editor';
import { expect, test } from './fixtures';

test('cuts and pastes a table', async ({ page, step }) => {
  await step('open the editor with table "foo"', async () => {
    await openEditor(page);
    await addTableAt(page, 'foo', { x: 100, y: 100 });
  });

  await step('choose Cut in the header menu', async () => {
    await tableHeaders(page).click({ button: 'right' });
    await menuItem(page, 'Cut').click();

    await expect(tableNodes(page)).toHaveCount(0);
  });

  await step('choose Paste in the canvas menu', async () => {
    await canvas(page).click({ button: 'right', position: { x: 600, y: 100 } });
    await menuItem(page, 'Paste').click();

    await expect(tableHeaders(page)).toHaveText(['foo']);
  });

  await step('press Ctrl+X on the header', async () => {
    await tableHeaders(page).press('Control+x');

    await expect(tableNodes(page)).toHaveCount(0);
  });

  await step('press Ctrl+V over the canvas', async () => {
    await canvas(page).click({ position: { x: 100, y: 400 } });
    await page.keyboard.press('Control+v');
  });

  await step('see table "foo" back on the canvas', async () => {
    await expect(tableHeaders(page)).toHaveText(['foo']);
  });
});
