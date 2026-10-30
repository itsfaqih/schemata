import { useEditorActions } from '@/contexts/EditorStateContext';
import { TableType, TableNodeType } from '@/schemas/table';
import { useReactFlow } from '@xyflow/react';

export function useUpdateTable() {
  const { updateData } = useEditorActions();
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

    updateData(true);
  };
}
