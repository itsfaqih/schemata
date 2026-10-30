import { localSchemaQuery, readStoredSchema } from '@/queries/useSchemaQuery';
import { SchemaType } from '@/schemas/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import localforage from 'localforage';

export function useSaveLocalSchema(id: SchemaType['id']) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateSchema: (currentSchema: SchemaType) => SchemaType) => {
      const currentSchema =
        (await readStoredSchema(`schema-${id}`)) ??
        queryClient.getQueryData<SchemaType>(['schema', id]);

      if (!currentSchema) {
        throw Error('Schema not found');
      }

      const newSchema = updateSchema(currentSchema);

      return await localforage.setItem<SchemaType>(`schema-${id}`, {
        ...newSchema,
        name: newSchema.name || currentSchema.name,
      });
    },
    onSuccess(savedSchema) {
      // Refetches in the background; the mutation settles without waiting for them
      void queryClient.invalidateQueries({ queryKey: localSchemaQuery(savedSchema.id).queryKey });
      void queryClient.invalidateQueries({ queryKey: localSchemaQuery().queryKey });
    },
  });
}
