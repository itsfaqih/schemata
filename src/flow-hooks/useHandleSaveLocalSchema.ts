import { useSaveLocalSchema } from '@/mutations/useSaveLocalSchema';
import { PositionType } from '@/schemas/position';
import { RelationEdgeType, RelationType } from '@/schemas/relation';
import { SchemaType } from '@/schemas/schema';
import { TableNodeType, TableType } from '@/schemas/table';
import { nodeToTable, nodeToPosition, edgeToRelation } from '@/utils/reactflow';
import { useReactFlow } from '@xyflow/react';

export function useHandleSaveLocalSchema(id: SchemaType['id']) {
  const reactFlowInstance = useReactFlow<TableNodeType, RelationEdgeType>();
  const { mutate: saveLocalSchema } = useSaveLocalSchema(id);

  return () => {
    const tables: TableType[] = reactFlowInstance.getNodes().map((node) => nodeToTable(node)) ?? [];

    const positions: PositionType[] =
      reactFlowInstance.getNodes().map((node) => nodeToPosition(node)) ?? [];

    const relations: RelationType[] =
      reactFlowInstance.getEdges().map((edge) => edgeToRelation(edge)) ?? [];

    saveLocalSchema((currentDatabase) => ({
      ...currentDatabase,
      tables,
      positions,
      relations,
    }));
  };
}
