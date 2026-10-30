import { useEditorState } from '@/contexts/EditorStateContext';
import { TableType, TableNodeType } from '@/schemas/table';
import { useReactFlow } from '@xyflow/react';

export function useDeleteTable() {
  const { undoableService } = useEditorState();
  const reactFlowInstance = useReactFlow<TableNodeType>();

  return (tableId: TableType['id']) => {
    void reactFlowInstance
      .deleteElements({ nodes: [{ id: tableId }] })
      .then(() => undoableService.updateData());
  };
}
