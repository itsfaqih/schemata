import { addTableAt, reloadOnceStored, tableHeaders } from './editor';
import { expect, test } from './fixtures';

const sharedSchema = {
  id: '5b0c3e1a-7d2f-4c8e-9a6b-1f3d5e7a9c2b',
  name: 'Blog',
  vendor: 'MYSQL:8.0',
  tables: [{ id: '8e4a2c6b-1d3f-4b5a-9c7e-2f4a6b8c0d1e', name: 'posts', columns: [], indexes: [] }],
  groups: [],
  positions: [{ itemId: '8e4a2c6b-1d3f-4b5a-9c7e-2f4a6b8c0d1e', x: 100, y: 150 }],
  relations: [],
};

test('keeps edits made after opening a link', async ({ page, step }) => {
  await step('open a link carrying schema "Blog"', async () => {
    await page.goto(`/?schema=${Buffer.from(JSON.stringify(sharedSchema)).toString('base64url')}`);

    await expect(tableHeaders(page)).toHaveText(['posts']);
  });

  await step('see the link dropped from the address bar', async () => {
    await expect(page).not.toHaveURL(/\?schema=/);
  });

  await step('add table "comments"', async () => {
    await addTableAt(page, 'comments', { x: 600, y: 150 });
  });

  await step('reload the page', async () => {
    await reloadOnceStored(page, '"comments"');
  });

  await step('see "Blog" with both tables', async () => {
    await expect(page.getByText('Blog', { exact: true })).toBeVisible();
    await expect(tableHeaders(page)).toHaveText(['posts', 'comments']);
  });
});
