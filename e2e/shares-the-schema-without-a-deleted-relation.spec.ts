import {
  addColumn,
  addTableAt,
  clickRelationLine,
  menuItem,
  openEditor,
  tableHeaders,
} from './editor';
import { expect, test } from './fixtures';

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test('shares the schema without a deleted relation', async ({ page, step }) => {
  const dialog = page.getByRole('dialog', { name: 'Add Relation' });
  const relation = page.getByRole('group', { name: /^Edge from/ });

  await step('open the editor with organizations.id related to users.organization_id', async () => {
    await openEditor(page);

    const organizationId = await addColumn(
      await addTableAt(page, 'organizations', { x: 100, y: 150 }),
      'id',
    );

    await addColumn(await addTableAt(page, 'users', { x: 700, y: 150 }), 'organization_id');

    await organizationId.click({ button: 'right' });
    await menuItem(page, 'Add relation').click();
    await expect(dialog.getByRole('textbox', { name: 'Column' })).toHaveValue('id');
    await dialog.getByRole('combobox', { name: 'Table' }).fill('users');
    await dialog.getByRole('combobox', { name: 'Table' }).press('Enter');
    await dialog.getByRole('combobox', { name: 'Column' }).fill('organization_id');
    await dialog.getByRole('combobox', { name: 'Column' }).press('Enter');
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(relation).toHaveCount(1);
  });

  await step('click the relation line and press Delete', async () => {
    await clickRelationLine(page);
    await page.keyboard.press('Delete');

    await expect(relation).toHaveCount(0);
  });

  await step('copy the share link and open it', async () => {
    await page.getByRole('button', { name: 'Share link (CTRL + S)' }).click();
    await expect(page.getByText('URL copied to clipboard')).toBeVisible();

    const link = await page.evaluate(async () => await navigator.clipboard.readText());

    await page.goto(link);
  });

  await step('see both tables and no relation', async () => {
    await expect(tableHeaders(page)).toHaveText(['organizations', 'users']);
    await expect(relation).toHaveCount(0);
  });
});
