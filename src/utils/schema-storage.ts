import { SchemaSchema, SchemaType } from '@/schemas/schema';
import { createStore, get, set, setMany } from 'idb-keyval';

const store = createStore('schemata', 'schemas');

const currentSchemaIdKey = 'current-schema-id';

function schemaKey(id: SchemaType['id']): string {
  return `schema-${id}`;
}

export async function readSchema(id: SchemaType['id']): Promise<SchemaType | null> {
  const stored: unknown = await get(schemaKey(id), store);

  return stored === undefined ? null : SchemaSchema.parse(stored);
}

export async function writeSchema(schema: SchemaType): Promise<void> {
  await set(schemaKey(schema.id), schema, store);
}

// The next page load opens this schema
export async function openSchema(schema: SchemaType): Promise<void> {
  await setMany(
    [
      [schemaKey(schema.id), schema],
      [currentSchemaIdKey, schema.id],
    ],
    store,
  );
}

// A bad record stays stored but is not opened, so it cannot lock the editor. A schema stored under another id is bad
// too: its edits would save to its own key while every reload reads this one
export async function readCurrentSchema(): Promise<SchemaType | null> {
  const id: unknown = await get(currentSchemaIdKey, store);
  const parsed = SchemaSchema.safeParse(await get(`schema-${String(id)}`, store));

  return parsed.success && parsed.data.id === id ? parsed.data : null;
}
