import { IndexType } from '@/schemas/base';
import { RelationEdgeType } from '@/schemas/relation';
import { TableNodeType } from '@/schemas/table';
import { getColumnIdFromHandleId } from '@/utils/reactflow';
import { Edge, useReactFlow } from '@xyflow/react';

export function useHandleEdgeMarker() {
  const reactFlowInstance = useReactFlow<TableNodeType, RelationEdgeType>();

  return (edge: Edge, indexes?: IndexType[]) => {
    const sourceColumnId = edge.sourceHandle ? getColumnIdFromHandleId(edge.sourceHandle) : '';

    const sourceNode = reactFlowInstance.getNode(edge.source);

    const finalIndexes: IndexType[] = indexes ?? sourceNode?.data.indexes ?? [];

    const isOneToOne = !!finalIndexes.find(
      (index) => index.type === 'UNIQUE_INDEX' && index.columns.includes(sourceColumnId),
    );

    return {
      markerStart: isOneToOne ? 'one' : 'many',
      markerEnd: 'one',
    };
  };
}
