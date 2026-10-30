import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseIntegerColumnSchema = z.object({
  type: z.literal('INTEGER'),
  length: z.optional(z.catch(z.number().check(z.int(), z.minimum(1), z.maximum(11)), 11)),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const IntegerColumnSchema = z.extend(BaseColumnSchema, BaseIntegerColumnSchema.shape);

export const CreateIntegerColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseIntegerColumnSchema.shape,
);

export const UpdateIntegerColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseIntegerColumnSchema.shape,
);
