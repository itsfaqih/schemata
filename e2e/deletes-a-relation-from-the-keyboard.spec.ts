import {
  addColumn,
  addTableAt,
  clickRelationLine,
  columnNamed,
  menuItem,
  openEditor,
  relationLine,
} from './editor';
import { expect, test } from './fixtures';

test('deletes a relation from the keyboard', async ({ page, step }) => {
  const dialog = page.getByRole('dialog', { name: 'Add Relation' });
  const relation = page.getByRole('button', { name: /^Edge from/ });
  const userOrganizationId = columnNamed(page.getByTestId('table-node').last(), 'organization_id');

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
    await expect(userOrganizationId.getByText('Foreign key')).toBeAttached();
  });

  await step('click the relation line', async () => {
    await clickRelationLine(page);

    await expect(relationLine(page)).toBeFocused();
  });

  await step('press Delete', async () => {
    await page.keyboard.press('Delete');
  });

  await step('see the relation and its foreign key gone', async () => {
    await expect(relation).toHaveCount(0);
    await expect(userOrganizationId.getByText('Foreign key')).toHaveCount(0);
  });
});
