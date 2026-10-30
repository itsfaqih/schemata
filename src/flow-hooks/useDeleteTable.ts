import { useEditorState } from '@/contexts/EditorStateContext';
import { TableType, TableWithoutIdType } from '@/schemas/table';
import { useReactFlow } from 'reactflow';

export function useDeleteTable() {
  const { undoableService } = useEditorState();
  const reactFlowInstance = useReactFlow<TableWithoutIdType>();

  return (tableId: TableType['id']) => {
    reactFlowInstance.deleteElements({ nodes: [{ id: tableId }] });
    undoableService.updateData();
  };
}
