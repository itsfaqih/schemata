import { addTableAt, columns, openEditor } from './editor';
import { expect, test } from './fixtures';

test('rejects a too-long column name', async ({ page, step }) => {
  const table = page.getByTestId('table-node');
  const nameTextbox = table.getByLabel('Name');

  await step('open the editor with an empty table "orders"', async () => {
    await openEditor(page);
    await addTableAt(page, 'orders', { x: 150, y: 100 });
  });

  await step('add a column and submit a 65-character name with Enter', async () => {
    await table.hover();
    await table.getByRole('button', { name: /add field/i }).click();
    await nameTextbox.fill('shipping_address_line_two_for_international_orders_with_customs_o');
    await nameTextbox.press('Enter');
  });

  await step('see the name rejected for its length', async () => {
    await expect(table.getByText('String must contain at most 64 character(s)')).toBeVisible();
    await expect(nameTextbox).toHaveValue(
      'shipping_address_line_two_for_international_orders_with_customs_o',
    );
    await expect(columns(table)).toHaveText([/String must contain at most 64 character\(s\)/]);
  });
});
