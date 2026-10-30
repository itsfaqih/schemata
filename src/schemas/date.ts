import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseDateColumnSchema = z.object({
  type: z.literal('DATE'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const DateColumnSchema = BaseColumnSchema.extend(BaseDateColumnSchema.shape);

export const CreateDateColumnSchema = BaseCreateColumnSchema.extend(BaseDateColumnSchema.shape);

export const UpdateDateColumnSchema = BaseUpdateColumnSchema.extend(BaseDateColumnSchema.shape);
