import { openEditor, tableNodes } from './editor';
import { expect, test } from './fixtures';

test('opens an empty untitled schema', async ({ page, step }) => {
  await step('open the editor for the first time', async () => {
    await openEditor(page);
  });

  await step('see an empty untitled schema', async () => {
    await expect(page.getByText('Untitled', { exact: true })).toBeVisible();
    await expect(tableNodes(page)).toHaveCount(0);
  });
});
