import { addColumn, addTableAt, columnNamed, columns, openEditor } from './editor';
import { expect, test } from './fixtures';

test('reorders columns by dragging', async ({ page, step }) => {
  const table = page.getByTestId('table-node');

  await step('open the editor with table "users" holding "id", "name" and "email"', async () => {
    await openEditor(page);
    await addTableAt(page, 'users', { x: 150, y: 100 });
    await addColumn(table, 'id');
    await addColumn(table, 'name');
    await addColumn(table, 'email');

    await expect(columns(table)).toHaveText([/^id/, /^name/, /^email/]);
  });

  await step('drag "id" by its handle below "email"', async () => {
    await columnNamed(table, 'id')
      .getByRole('button')
      .dragTo(columnNamed(table, 'email'), { targetPosition: { x: 280, y: 40 }, steps: 10 });
  });

  await step('see "id" moved to the end', async () => {
    await expect(columns(table)).toHaveText([/^name/, /^email/, /^id/]);
  });
});
