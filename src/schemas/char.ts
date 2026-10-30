import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseCharColumnSchema = z.object({
  type: z.literal('CHAR'),
  length: z.optional(z.catch(z.number().check(z.int(), z.minimum(1), z.maximum(255)), 255)),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const CharColumnSchema = z.extend(BaseColumnSchema, BaseCharColumnSchema.shape);

export const CreateCharColumnSchema = z.extend(BaseCreateColumnSchema, BaseCharColumnSchema.shape);

export const UpdateCharColumnSchema = z.extend(BaseUpdateColumnSchema, BaseCharColumnSchema.shape);
