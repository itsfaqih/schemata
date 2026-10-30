import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseMediumBlobColumnSchema = z.object({
  type: z.enum(['MEDIUMBLOB', 'MEDIUMTEXT']),
  length: z.optional(
    z.catch(z.number().check(z.int(), z.minimum(1), z.maximum(16777216)), 16777216),
  ),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const MediumBlobColumnSchema = z.extend(BaseColumnSchema, BaseMediumBlobColumnSchema.shape);

export const CreateMediumBlobColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseMediumBlobColumnSchema.shape,
);

export const UpdateMediumBlobColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseMediumBlobColumnSchema.shape,
);
