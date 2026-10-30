import { useReactFlow } from 'reactflow';
import { TableNodeType, TableWithOptionalIdType, TableWithoutIdType } from '@/schemas/table';
import { useEditorState } from '@/contexts/EditorStateContext';

export function useCreateTable() {
  const { undoableService } = useEditorState();
  const reactFlowInstance = useReactFlow<TableWithoutIdType>();

  return (
    newTable: TableWithOptionalIdType,
    position: TableNodeType['position'] = { x: 0, y: 0 },
  ) => {
    const { id, ...payload } = newTable;

    reactFlowInstance.addNodes({
      id: id ?? crypto.randomUUID(),
      type: 'table',
      position,
      data: {
        ...payload,
      },
    });

    if (payload.name !== '') {
      undoableService.updateData(true);
    }
  };
}
