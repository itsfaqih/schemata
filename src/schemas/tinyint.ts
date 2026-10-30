import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseTinyIntColumnSchema = z.object({
  type: z.literal('TINYINT'),
  length: z.optional(z.catch(z.number().check(z.int(), z.minimum(1), z.maximum(4)), 4)),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const TinyIntColumnSchema = z.extend(BaseColumnSchema, BaseTinyIntColumnSchema.shape);

export const CreateTinyIntColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseTinyIntColumnSchema.shape,
);

export const UpdateTinyIntColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseTinyIntColumnSchema.shape,
);
