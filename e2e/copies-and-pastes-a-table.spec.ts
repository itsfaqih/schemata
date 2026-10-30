import { addTableAt, canvas, menuItem, openEditor, tableHeaders } from './editor';
import { expect, test } from './fixtures';

test('copies and pastes a table', async ({ page, step }) => {
  await step('open the editor with table "foo"', async () => {
    await openEditor(page);
    await addTableAt(page, 'foo', { x: 100, y: 100 });
  });

  await step('choose Paste in the canvas menu while nothing is copied', async () => {
    await canvas(page).click({ button: 'right', position: { x: 600, y: 100 } });
    await menuItem(page, 'Paste').click();

    await expect(tableHeaders(page)).toHaveText(['foo']);
  });

  await step('choose Copy in the header menu, then Paste in the canvas menu', async () => {
    await tableHeaders(page).first().click({ button: 'right' });
    await menuItem(page, 'Copy').click();
    await canvas(page).click({ button: 'right', position: { x: 600, y: 100 } });
    await menuItem(page, 'Paste').click();

    await expect(tableHeaders(page)).toHaveText(['foo', 'foo']);
  });

  await step('press Ctrl+C on the header, then Ctrl+V over the canvas', async () => {
    await tableHeaders(page).first().press('Control+c');
    await canvas(page).click({ position: { x: 100, y: 400 } });
    await page.keyboard.press('Control+v');
  });

  await step('see three "foo" tables', async () => {
    await expect(tableHeaders(page)).toHaveText(['foo', 'foo', 'foo']);
  });
});
