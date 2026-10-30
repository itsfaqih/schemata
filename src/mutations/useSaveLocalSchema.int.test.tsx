import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import localforage from 'localforage';
import { ReactNode } from 'react';
import { beforeEach, expect, it } from 'vitest';
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

function renderSave(queryClient: QueryClient) {
  return renderHook(() => useSaveLocalSchema('6f9619ff-8b86-4d01-b42d-00cf4fc964ff'), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
}

beforeEach(async () => {
  await localforage.clear();
});

it('stores the new schema over the stored one', async () => {
  await localforage.setItem('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff', shop);
  const { result } = renderSave(new QueryClient());

  await result.current.mutateAsync({ ...shop, name: 'Store', positions: [position] });

  await expect(localforage.getItem('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff')).resolves.toEqual(
    { ...shop, name: 'Store', positions: [position] },
  );
});

it('keeps the stored name when the new schema has a blank name', async () => {
  await localforage.setItem('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff', shop);
  const { result } = renderSave(new QueryClient());

  await result.current.mutateAsync({ ...shop, name: '', positions: [position] });

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

  await expect(result.current.mutateAsync({ ...shop, name: 'Store' })).rejects.toThrow(
    'Schema not found',
  );
  await expect(localforage.getItem('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff')).resolves.toBe(
    null,
  );
});
