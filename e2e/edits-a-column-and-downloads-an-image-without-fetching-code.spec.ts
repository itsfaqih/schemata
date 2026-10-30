import { addTableAt, openEditor } from './editor';
import { expect, test } from './fixtures';

// Code that only an interaction reaches loads after the first paint, once the page is idle, so on a
// slow network the interaction never waits a round trip for it
test('edits a column and downloads an image without fetching code', async ({ page, step }) => {
  const scriptsFetched: string[] = [];

  await step('open the editor and let it settle', async () => {
    await openEditor(page);
    await page.waitForLoadState('networkidle');

    page.on('request', (request) => {
      if (request.resourceType() === 'script') scriptsFetched.push(request.url());
    });
  });

  await step('add table "users" and open a new column for editing', async () => {
    const table = await addTableAt(page, 'users', { x: 150, y: 100 });

    await table.hover();
    await table.getByRole('button', { name: /add field/i }).click();

    await expect(table.getByRole('combobox', { name: 'Type' })).toBeVisible();
  });

  await step('download the diagram as an image', async () => {
    const downloadStarted = page.waitForEvent('download');

    await page.getByRole('button', { name: 'Download as image' }).click();

    expect((await downloadStarted).suggestedFilename()).toBe('reactflow.png');
  });

  await step('see that no script was fetched after the editor settled', async () => {
    expect(scriptsFetched).toEqual([]);
  });
});
