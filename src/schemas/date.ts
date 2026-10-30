import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseDateColumnSchema = z.object({
  type: z.literal('DATE'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const DateColumnSchema = z.extend(BaseColumnSchema, BaseDateColumnSchema.shape);

export const CreateDateColumnSchema = z.extend(BaseCreateColumnSchema, BaseDateColumnSchema.shape);

export const UpdateDateColumnSchema = z.extend(BaseUpdateColumnSchema, BaseDateColumnSchema.shape);
