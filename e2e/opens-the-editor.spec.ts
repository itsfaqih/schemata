import { openEditor, tableHeaders, tableNodes } from './editor';
import { expect, test } from './fixtures';

test('opens an empty untitled schema', async ({ page, step }) => {
  await step('open the editor', async () => {
    await openEditor(page);

    await expect(page.getByText('Untitled', { exact: true })).toBeVisible();
    await expect(tableNodes(page)).toHaveCount(0);
  });

  await step('add a table', async () => {
    await page.getByRole('button', { name: 'Add Table' }).click();
    await tableHeaders(page).getByRole('textbox').fill('users');
    await tableHeaders(page).getByRole('textbox').press('Enter');

    await expect(tableNodes(page)).toHaveCount(1);
  });

  await step('reload the page', async () => {
    await page.reload();

    await expect(page.getByRole('button', { name: 'Add Table' })).toBeVisible();
  });

  await step('see an empty untitled schema again', async () => {
    await expect(page.getByText('Untitled', { exact: true })).toBeVisible();
    await expect(tableNodes(page)).toHaveCount(0);
  });
});
