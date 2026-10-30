import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseDateTimeColumnSchema = z.object({
  type: z.literal('DATETIME'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const DateTimeColumnSchema = z.extend(BaseColumnSchema, BaseDateTimeColumnSchema.shape);

export const CreateDateTimeColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseDateTimeColumnSchema.shape,
);

export const UpdateDateTimeColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseDateTimeColumnSchema.shape,
);
