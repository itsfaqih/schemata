import { openEditor } from './editor';
import { expect, test } from './fixtures';

test('renames the schema', async ({ page, step }) => {
  const changeTitle = page.getByRole('button', { name: 'Change title' });
  const nameTextbox = page.getByRole('textbox', { name: 'Name' });

  await step('open the editor', async () => {
    await openEditor(page);

    await expect(page.getByText('Untitled', { exact: true })).toBeVisible();
  });

  await step('rename to "Foo" and click Save', async () => {
    await changeTitle.click();
    await nameTextbox.fill('Foo');
    await page.getByRole('button', { name: 'Save (ENTER)' }).click();

    await expect(page.getByText('Foo', { exact: true })).toBeVisible();
  });

  await step('rename to "Bar" and press Enter', async () => {
    await changeTitle.click();
    await nameTextbox.fill('Bar');
    await nameTextbox.press('Enter');
  });

  await step('see the new schema name', async () => {
    await expect(page.getByText('Bar', { exact: true })).toBeVisible();
    await expect(changeTitle).toBeVisible();
  });
});
