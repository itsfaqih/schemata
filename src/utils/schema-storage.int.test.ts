import { clear, createStore, get, set } from 'idb-keyval';
import { beforeEach, expect, it } from 'vitest';
import { SchemaType } from '@/schemas/schema';
import { openSchema, readCurrentSchema, readSchema, writeSchema } from './schema-storage';

const shop: SchemaType = {
  id: '6f9619ff-8b86-4d01-b42d-00cf4fc964ff',
  name: 'Shop',
  vendor: 'MYSQL:8.0',
  tables: [],
  groups: [],
  positions: [],
  relations: [],
};

const warehouse: SchemaType = {
  ...shop,
  id: '0b6a1d3e-5a8f-4a39-9a52-4f9f2f1c7d10',
  name: 'Warehouse',
};

const store = createStore('schemata', 'schemas');

beforeEach(async () => {
  await clear(store);
});

it('reads back a written schema by its id', async () => {
  await writeSchema(shop);
  await writeSchema(warehouse);

  await expect(readSchema(shop.id)).resolves.toEqual(shop);
  await expect(readSchema(warehouse.id)).resolves.toEqual(warehouse);
});

it('reads nothing for an id that was never written', async () => {
  await writeSchema(shop);

  await expect(readSchema(warehouse.id)).resolves.toBeNull();
});

it('rejects a stored schema that fails validation', async () => {
  await set(`schema-${shop.id}`, { ...shop, vendor: 'POSTGRES:16' }, store);

  await expect(readSchema(shop.id)).rejects.toThrow(/vendor/);
});

it('opens nothing before any schema was opened', async () => {
  await writeSchema(shop);

  await expect(readCurrentSchema()).resolves.toBeNull();
});

it('reopens the schema opened last, with the edits written since', async () => {
  await openSchema(shop);
  await openSchema(warehouse);
  await writeSchema({ ...warehouse, name: 'Depot' });

  await expect(readCurrentSchema()).resolves.toEqual({ ...warehouse, name: 'Depot' });
  await expect(readSchema(shop.id)).resolves.toEqual(shop);
});

it('opens nothing when the last schema no longer decodes, and keeps it stored', async () => {
  await openSchema(shop);
  await set(`schema-${shop.id}`, { ...shop, vendor: 'POSTGRES:16' }, store);

  await expect(readCurrentSchema()).resolves.toBeNull();
  await expect(get(`schema-${shop.id}`, store)).resolves.toEqual({
    ...shop,
    vendor: 'POSTGRES:16',
  });
});

it('opens nothing when the last schema id has no schema', async () => {
  await set('current-schema-id', shop.id, store);

  await expect(readCurrentSchema()).resolves.toBeNull();
});

it('opens nothing when the schema under the current id carries another id', async () => {
  await set(`schema-${warehouse.id}`, shop, store);
  await set('current-schema-id', warehouse.id, store);

  await expect(readCurrentSchema()).resolves.toBeNull();
});

// Pins the stored keys, so a schema saved by one release opens in the next
it('opens the schema named by the stored current id', async () => {
  await set(`schema-${shop.id}`, shop, store);
  await set('current-schema-id', shop.id, store);

  await expect(readCurrentSchema()).resolves.toEqual(shop);
});
