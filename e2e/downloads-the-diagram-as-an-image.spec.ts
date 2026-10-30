import { readFile } from 'node:fs/promises';
import { addTableAt, openEditor } from './editor';
import { expect, test } from './fixtures';

test('downloads the diagram as an image', async ({ page, step }) => {
  await step('open the editor with table "users"', async () => {
    await openEditor(page);
    await addTableAt(page, 'users', { x: 150, y: 100 });
  });

  await step('click "Download as image" and see a PNG named reactflow.png', async () => {
    const downloadStarted = page.waitForEvent('download');

    await page.getByRole('button', { name: 'Download as image' }).click();

    const download = await downloadStarted;
    const file = await readFile(await download.path());

    expect(download.suggestedFilename()).toBe('reactflow.png');
    expect(file.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  });
});
