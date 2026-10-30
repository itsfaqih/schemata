import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseDecimalColumnSchema = z.object({
  type: z.literal('DECIMAL'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const DecimalColumnSchema = z.extend(BaseColumnSchema, BaseDecimalColumnSchema.shape);

export const CreateDecimalColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseDecimalColumnSchema.shape,
);

export const UpdateDecimalColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseDecimalColumnSchema.shape,
);
