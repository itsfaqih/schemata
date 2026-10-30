import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseTinyBlobColumnSchema = z.object({
  type: z.enum(['TINYBLOB', 'TINYTEXT']),
  length: z.number().int().min(1).max(255).catch(255).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const TinyBlobColumnSchema = BaseColumnSchema.extend(BaseTinyBlobColumnSchema.shape);

export const CreateTinyBlobColumnSchema = BaseCreateColumnSchema.extend(
  BaseTinyBlobColumnSchema.shape,
);

export const UpdateTinyBlobColumnSchema = BaseUpdateColumnSchema.extend(
  BaseTinyBlobColumnSchema.shape,
);
