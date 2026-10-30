import { openEditor } from './editor';
import { expect, test } from './fixtures';

test('shows the app information', async ({ page, step }) => {
  const dialog = page.getByRole('dialog', { name: 'Information' });

  await step('open the editor', async () => {
    await openEditor(page);
  });

  await step('click Information', async () => {
    await page.getByRole('button', { name: 'Information' }).click();

    await expect(dialog).toContainText('Alpha 0.23.1');
    await expect(dialog.getByRole('link', { name: '@ruine.dev' })).toHaveAttribute(
      'href',
      'https://github.com/ruine-dev',
    );
  });

  // The Close button's tooltip opens while the dialog is still sliding in and ends up covering the
  // button, so the dialog is closed by clicking outside it instead.
  await step('click outside the dialog', async () => {
    await page.mouse.click(20, 360);
  });

  await step('see the dialog gone', async () => {
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('button', { name: 'Information' })).toBeVisible();
  });
});
