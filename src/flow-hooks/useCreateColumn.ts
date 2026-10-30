import { useEditorActions } from '@/contexts/EditorStateContext';
import { CreateColumnType, CreateColumnSchema } from '@/schemas/create-column';
import { TableNodeType } from '@/schemas/table';
import { useReactFlow } from '@xyflow/react';

export function useCreateColumn() {
  const { updateData } = useEditorActions();
  const reactFlowInstance = useReactFlow<TableNodeType>();

  return (columnPayload: CreateColumnType) => {
    const { tableId, ...newColumn } = CreateColumnSchema.parse(columnPayload);

    reactFlowInstance.setNodes((currentNodes) => {
      return currentNodes.map((node) => {
        if (node.id !== tableId) {
          return node;
        }

        let newColumns = node.data.columns
          .concat({
            id: crypto.randomUUID(),
            ...newColumn,
            index: newColumn.index ?? node.data.columns.length,
          })
          .toSorted((a, b) => a.index - b.index)
          .map((column, index) => ({ ...column, index }));

        return {
          ...node,
          data: {
            ...node.data,
            columns: newColumns,
          },
        };
      });
    });

    if (newColumn.name !== '') {
      updateData(true);
    }
  };
}
