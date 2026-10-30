import { useReactFlow } from '@xyflow/react';
import { useEditorState } from '@/contexts/EditorStateContext';
import { TableNodeType } from '@/schemas/table';
import { RelationType, RelationEdgeType } from '@/schemas/relation';

export function useReverseRelation() {
  const { undoableService } = useEditorState();
  const reactFlowInstance = useReactFlow<TableNodeType, RelationEdgeType>();

  return (relationId: RelationType['id']) => {
    reactFlowInstance.setEdges((edges) => {
      return edges.map((edge) => {
        if (edge.id !== relationId) {
          return edge;
        }

        const reversedEdge = {
          ...edge,
          source: edge.target,
          sourceHandle: `${edge.data?.targetColumnId}-source-right`,
          target: edge.source,
          targetHandle: `${edge.data?.sourceColumnId}-target`,
        };

        if (!edge.data) {
          return reversedEdge;
        }

        return {
          ...reversedEdge,
          data: {
            name: edge.data.name,
            actions: edge.data.actions,
            sourceColumnId: edge.data.targetColumnId,
            targetColumnId: edge.data.sourceColumnId,
          },
        };
      });
    });

    undoableService.updateData(true);
  };
}
