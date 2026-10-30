import { SchemaSchema, SchemaType } from '@/schemas/schema';
import { useQuery } from '@tanstack/react-query';
import localforage from 'localforage';
import { extendPrototype } from 'localforage-startswith';

// Stryker disable next-line all: equivalent, the package already extends localforage on import
extendPrototype(localforage);

export async function readStoredSchema(key: string): Promise<SchemaType | null> {
  const stored: unknown = await localforage.getItem(key);

  return stored === null ? null : SchemaSchema.parse(stored);
}

export async function fetchLocalSchema(id?: SchemaType['id']): Promise<SchemaType> {
  const key = id ? `schema-${id}` : (await localforage.keysStartingWith('schema'))[0];
  const schema = key ? await readStoredSchema(key) : null;

  if (!schema) {
    throw Error('Local schema not found');
  }

  return schema;
}

export function localSchemaQuery(id?: SchemaType['id']) {
  return {
    queryKey: ['schema', id],
    queryFn: async () => await fetchLocalSchema(id),
  };
}

export function useLocalSchemaQuery(id?: SchemaType['id']) {
  return useQuery(localSchemaQuery(id));
}
