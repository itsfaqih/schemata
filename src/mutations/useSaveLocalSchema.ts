import { localSchemaQuery } from '@/queries/useSchemaQuery';
import { SchemaType } from '@/schemas/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import localforage from 'localforage';

export function useSaveLocalSchema(id: SchemaType['id']) {
  const queryClient = useQueryClient();

  return useMutation<SchemaType, unknown, (currentSchema: SchemaType) => SchemaType>(
    async (updateSchema) => {
      let currentSchema = await localforage.getItem<SchemaType>(`schema-${id}`);

      if (!currentSchema) {
        const queryDataSchema = queryClient.getQueryData<SchemaType>(['schema', id]);

        if (!queryDataSchema) {
          throw Error('Schema not found');
        }

        currentSchema = queryDataSchema;
      }

      const newSchema = updateSchema(currentSchema);

      return await localforage.setItem<SchemaType>(`schema-${id}`, {
        ...newSchema,
        name: newSchema.name || currentSchema.name,
      });
    },
    {
      onSuccess(savedSchema) {
        // Refetches in the background; the mutation settles without waiting for them
        void queryClient.invalidateQueries(localSchemaQuery(savedSchema.id));
        void queryClient.invalidateQueries(localSchemaQuery());
      },
    },
  );
}
