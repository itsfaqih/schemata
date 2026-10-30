import { addColumn, addTableAt, columnNamed, openEditor, tableHeaders, tableNamed } from './editor';
import { expect, test } from './fixtures';

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test('keeps tables when renaming the schema', async ({ page, step }) => {
  await step('open the editor', async () => {
    await openEditor(page);
  });

  await step('add table "users" with column "email"', async () => {
    await addColumn(await addTableAt(page, 'users', { x: 100, y: 150 }), 'email');
  });

  await step('rename the schema to "Blog"', async () => {
    await page.getByRole('button', { name: 'Change title' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Blog');
    await page.getByRole('textbox', { name: 'Name' }).press('Enter');

    await expect(page.getByText('Blog', { exact: true })).toBeVisible();
  });

  await step('copy the share link and open it', async () => {
    await page.getByRole('button', { name: 'Share link (CTRL + S)' }).click();
    await expect(page.getByText('URL copied to clipboard')).toBeVisible();

    const link = await page.evaluate(async () => await navigator.clipboard.readText());

    await page.goto(link);
  });

  await step('see the renamed schema with its table', async () => {
    await expect(page.getByText('Blog', { exact: true })).toBeVisible();
    await expect(tableHeaders(page)).toHaveText(['users']);
    await expect(columnNamed(tableNamed(page, 'users'), 'email')).toBeVisible();
  });
});
