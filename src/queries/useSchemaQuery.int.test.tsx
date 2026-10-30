import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { clear, createStore, set } from 'idb-keyval';
import { ReactNode } from 'react';
import { beforeEach, expect, it } from 'vitest';
import { fetchLocalSchema, useLocalSchemaQuery } from './useSchemaQuery';

const shop = {
  id: '6f9619ff-8b86-4d01-b42d-00cf4fc964ff',
  name: 'Shop',
  vendor: 'MYSQL:8.0',
  tables: [],
  groups: [],
  positions: [],
  relations: [],
};

const store = createStore('schemata', 'schemas');

beforeEach(async () => {
  await clear(store);
});

it('reads a stored schema by its id', async () => {
  await set('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff', shop, store);

  await expect(fetchLocalSchema('6f9619ff-8b86-4d01-b42d-00cf4fc964ff')).resolves.toEqual(shop);
});

it('rejects an id with no stored schema', async () => {
  await set('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff', shop, store);

  await expect(fetchLocalSchema('0b6a1d3e-5a8f-4a39-9a52-4f9f2f1c7d10')).rejects.toThrow(
    'Local schema not found',
  );
});

it('rejects a stored schema that fails validation', async () => {
  await set(
    'schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff',
    {
      ...shop,
      vendor: 'POSTGRES:16',
    },
    store,
  );

  await expect(fetchLocalSchema('6f9619ff-8b86-4d01-b42d-00cf4fc964ff')).rejects.toThrow(/vendor/);
});

it('fills in what a schema stored by an older version lacks', async () => {
  await set(
    'schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff',
    {
      ...shop,
      tables: [
        {
          id: '3e1f2a4b-5c6d-4e7f-8a9b-0c1d2e3f4a5b',
          name: 'orders',
          indexes: [],
          columns: [
            {
              id: '7a8b9c0d-1e2f-4a3b-9c4d-5e6f7a8b9c0d',
              name: 'code',
              index: 0,
              type: 'VARCHAR',
              length: 0,
              attributes: ['NOT_NULL', 'NOT_NULL'],
            },
            {
              id: '1b2c3d4e-5f6a-4b7c-8d9e-0f1a2b3c4d5e',
              name: 'parent_id',
              index: 1,
              type: 'INTEGER',
              attributes: [],
            },
          ],
        },
      ],
      positions: [{ itemId: '3e1f2a4b-5c6d-4e7f-8a9b-0c1d2e3f4a5b', x: 0, y: 0 }],
      relations: [
        {
          id: '9d8c7b6a-5f4e-4d3c-ab2a-1f0e9d8c7b6a',
          source: {
            columnId: '1b2c3d4e-5f6a-4b7c-8d9e-0f1a2b3c4d5e',
            tableId: '3e1f2a4b-5c6d-4e7f-8a9b-0c1d2e3f4a5b',
          },
          target: {
            columnId: '7a8b9c0d-1e2f-4a3b-9c4d-5e6f7a8b9c0d',
            tableId: '3e1f2a4b-5c6d-4e7f-8a9b-0c1d2e3f4a5b',
          },
        },
      ],
    },
    store,
  );

  await expect(fetchLocalSchema('6f9619ff-8b86-4d01-b42d-00cf4fc964ff')).resolves.toStrictEqual({
    ...shop,
    tables: [
      {
        id: '3e1f2a4b-5c6d-4e7f-8a9b-0c1d2e3f4a5b',
        name: 'orders',
        indexes: [],
        columns: [
          {
            id: '7a8b9c0d-1e2f-4a3b-9c4d-5e6f7a8b9c0d',
            name: 'code',
            index: 0,
            type: 'VARCHAR',
            length: 255,
            attributes: ['NOT_NULL'],
          },
          {
            id: '1b2c3d4e-5f6a-4b7c-8d9e-0f1a2b3c4d5e',
            name: 'parent_id',
            index: 1,
            type: 'INTEGER',
            attributes: [],
          },
        ],
      },
    ],
    positions: [{ itemId: '3e1f2a4b-5c6d-4e7f-8a9b-0c1d2e3f4a5b', x: 0, y: 0 }],
    relations: [
      {
        id: '9d8c7b6a-5f4e-4d3c-ab2a-1f0e9d8c7b6a',
        name: 'fk',
        source: {
          columnId: '1b2c3d4e-5f6a-4b7c-8d9e-0f1a2b3c4d5e',
          tableId: '3e1f2a4b-5c6d-4e7f-8a9b-0c1d2e3f4a5b',
        },
        target: {
          columnId: '7a8b9c0d-1e2f-4a3b-9c4d-5e6f7a8b9c0d',
          tableId: '3e1f2a4b-5c6d-4e7f-8a9b-0c1d2e3f4a5b',
        },
        actions: { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
      },
    ],
  });
});

it('shows the schema seeded in the cache before storage answers', async () => {
  await set('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff', shop, store);
  const queryClient = new QueryClient();
  queryClient.setQueryData(['schema', '6f9619ff-8b86-4d01-b42d-00cf4fc964ff'], shop);

  const { result } = renderHook(() => useLocalSchemaQuery('6f9619ff-8b86-4d01-b42d-00cf4fc964ff'), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

  expect(result.current.data).toEqual(shop);
});
