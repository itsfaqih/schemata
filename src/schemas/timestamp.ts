import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseTimestampColumnSchema = z.object({
  type: z.literal('TIMESTAMP'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const TimestampColumnSchema = BaseColumnSchema.extend(BaseTimestampColumnSchema.shape);

export const CreateTimestampColumnSchema = BaseCreateColumnSchema.extend(
  BaseTimestampColumnSchema.shape,
);

export const UpdateTimestampColumnSchema = BaseUpdateColumnSchema.extend(
  BaseTimestampColumnSchema.shape,
);
