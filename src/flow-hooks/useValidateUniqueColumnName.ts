import { BaseColumnSchema } from '@/schemas/base';
import { TableNodeType } from '@/schemas/table';
import { useReactFlow } from '@xyflow/react';
import { z } from 'zod/mini';

export const ValidateUniqueColumnNameSchema = z.extend(
  z.pick(BaseColumnSchema, { id: true, name: true }),
  {
    tableId: z.uuid(),
  },
);

export type ValidateUniqueColumnNameType = z.infer<typeof ValidateUniqueColumnNameSchema>;

export function useValidateUniqueColumnName() {
  const reactFlowInstance = useReactFlow<TableNodeType>();

  return (columnPayload: ValidateUniqueColumnNameType) => {
    const { id, name, tableId } = columnPayload;

    const node = reactFlowInstance.getNode(tableId);

    if (!node) {
      throw Error(`Table with id ${tableId} not found`);
    }

    const duplicate = node.data.columns.find(
      (column) => column.id !== id && column.name.toLowerCase() === name.toLowerCase(),
    );

    return !duplicate;
  };
}
