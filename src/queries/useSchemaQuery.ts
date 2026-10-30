import { SchemaType } from '@/schemas/schema';
import { readSchema } from '@/utils/schema-storage';
import { useQuery } from '@tanstack/react-query';

export async function fetchLocalSchema(id: SchemaType['id']): Promise<SchemaType> {
  const schema = await readSchema(id);

  if (!schema) {
    throw Error('Local schema not found');
  }

  return schema;
}

export function localSchemaQuery(id: SchemaType['id']) {
  return {
    queryKey: ['schema', id],
    queryFn: async () => await fetchLocalSchema(id),
  };
}

export function useLocalSchemaQuery(id: SchemaType['id']) {
  return useQuery(localSchemaQuery(id));
}
