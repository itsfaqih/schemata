import { Edge } from '@xyflow/react';
import { z } from 'zod/mini';
import { ColumnType } from './column';

export const RelationActionEnum = z.enum(['CASCADE', 'RESTRICT', 'SET_NULL', 'NO_ACTION']);

export const RelationSchema = z.object({
  id: z.uuid(),
  // catch for backward compat
  name: z.catch(z.string(), 'fk'),
  source: z.object({
    columnId: z.uuid(),
    tableId: z.uuid(),
  }),
  target: z.object({
    columnId: z.uuid(),
    tableId: z.uuid(),
  }),
  // catch for backward compat
  actions: z.catch(
    z.object({
      onDelete: RelationActionEnum,
      onUpdate: RelationActionEnum,
    }),
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  ),
});

export type RelationType = z.infer<typeof RelationSchema>;

export const CreateRelationSchema = z.omit(RelationSchema, {
  id: true,
});

export type CreateRelationType = z.infer<typeof CreateRelationSchema>;

export type EdgeType = {
  name: RelationType['name'];
  sourceColumnId: ColumnType['id'];
  targetColumnId: ColumnType['id'];
  actions: RelationType['actions'];
};

export type RelationEdgeType = Edge<EdgeType>;
