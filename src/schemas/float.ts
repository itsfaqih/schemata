import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseFloatColumnSchema = z.object({
  type: z.literal('FLOAT'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const FloatColumnSchema = BaseColumnSchema.extend(BaseFloatColumnSchema.shape);

export const CreateFloatColumnSchema = BaseCreateColumnSchema.extend(BaseFloatColumnSchema.shape);

export const UpdateFloatColumnSchema = BaseUpdateColumnSchema.extend(BaseFloatColumnSchema.shape);
