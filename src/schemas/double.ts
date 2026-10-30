import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseDoubleColumnSchema = z.object({
  type: z.literal('DOUBLE'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const DoubleColumnSchema = BaseColumnSchema.extend(BaseDoubleColumnSchema.shape);

export const CreateDoubleColumnSchema = BaseCreateColumnSchema.extend(BaseDoubleColumnSchema.shape);

export const UpdateDoubleColumnSchema = BaseUpdateColumnSchema.extend(BaseDoubleColumnSchema.shape);
