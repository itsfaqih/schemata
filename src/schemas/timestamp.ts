import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseTimestampColumnSchema = z.object({
  type: z.literal('TIMESTAMP'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const TimestampColumnSchema = z.extend(BaseColumnSchema, BaseTimestampColumnSchema.shape);

export const CreateTimestampColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseTimestampColumnSchema.shape,
);

export const UpdateTimestampColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseTimestampColumnSchema.shape,
);
