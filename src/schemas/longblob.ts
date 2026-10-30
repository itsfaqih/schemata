import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseLongBlobColumnSchema = z.object({
  type: z.enum(['LONGBLOB', 'LONGTEXT']),
  length: z.optional(
    z.catch(z.number().check(z.int(), z.minimum(1), z.maximum(4294967296)), 4294967296),
  ),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const LongBlobColumnSchema = z.extend(BaseColumnSchema, BaseLongBlobColumnSchema.shape);

export const CreateLongBlobColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseLongBlobColumnSchema.shape,
);

export const UpdateLongBlobColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseLongBlobColumnSchema.shape,
);
