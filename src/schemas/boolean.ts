import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseBooleanColumnSchema = z.object({
  type: z.literal('BOOLEAN'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const BooleanColumnSchema = z.extend(BaseColumnSchema, BaseBooleanColumnSchema.shape);

export const CreateBooleanColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseBooleanColumnSchema.shape,
);

export const UpdateBooleanColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseBooleanColumnSchema.shape,
);
