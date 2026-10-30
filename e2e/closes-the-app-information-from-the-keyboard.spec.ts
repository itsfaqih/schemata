import { openEditor } from './editor';
import { expect, test } from './fixtures';

test('closes the app information from the keyboard', async ({ page, step }) => {
  const information = page.getByRole('button', { name: 'Information' });
  const dialog = page.getByRole('dialog', { name: 'Information' });
  const close = dialog.getByRole('button', { name: 'Close' });
  const tooltip = page.getByRole('tooltip', { name: 'Close' });

  await step('open the editor', async () => {
    await openEditor(page);
  });

  await step('press Enter on Information', async () => {
    await information.press('Enter');

    await expect(close).toBeFocused();
    await expect(tooltip).toBeVisible();
    // The tooltip sits clear of Close once the dialog settles; 1px absorbs subpixel layout.
    await expect(async () => {
      const closeBox = await close.boundingBox();
      const tooltipBox = await tooltip.boundingBox();
      expect(closeBox && tooltipBox && tooltipBox.y + tooltipBox.height <= closeBox.y + 1).toBe(
        true,
      );
    }).toPass();
  });

  await step('press Escape to dismiss the tooltip', async () => {
    await page.keyboard.press('Escape');

    await expect(page.getByRole('tooltip')).toHaveCount(0);
    await expect(dialog).toBeVisible();
  });

  await step('press Escape again to close the dialog', async () => {
    await page.keyboard.press('Escape');

    await expect(dialog).toBeHidden();
    await expect(information).toBeFocused();
  });
});
