import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import localforage from 'localforage';
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

beforeEach(async () => {
  await localforage.clear();
});

it('reads a stored schema by its id', async () => {
  await localforage.setItem('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff', shop);

  await expect(fetchLocalSchema('6f9619ff-8b86-4d01-b42d-00cf4fc964ff')).resolves.toEqual(shop);
});

it('rejects an id with no stored schema', async () => {
  await localforage.setItem('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff', shop);

  await expect(fetchLocalSchema('0b6a1d3e-5a8f-4a39-9a52-4f9f2f1c7d10')).rejects.toThrow(
    'Local schema not found',
  );
});

it('reads the stored schema when no id is given', async () => {
  await localforage.setItem('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff', shop);
  await localforage.setItem('settings', { theme: 'dark' });

  await expect(fetchLocalSchema()).resolves.toEqual(shop);
});

it('rejects when no id is given and nothing is stored', async () => {
  await localforage.setItem('settings', { theme: 'dark' });

  await expect(fetchLocalSchema()).rejects.toThrow('Local schema not found');
});

it('shows the schema seeded in the cache before storage answers', async () => {
  await localforage.setItem('schema-6f9619ff-8b86-4d01-b42d-00cf4fc964ff', shop);
  const queryClient = new QueryClient();
  queryClient.setQueryData(['schema', '6f9619ff-8b86-4d01-b42d-00cf4fc964ff'], shop);

  const { result } = renderHook(() => useLocalSchemaQuery('6f9619ff-8b86-4d01-b42d-00cf4fc964ff'), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

  expect(result.current.data).toEqual(shop);
});
