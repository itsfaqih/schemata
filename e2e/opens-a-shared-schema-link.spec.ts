import { columnNamed, tableHeaders, tableNamed } from './editor';
import { expect, test } from './fixtures';

const sharedSchema = {
  id: '0b6c6c0e-2f3a-4d34-9a4e-6f1f1d6f0a01',
  name: 'Acme',
  vendor: 'MYSQL:8.0',
  tables: [
    {
      id: '0b6c6c0e-2f3a-4d34-9a4e-6f1f1d6f0a02',
      name: 'organizations',
      columns: [
        {
          id: '0b6c6c0e-2f3a-4d34-9a4e-6f1f1d6f0a03',
          name: 'id',
          type: 'INTEGER',
          index: 0,
          attributes: [],
        },
      ],
      indexes: [
        {
          id: '0b6c6c0e-2f3a-4d34-9a4e-6f1f1d6f0a04',
          type: 'PRIMARY_KEY',
          columns: ['0b6c6c0e-2f3a-4d34-9a4e-6f1f1d6f0a03'],
        },
      ],
    },
    {
      id: '0b6c6c0e-2f3a-4d34-9a4e-6f1f1d6f0a05',
      name: 'users',
      columns: [
        {
          id: '0b6c6c0e-2f3a-4d34-9a4e-6f1f1d6f0a06',
          name: 'organization_id',
          type: 'INTEGER',
          index: 0,
          attributes: ['NULLABLE'],
        },
      ],
      indexes: [],
    },
  ],
  groups: [],
  positions: [
    { itemId: '0b6c6c0e-2f3a-4d34-9a4e-6f1f1d6f0a02', x: 100, y: 150 },
    { itemId: '0b6c6c0e-2f3a-4d34-9a4e-6f1f1d6f0a05', x: 700, y: 150 },
  ],
  relations: [
    {
      id: '0b6c6c0e-2f3a-4d34-9a4e-6f1f1d6f0a07',
      name: 'fk_organizations_users_id',
      source: {
        tableId: '0b6c6c0e-2f3a-4d34-9a4e-6f1f1d6f0a02',
        columnId: '0b6c6c0e-2f3a-4d34-9a4e-6f1f1d6f0a03',
      },
      target: {
        tableId: '0b6c6c0e-2f3a-4d34-9a4e-6f1f1d6f0a05',
        columnId: '0b6c6c0e-2f3a-4d34-9a4e-6f1f1d6f0a06',
      },
      actions: { onDelete: 'CASCADE', onUpdate: 'RESTRICT' },
    },
  ],
};

test('opens a shared schema link', async ({ page, step }) => {
  await step('open the editor from a link carrying schema "Acme"', async () => {
    await page.goto(`/?schema=${Buffer.from(JSON.stringify(sharedSchema)).toString('base64url')}`);
  });

  await step('see the schema with its tables, keys and relation', async () => {
    await expect(page.getByText('Acme', { exact: true })).toBeVisible();
    await expect(tableHeaders(page)).toHaveText(['organizations', 'users']);
    await expect(columnNamed(tableNamed(page, 'organizations'), 'id')).toContainText('Primary key');
    await expect(columnNamed(tableNamed(page, 'users'), 'organization_id')).toContainText(
      'Foreign key',
    );
    await expect(page.getByRole('button', { name: /^Edge from/ })).toHaveCount(1);
  });
});
