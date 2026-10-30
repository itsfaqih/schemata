import { openEditor } from './editor';
import { expect, test } from './fixtures';

test('zooms the canvas', async ({ page, step }) => {
  // The level is a bare text node between the zoom buttons, so the deepest element holding it is located.
  const zoomLevel = page.getByText(/\d+%/);

  await step('open the editor at 100% zoom', async () => {
    await openEditor(page);

    await expect(zoomLevel).toContainText('100%');
  });

  await step('click Zoom in', async () => {
    await page.getByRole('button', { name: 'Zoom in' }).click();

    await expect(zoomLevel).toContainText('120%');
  });

  await step('click Zoom out twice', async () => {
    await page.getByRole('button', { name: 'Zoom out' }).click();
    await page.getByRole('button', { name: 'Zoom out' }).click();
  });

  await step('see the zoom level at 83%', async () => {
    await expect(zoomLevel).toContainText('83%');
  });
});
