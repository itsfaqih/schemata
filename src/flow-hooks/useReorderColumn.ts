import { useEditorActions } from '@/contexts/EditorStateContext';
import { useReactFlow } from '@xyflow/react';
import { arrayMove } from '@dnd-kit/sortable';
import { ColumnType } from '@/schemas/column';
import { TableType, TableNodeType } from '@/schemas/table';

type ReorderColumnType = {
  movedColumnId: ColumnType['id'];
  hoveredColumnId: ColumnType['id'];
  tableId: TableType['id'];
};

export function useReorderColumn() {
  const { updateData } = useEditorActions();
  const reactFlowInstance = useReactFlow<TableNodeType>();

  return (reorderPayload: ReorderColumnType) => {
    const { movedColumnId, hoveredColumnId, tableId } = reorderPayload;

    reactFlowInstance.setNodes((currentNodes) => {
      return currentNodes.map((node) => {
        if (node.id !== tableId) {
          return node;
        }

        const movedColumnIndex = node.data.columns.findIndex(
          (column) => column.id === movedColumnId,
        );

        const hoveredColumnIndex = node.data.columns.findIndex(
          (column) => column.id === hoveredColumnId,
        );

        const finalColumns = arrayMove(node.data.columns, movedColumnIndex, hoveredColumnIndex);

        return {
          ...node,
          data: {
            ...node.data,
            columns: finalColumns.map((column, index) => ({ ...column, index })),
          },
        };
      });
    });

    updateData(true);
  };
}
