import { z } from 'zod/mini';
import { GroupSchema } from './group';
import { PositionSchema } from './position';
import { RelationSchema } from './relation';
import { TableSchema } from './table';

export const SchemaSchema = z.object({
  id: z.uuid(),
  name: z.string().check(z.trim(), z.maxLength(64)),
  vendor: z.enum(['MYSQL:8.0']),
  tables: z.array(TableSchema),
  groups: z.array(GroupSchema),
  positions: z.array(PositionSchema),
  relations: z.array(RelationSchema),
});

export type SchemaType = z.infer<typeof SchemaSchema>;
