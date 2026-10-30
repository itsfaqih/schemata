import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseFloatColumnSchema = z.object({
  type: z.literal('FLOAT'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const FloatColumnSchema = z.extend(BaseColumnSchema, BaseFloatColumnSchema.shape);

export const CreateFloatColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseFloatColumnSchema.shape,
);

export const UpdateFloatColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseFloatColumnSchema.shape,
);
