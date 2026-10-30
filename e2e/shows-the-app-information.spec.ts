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
    // Focus lands on Close as the dialog opens; a click is not keyboard focus, so no tooltip shows.
    await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();
    await expect(page.getByRole('tooltip')).toHaveCount(0);
  });

  await step('click Close', async () => {
    await dialog.getByRole('button', { name: 'Close' }).click();

    await expect(dialog).toBeHidden();
  });

  await step('click Information again, then click outside the dialog', async () => {
    await page.getByRole('button', { name: 'Information' }).click();
    await expect(dialog).toBeVisible();
    await page.mouse.click(20, 360);
  });

  await step('see the dialog gone', async () => {
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('button', { name: 'Information' })).toBeVisible();
  });
});
