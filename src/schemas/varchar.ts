import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseVarcharColumnSchema = z.object({
  type: z.literal('VARCHAR'),
  length: z.optional(z.catch(z.number().check(z.int(), z.minimum(1), z.maximum(65535)), 255)),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const VarcharColumnSchema = z.extend(BaseColumnSchema, BaseVarcharColumnSchema.shape);

export type VarcharColumnType = z.infer<typeof VarcharColumnSchema>;

export const CreateVarcharColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseVarcharColumnSchema.shape,
);

export const UpdateVarcharColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseVarcharColumnSchema.shape,
);
