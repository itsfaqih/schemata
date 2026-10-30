import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseTimeColumnSchema = z.object({
  type: z.literal('TIME'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const TimeColumnSchema = z.extend(BaseColumnSchema, BaseTimeColumnSchema.shape);

export const CreateTimeColumnSchema = z.extend(BaseCreateColumnSchema, BaseTimeColumnSchema.shape);

export const UpdateTimeColumnSchema = z.extend(BaseUpdateColumnSchema, BaseTimeColumnSchema.shape);
