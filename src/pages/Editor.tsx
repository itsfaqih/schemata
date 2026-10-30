import { Canvas } from '@/components/Canvas';
import { CreateRelationDialog } from '@/components/CreateRelationDialog';
import { EditorStateProvider } from '@/contexts/EditorStateContext';
import { localSchemaQuery } from '@/queries/useSchemaQuery';
import { useQuery } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { ReactFlowProvider } from '@xyflow/react';

export function Editor() {
  const openedSchema = useLoaderData({ from: '/' }).schema;

  const { data: schema } = useQuery({
    ...localSchemaQuery(openedSchema.id),
    initialData: openedSchema,
  });

  return (
    <ReactFlowProvider>
      <EditorStateProvider schema={schema}>
        <Canvas schema={schema} />
        <CreateRelationDialog schemaId={schema.id} />
      </EditorStateProvider>
    </ReactFlowProvider>
  );
}
