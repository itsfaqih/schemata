import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import localforage from 'localforage';
import { ReactNode } from 'react';
import { beforeEach, expect, it } from 'vitest';
import { useLocalSchemaQuery } from '@/queries/useSchemaQuery';
import { SchemaType } from '@/schemas/schema';
import { useSaveLocalSchema } from './useSaveLocalSchema';

const shop: SchemaType = {
  id: '6f9619ff-8b86-4d01-b42d-00cf4fc964ff',
  name: 'Shop',
  vendor: 'MYSQL:8.0',
  tables: [],
  groups: [],
  positions: [],
  relations: [],
};

const position = { itemId: '2d1c3b4a-0f9e-4d8c-8b7a-6e5f4d3c2b1a', x: 40, y: 80 };

function renderWithClient<T>(queryClient: QueryClient, hook: () => T) {
  return renderHook(hook, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
}

function renderSave(queryClient: QueryClient) {
  return renderWithClient(queryClient, () =>
    useSaveLocalSchema('6f9619ff-8b86-4d01-b42d-00cf4fc964ff'),
  );
}

beforeEach(async () => {
  await localforage.clear();
});

it('keeps the stored name when the new schema has a blank name', async () => {
  await localforage.setItem('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff', shop);
  const { result } = renderSave(new QueryClient());

  await result.current.mutateAsync((current) => ({ ...current, name: '', positions: [position] }));

  await expect(localforage.getItem('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff')).resolves.toEqual(
    { ...shop, name: 'Shop', positions: [position] },
  );
});

it('applies an updater to the stored schema', async () => {
  await localforage.setItem('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff', shop);
  const { result } = renderSave(new QueryClient());

  await result.current.mutateAsync((current) => ({ ...current, positions: [position] }));

  await expect(localforage.getItem('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff')).resolves.toEqual(
    { ...shop, positions: [position] },
  );
});

it('falls back to the cached schema when storage has none', async () => {
  const queryClient = new QueryClient();
  queryClient.setQueryData(['schema', '6f9619ff-8b86-4d01-b42d-00cf4fc964ff'], shop);
  const { result } = renderSave(queryClient);

  await result.current.mutateAsync((current) => ({ ...current, positions: [position] }));

  await expect(localforage.getItem('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff')).resolves.toEqual(
    { ...shop, positions: [position] },
  );
});

it('rejects when neither storage nor the cache holds the schema', async () => {
  const { result } = renderSave(new QueryClient());

  await expect(result.current.mutateAsync(() => ({ ...shop, name: 'Store' }))).rejects.toThrow(
    'Schema not found',
  );
  await expect(localforage.getItem('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff')).resolves.toBe(
    null,
  );
});

it('leaves a stored schema that fails validation untouched', async () => {
  await localforage.setItem('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff', {
    ...shop,
    vendor: 'POSTGRES:16',
  });
  const { result } = renderSave(new QueryClient());

  await expect(
    result.current.mutateAsync((current) => ({ ...current, name: 'Store' })),
  ).rejects.toThrow(/vendor/);
  await expect(localforage.getItem('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff')).resolves.toEqual(
    { ...shop, vendor: 'POSTGRES:16' },
  );
});

it('refreshes mounted schema views after saving', async () => {
  await localforage.setItem('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff', shop);

  const { result } = renderWithClient(new QueryClient(), () => ({
    byId: useLocalSchemaQuery('6f9619ff-8b86-4d01-b42d-00cf4fc964ff'),
    current: useLocalSchemaQuery(),
    save: useSaveLocalSchema('6f9619ff-8b86-4d01-b42d-00cf4fc964ff'),
  }));

  await waitFor(() => {
    expect(result.current.byId.data).toEqual(shop);
    expect(result.current.current.data).toEqual(shop);
  });

  await result.current.save.mutateAsync((current) => ({ ...current, name: 'Store' }));

  await waitFor(() => {
    expect(result.current.byId.data).toEqual({ ...shop, name: 'Store' });
    expect(result.current.current.data).toEqual({ ...shop, name: 'Store' });
  });
});

it('leaves views of other schemas alone after saving', async () => {
  const warehouse = { ...shop, id: '0b6a1d3e-5a8f-4a39-9a52-4f9f2f1c7d10', name: 'Warehouse' };

  await localforage.setItem('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff', shop);
  await localforage.setItem('schema-0b6a1d3e-5a8f-4a39-9a52-4f9f2f1c7d10', warehouse);
  const queryClient = new QueryClient();

  const { result } = renderWithClient(queryClient, () => ({
    other: useLocalSchemaQuery('0b6a1d3e-5a8f-4a39-9a52-4f9f2f1c7d10'),
    save: useSaveLocalSchema('6f9619ff-8b86-4d01-b42d-00cf4fc964ff'),
  }));

  await waitFor(() => {
    expect(result.current.other.data).toEqual(warehouse);
  });
  await localforage.setItem('schema-0b6a1d3e-5a8f-4a39-9a52-4f9f2f1c7d10', {
    ...warehouse,
    name: 'Depot',
  });

  await result.current.save.mutateAsync((current) => ({ ...current, name: 'Store' }));
  await waitFor(() => {
    expect(queryClient.isFetching()).toBe(0);
  });

  expect(result.current.other.data).toEqual(warehouse);
});
