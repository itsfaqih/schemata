import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseBigIntColumnSchema = z.object({
  type: z.literal('BIGINT'),
  length: z.optional(z.catch(z.number().check(z.int(), z.minimum(1), z.maximum(20)), 20)),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const BigIntColumnSchema = z.extend(BaseColumnSchema, BaseBigIntColumnSchema.shape);

export const CreateBigIntColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseBigIntColumnSchema.shape,
);

export const UpdateBigIntColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseBigIntColumnSchema.shape,
);
