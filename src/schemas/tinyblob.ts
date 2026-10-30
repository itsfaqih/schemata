import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseTinyBlobColumnSchema = z.object({
  type: z.enum(['TINYBLOB', 'TINYTEXT']),
  length: z.optional(z.catch(z.number().check(z.int(), z.minimum(1), z.maximum(255)), 255)),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const TinyBlobColumnSchema = z.extend(BaseColumnSchema, BaseTinyBlobColumnSchema.shape);

export const CreateTinyBlobColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseTinyBlobColumnSchema.shape,
);

export const UpdateTinyBlobColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseTinyBlobColumnSchema.shape,
);
