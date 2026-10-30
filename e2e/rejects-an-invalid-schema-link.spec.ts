import { expect, test } from './fixtures';

test('rejects an invalid schema link', async ({ page, step }) => {
  await step('open the editor from a link whose schema is cut short', async () => {
    await page.goto(`/?schema=${Buffer.from('{"id":').toString('base64url')}`);
  });

  await step('see an error instead of the editor', async () => {
    await expect(page.getByText('Something went wrong!')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Table' })).toHaveCount(0);
  });

  await step('open the editor from a link carrying JSON that is not a schema', async () => {
    await page.goto(`/?schema=${Buffer.from(JSON.stringify({ id: 1 })).toString('base64url')}`);
  });

  await step('see an error instead of the editor again', async () => {
    await expect(page.getByText('Something went wrong!')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Table' })).toHaveCount(0);
  });
});
