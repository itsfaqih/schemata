import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseBlobColumnSchema = z.object({
  type: z.enum(['BLOB', 'TEXT']),
  length: z.optional(z.catch(z.number().check(z.int(), z.minimum(1), z.maximum(65536)), 65536)),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const BlobColumnSchema = z.extend(BaseColumnSchema, BaseBlobColumnSchema.shape);

export const CreateBlobColumnSchema = z.extend(BaseCreateColumnSchema, BaseBlobColumnSchema.shape);

export const UpdateBlobColumnSchema = z.extend(BaseUpdateColumnSchema, BaseBlobColumnSchema.shape);
