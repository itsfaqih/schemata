import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseDoubleColumnSchema = z.object({
  type: z.literal('DOUBLE'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const DoubleColumnSchema = z.extend(BaseColumnSchema, BaseDoubleColumnSchema.shape);

export const CreateDoubleColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseDoubleColumnSchema.shape,
);

export const UpdateDoubleColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseDoubleColumnSchema.shape,
);
