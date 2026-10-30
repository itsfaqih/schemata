import { addColumn, addTableAt, columnNamed, menuItem, openEditor, relationMenu } from './editor';
import { expect, test } from './fixtures';

test('adds, reverses and deletes a relation', { tag: '@smoke' }, async ({ page, step }) => {
  const dialog = page.getByRole('dialog', { name: 'Add Relation' });
  const organizationId = columnNamed(page.getByTestId('table-node').first(), 'id');
  const userOrganizationId = columnNamed(page.getByTestId('table-node').last(), 'organization_id');

  await step('open the editor with tables "organizations" and "users"', async () => {
    await openEditor(page);
    await addColumn(await addTableAt(page, 'organizations', { x: 100, y: 150 }), 'id');
    await addColumn(await addTableAt(page, 'users', { x: 700, y: 150 }), 'organization_id');
  });

  await step('choose "Add relation" in the menu of column organizations.id', async () => {
    await organizationId.click({ button: 'right' });
    await menuItem(page, 'Add relation').click();

    await expect(dialog.getByRole('textbox', { name: 'Table' })).toHaveValue('organizations');
    await expect(dialog.getByRole('textbox', { name: 'Column' })).toHaveValue('id');
  });

  await step('pick target users.organization_id and save', async () => {
    // The pickers' options have no role, so each name is typed until it is the only match.
    await dialog.getByRole('combobox', { name: 'Table' }).fill('users');
    await dialog.getByRole('combobox', { name: 'Table' }).press('Enter');
    await dialog.getByRole('combobox', { name: 'Column' }).fill('organization_id');
    await dialog.getByRole('combobox', { name: 'Column' }).press('Enter');
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(dialog).toBeHidden();
    await expect(userOrganizationId.getByText('Foreign key')).toBeAttached();
    await expect(organizationId.getByText('Foreign key')).toHaveCount(0);
  });

  await step('choose Reverse in the relation menu', async () => {
    await relationMenu(page);
    await menuItem(page, 'Reverse').click();

    await expect(organizationId.getByText('Foreign key')).toBeAttached();
    await expect(userOrganizationId.getByText('Foreign key')).toHaveCount(0);
  });

  await step('choose Delete in the relation menu', async () => {
    await relationMenu(page);
    await menuItem(page, 'Delete').click();
  });

  await step('see no foreign key left', async () => {
    await expect(page.getByRole('group', { name: /^Edge from/ })).toHaveCount(0);
    await expect(organizationId.getByText('Foreign key')).toHaveCount(0);
    await expect(userOrganizationId.getByText('Foreign key')).toHaveCount(0);
  });
});
