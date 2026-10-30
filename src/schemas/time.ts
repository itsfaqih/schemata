import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseTimeColumnSchema = z.object({
  type: z.literal('TIME'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const TimeColumnSchema = BaseColumnSchema.extend(BaseTimeColumnSchema.shape);

export const CreateTimeColumnSchema = BaseCreateColumnSchema.extend(BaseTimeColumnSchema.shape);

export const UpdateTimeColumnSchema = BaseUpdateColumnSchema.extend(BaseTimeColumnSchema.shape);
