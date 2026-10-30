import { menuItem, openEditor, tableHeaders } from './editor';
import { expect, test } from './fixtures';

test('renames a table', async ({ page, step }) => {
  const header = tableHeaders(page);
  const nameInput = header.getByRole('textbox');

  await step('open the editor with an untitled table', async () => {
    await openEditor(page);
    await page.getByRole('button', { name: 'Add Table' }).click();
    await nameInput.press('Enter');

    await expect(header).toHaveText('untitled');
  });

  await step('press E on the header and submit "foo" with Enter', async () => {
    await header.press('e');
    await nameInput.fill('foo');
    await nameInput.press('Enter');

    await expect(header).toHaveText('foo');
  });

  await step('choose Rename in the header menu and submit "bar" with Escape', async () => {
    await header.click({ button: 'right' });
    await menuItem(page, 'Rename').click();
    await nameInput.fill('bar');
    await nameInput.press('Escape');

    await expect(header).toHaveText('bar');
  });

  await step('double-click the header and submit "baz" with Enter', async () => {
    await header.dblclick();
    await nameInput.fill('baz');
    await nameInput.press('Enter');
  });

  await step('see the new table name', async () => {
    await expect(header).toHaveText('baz');
  });
});
