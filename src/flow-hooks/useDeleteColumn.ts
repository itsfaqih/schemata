import { useEditorState } from '@/contexts/EditorStateContext';
import { DeleteColumnType } from '@/schemas/delete-column';
import { TableNodeType } from '@/schemas/table';
import { getColumnIdFromHandleId } from '@/utils/reactflow';
import { useReactFlow } from '@xyflow/react';

export function useDeleteColumn() {
  const { undoableService } = useEditorState();
  const reactFlowInstance = useReactFlow<TableNodeType>();

  return (columnPayload: DeleteColumnType) => {
    const { tableId, id } = columnPayload;

    reactFlowInstance.setNodes((currentNodes) => {
      return currentNodes.map((node) => {
        if (node.id === tableId) {
          return {
            ...node,
            data: {
              ...node.data,
              columns: node.data.columns.filter((column) => column.id !== id),
            },
          };
        }

        return node;
      });
    });

    reactFlowInstance.setEdges((currentEdges) => {
      return currentEdges.filter((edge) => {
        return (
          edge.targetHandle &&
          getColumnIdFromHandleId(edge.targetHandle) !== id &&
          edge.sourceHandle &&
          getColumnIdFromHandleId(edge.sourceHandle) !== id
        );
      });
    });

    undoableService.updateData(true);
  };
}
