import { useReactFlow } from '@xyflow/react';
import { useEditorActions } from '@/contexts/EditorStateContext';
import { useHandleEdgeMarker } from './useHandleEdgeMarker';
import { TableNodeType } from '@/schemas/table';
import { CreateRelationType, RelationEdgeType } from '@/schemas/relation';

export function useCreateRelation() {
  const { updateData } = useEditorActions();
  const reactFlowInstance = useReactFlow<TableNodeType, RelationEdgeType>();
  const handleEdgeMarker = useHandleEdgeMarker();

  return (newRelation: CreateRelationType) => {
    const newEdge: RelationEdgeType = {
      id: crypto.randomUUID(),
      source: newRelation.source.tableId,
      target: newRelation.target.tableId,
      sourceHandle: `${newRelation.source.columnId}-source-right`,
      targetHandle: `${newRelation.target.columnId}-target`,
      data: {
        name: newRelation.name,
        sourceColumnId: newRelation.source.columnId,
        targetColumnId: newRelation.target.columnId,
        actions: newRelation.actions,
      },
    };

    const { markerEnd, markerStart } = handleEdgeMarker(newEdge);

    reactFlowInstance.addEdges({
      ...newEdge,
      markerEnd,
      markerStart,
    });

    updateData(true);
  };
}
