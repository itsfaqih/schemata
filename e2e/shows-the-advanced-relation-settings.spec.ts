import { addColumn, addTableAt, columnNamed, menuItem, openEditor, tableNodes } from './editor';
import { expect, test } from './fixtures';

test('shows the advanced relation settings', async ({ page, step }) => {
  const dialog = page.getByRole('dialog', { name: 'Add Relation' });
  const advancedSettings = dialog.getByRole('checkbox', { name: 'Advanced settings' });
  const constraintName = dialog.getByRole('textbox', { name: 'Constraint name' });
  const organizationId = columnNamed(tableNodes(page).first(), 'id');

  await step('open the editor with tables "organizations" and "users"', async () => {
    await openEditor(page);
    await addColumn(await addTableAt(page, 'organizations', { x: 100, y: 150 }), 'id');
    await addColumn(await addTableAt(page, 'users', { x: 700, y: 150 }), 'organization_id');
  });

  await step('add a relation from organizations.id to users.organization_id', async () => {
    await organizationId.click({ button: 'right' });
    await menuItem(page, 'Add relation').click();
    await expect(dialog.getByRole('textbox', { name: 'Column' })).toHaveValue('id');
    await dialog.getByRole('combobox', { name: 'Table' }).fill('users');
    await dialog.getByRole('combobox', { name: 'Table' }).press('Enter');
    await dialog.getByRole('combobox', { name: 'Column' }).fill('organization_id');
    await dialog.getByRole('combobox', { name: 'Column' }).press('Enter');

    await expect(constraintName).toHaveCount(0);
  });

  await step('check Advanced settings', async () => {
    await advancedSettings.check();

    await expect(constraintName).toHaveValue('fk_organizations_users_id');
    await expect(dialog.getByRole('combobox', { name: 'On Update' })).toBeVisible();
    await expect(dialog.getByRole('combobox', { name: 'On Delete' })).toBeVisible();
  });

  await step('uncheck Advanced settings', async () => {
    await advancedSettings.uncheck();

    await expect(constraintName).toHaveCount(0);
    await expect(dialog.getByRole('combobox', { name: 'On Delete' })).toHaveCount(0);
  });
});
