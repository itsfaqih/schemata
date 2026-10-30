import { canvas, menuItem, openEditor, tableHeaders } from './editor';
import { expect, test } from './fixtures';

test('creates a table', { tag: '@smoke' }, async ({ page, step }) => {
  const addTableButton = page.getByRole('button', { name: 'Add Table' });

  await step('open the editor', async () => {
    await openEditor(page);
  });

  await step('click "Add Table" and submit no name with Enter', async () => {
    await addTableButton.click();
    await tableHeaders(page).getByRole('textbox').press('Enter');

    await expect(tableHeaders(page)).toHaveText(['untitled']);
  });

  await step('press T on the canvas and submit "orders" with Escape', async () => {
    await canvas(page).click({ position: { x: 150, y: 150 } });
    await page.keyboard.press('t');
    await tableHeaders(page).getByRole('textbox').fill('orders');
    await tableHeaders(page).getByRole('textbox').press('Escape');

    await expect(tableHeaders(page)).toHaveText(['untitled', 'orders']);
  });

  await step('drag "Add Table" onto the canvas and submit "users" with Enter', async () => {
    await addTableButton.dragTo(canvas(page), { targetPosition: { x: 150, y: 450 } });
    await tableHeaders(page).getByRole('textbox').fill('users');
    await tableHeaders(page).getByRole('textbox').press('Enter');

    await expect(tableHeaders(page)).toHaveText(['untitled', 'orders', 'users']);
  });

  await step('choose "Add table" in the canvas menu and submit no name with Escape', async () => {
    await canvas(page).click({ button: 'right', position: { x: 850, y: 450 } });
    await menuItem(page, 'Add table').click();
    await tableHeaders(page).getByRole('textbox').press('Escape');
  });

  await step('see the four new tables', async () => {
    await expect(tableHeaders(page)).toHaveText(['untitled', 'orders', 'users', 'untitled']);
  });
});
