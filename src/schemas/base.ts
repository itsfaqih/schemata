import { z } from 'zod/mini';

export const IndexSchema = z.object({
  id: z.uuid(),
  type: z.enum(['INDEX', 'PRIMARY_KEY', 'UNIQUE_INDEX']),
  columns: z.array(z.uuid()),
});

export type IndexType = z.infer<typeof IndexSchema>;

export const VisibilityAttribute = z.union([z.literal('INVISIBLE'), z.literal('VISIBLE')]);

export const NullabilityAttribute = z.union([z.literal('NULLABLE'), z.literal('NOT_NULL')]);

export const SignabilityAttribute = z.union([z.literal('UNSIGNED'), z.literal('SIGNED')]);

export const BaseColumnAttributeEnum = z.union([VisibilityAttribute, NullabilityAttribute]);

export const BaseColumnSchema = z.object({
  id: z.uuid(),
  name: z
    .string()
    .check(z.trim(), z.maxLength(64, { error: 'String must contain at most 64 character(s)' })),
  default: z.optional(z.string()),
  index: z.number().check(z.int()),
});

export const BaseCreateColumnSchema = z.extend(
  z.omit(BaseColumnSchema, { id: true, index: true }),
  {
    index: z.optional(z.number().check(z.int())),
    tableId: z.uuid(),
  },
);

export const BaseUpdateColumnSchema = z.extend(BaseColumnSchema, {
  isPrimaryKey: z.boolean(),
  isUniqueIndex: z.boolean(),
  tableId: z.uuid(),
});
