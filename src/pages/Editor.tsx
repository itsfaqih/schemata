import { Canvas } from '@/components/Canvas';
import { CreateRelationDialog } from '@/components/CreateRelationDialog';
import { EditorStateProvider } from '@/contexts/EditorStateContext';
import { useLocalSchemaQuery } from '@/queries/useSchemaQuery';
import { emptySchemaFactory } from '@/utils/schema';
import { useQueryClient } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import localforage from 'localforage';
import { useEffect, useRef } from 'react';
import { ReactFlowProvider } from '@xyflow/react';

const starterSchema = emptySchemaFactory();

export function Editor() {
  const queryClient = useQueryClient();
  const initialSchema = useLoaderData({ from: '/' }).schema ?? starterSchema;
  const mountedSchemaRef = useRef(initialSchema);

  const { data: schema, isPending, isSuccess } = useLocalSchemaQuery(initialSchema.id);

  // Seeds storage once, with the schema the editor mounted with
  useEffect(() => {
    const mountedSchema = mountedSchemaRef.current;

    // localforage runs queued operations in order, so the seed lands after the clear
    void localforage.clear();
    void localforage.setItem(`schema-${mountedSchema.id}`, mountedSchema);
    queryClient.setQueryData(['schema', mountedSchema.id], mountedSchema);
  }, [queryClient]);

  if (isPending) {
    return 'Loading';
  }

  if (isSuccess) {
    return (
      <ReactFlowProvider>
        <EditorStateProvider schema={schema}>
          <Canvas schema={schema} />
          <CreateRelationDialog />
        </EditorStateProvider>
      </ReactFlowProvider>
    );
  }

  throw Error('Failed to load schema');
}
