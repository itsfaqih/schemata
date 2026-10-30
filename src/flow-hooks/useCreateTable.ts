import { useReactFlow } from '@xyflow/react';
import { TableNodeType, TableWithOptionalIdType } from '@/schemas/table';
import { useEditorActions } from '@/contexts/EditorStateContext';

export function useCreateTable() {
  const { updateData } = useEditorActions();
  const reactFlowInstance = useReactFlow<TableNodeType>();

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
      updateData(true);
    }
  };
}
