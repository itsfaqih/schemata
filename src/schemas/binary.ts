import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseBinaryColumnSchema = z.object({
  type: z.enum(['BINARY', 'VARBINARY']),
  length: z.optional(z.catch(z.number().check(z.int(), z.minimum(1), z.maximum(255)), 255)),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const BinaryColumnSchema = z.extend(BaseColumnSchema, BaseBinaryColumnSchema.shape);

export const CreateBinaryColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseBinaryColumnSchema.shape,
);

export const UpdateBinaryColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseBinaryColumnSchema.shape,
);
