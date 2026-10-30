import { useEditorState } from '@/contexts/EditorStateContext';
import { TableType, TableNodeType } from '@/schemas/table';
import { useReactFlow } from '@xyflow/react';

export function useUpdateTable() {
  const { undoableService } = useEditorState();
  const reactFlowInstance = useReactFlow<TableNodeType>();

  return (newTable: TableType) => {
    const { id, name, ...tablePayload } = newTable;

    reactFlowInstance.setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              name: name || 'untitled',
              ...tablePayload,
            },
          };
        }

        return node;
      }),
    );

    undoableService.updateData(true);
  };
}
