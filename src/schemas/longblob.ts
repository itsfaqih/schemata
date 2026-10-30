import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseLongBlobColumnSchema = z.object({
  type: z.enum(['LONGBLOB', 'LONGTEXT']),
  length: z.number().int().min(1).max(4294967296).catch(4294967296).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const LongBlobColumnSchema = BaseColumnSchema.extend(BaseLongBlobColumnSchema.shape);

export const CreateLongBlobColumnSchema = BaseCreateColumnSchema.extend(
  BaseLongBlobColumnSchema.shape,
);

export const UpdateLongBlobColumnSchema = BaseUpdateColumnSchema.extend(
  BaseLongBlobColumnSchema.shape,
);
