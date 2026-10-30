import { canvas, menuItem, openEditor, tableHeaders } from './editor';
import { expect, test } from './fixtures';

test('navigates the canvas menu with the keyboard', async ({ page, step }) => {
  await step('open the editor', async () => {
    await openEditor(page);
  });

  await step('right-click the canvas, then move through the menu with the arrow keys', async () => {
    await canvas(page).click({ button: 'right', position: { x: 300, y: 300 } });
    await expect(page.getByRole('menu')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(menuItem(page, 'Add table')).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(menuItem(page, 'Paste')).toBeFocused();
  });

  await step('press Escape', async () => {
    await page.keyboard.press('Escape');

    await expect(page.getByRole('menu')).toHaveCount(0);
  });

  await step(
    'right-click the canvas again and press ArrowDown, then Enter on Add table',
    async () => {
      await canvas(page).click({ button: 'right', position: { x: 300, y: 300 } });
      await expect(page.getByRole('menu')).toBeFocused();
      await page.keyboard.press('ArrowDown');
      await expect(menuItem(page, 'Add table')).toBeFocused();
      await page.keyboard.press('Enter');

      await expect(tableHeaders(page).getByRole('textbox')).toBeFocused();
    },
  );
});
