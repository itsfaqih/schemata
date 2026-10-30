import { localSchemaQuery } from '@/queries/useSchemaQuery';
import { SchemaType } from '@/schemas/schema';
import { readSchema, writeSchema } from '@/utils/schema-storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useSaveLocalSchema(id: SchemaType['id']) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateSchema: (currentSchema: SchemaType) => SchemaType) => {
      const currentSchema =
        (await readSchema(id)) ?? queryClient.getQueryData<SchemaType>(['schema', id]);

      if (!currentSchema) {
        throw Error('Schema not found');
      }

      const newSchema = updateSchema(currentSchema);

      const savedSchema = { ...newSchema, name: newSchema.name || currentSchema.name };

      await writeSchema(savedSchema);

      return savedSchema;
    },
    onSuccess(savedSchema) {
      // Refetches in the background; the mutation settles without waiting for it
      void queryClient.invalidateQueries({ queryKey: localSchemaQuery(savedSchema.id).queryKey });
    },
  });
}
