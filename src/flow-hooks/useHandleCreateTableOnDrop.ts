import { emptyTableWithoutId } from '@/utils/reactflow';
import { DragEvent } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useCreateTable } from './useCreateTable';

export function useHandleCreateTableOnDrop() {
  const reactFlowInstance = useReactFlow();
  const createTable = useCreateTable();

  return (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');

    if (!type) {
      return;
    }

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    createTable(emptyTableWithoutId(), position);
  };
}
