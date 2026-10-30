import { SchemaType } from '@/schemas/schema';
import { useQuery } from '@tanstack/react-query';
import localforage from 'localforage';
import { extendPrototype } from 'localforage-startswith';

extendPrototype(localforage);

export async function fetchLocalSchema(id?: SchemaType['id']): Promise<SchemaType> {
  let schema: SchemaType | undefined | null;

  if (!id) {
    const [firstSchemaKey] = await localforage.keysStartingWith('schema');

    schema = firstSchemaKey ? await localforage.getItem<SchemaType>(firstSchemaKey) : null;
  } else {
    schema = await localforage.getItem<SchemaType>(`schema-${id}`);
  }

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
