import { Node } from '@xyflow/react';
import { z } from 'zod/mini';
import { IndexSchema } from './base';
import { ColumnSchema } from './column';

export const TableSchema = z.object({
  id: z.uuid(),
  name: z.string().check(z.trim(), z.maxLength(64)),
  columns: z.array(ColumnSchema),
  indexes: z.array(IndexSchema),
});

export type TableType = z.infer<typeof TableSchema>;

export const TableWithoutIdSchema = z.omit(TableSchema, { id: true });

export type TableWithoutIdType = z.infer<typeof TableWithoutIdSchema>;

export const TableWithOptionalIdSchema = z.extend(TableSchema, { id: z.optional(z.uuid()) });

export type TableWithOptionalIdType = z.infer<typeof TableWithOptionalIdSchema>;

export type TableNodeType = Node<TableWithoutIdType>;
