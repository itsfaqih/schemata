import { addColumn, addTableAt, columnNamed, menuItem, openEditor, relationMenu } from './editor';
import { expect, test } from './fixtures';

test('navigates the relation menu with the keyboard', async ({ page, step }) => {
  const dialog = page.getByRole('dialog', { name: 'Add Relation' });
  const relationMenuButton = page.getByRole('group', { name: /^Edge from/ }).getByRole('button');
  const organizationId = columnNamed(page.getByTestId('table-node').first(), 'id');
  const userOrganizationId = columnNamed(page.getByTestId('table-node').last(), 'organization_id');

  await step('open the editor with organizations.id related to users.organization_id', async () => {
    await openEditor(page);
    await addColumn(await addTableAt(page, 'organizations', { x: 100, y: 150 }), 'id');
    await addColumn(await addTableAt(page, 'users', { x: 700, y: 150 }), 'organization_id');

    await organizationId.click({ button: 'right' });
    await menuItem(page, 'Add relation').click();
    await expect(dialog.getByRole('textbox', { name: 'Column' })).toHaveValue('id');
    await dialog.getByRole('combobox', { name: 'Table' }).fill('users');
    await dialog.getByRole('combobox', { name: 'Table' }).press('Enter');
    await dialog.getByRole('combobox', { name: 'Column' }).fill('organization_id');
    await dialog.getByRole('combobox', { name: 'Column' }).press('Enter');
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(userOrganizationId.getByText('Foreign key')).toBeAttached();
  });

  await step(
    'click the relation menu button, then move through it with the arrow keys',
    async () => {
      await relationMenu(page);
      await expect(page.getByRole('menu')).toBeFocused();
      await page.keyboard.press('ArrowDown');
      await expect(menuItem(page, 'Reverse')).toBeFocused();

      await page.keyboard.press('ArrowDown');
      await expect(menuItem(page, 'Delete')).toBeFocused();

      await page.keyboard.press('ArrowUp');
      await expect(menuItem(page, 'Reverse')).toBeFocused();
    },
  );

  await step('press Escape', async () => {
    await page.keyboard.press('Escape');

    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(relationMenuButton).toBeFocused();
  });

  await step('press Enter twice to choose Reverse', async () => {
    await page.keyboard.press('Enter');
    await expect(menuItem(page, 'Reverse')).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(organizationId.getByText('Foreign key')).toBeAttached();
    await expect(userOrganizationId.getByText('Foreign key')).toHaveCount(0);
  });
});
