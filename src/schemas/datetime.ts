import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseDateTimeColumnSchema = z.object({
  type: z.literal('DATETIME'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const DateTimeColumnSchema = BaseColumnSchema.extend(BaseDateTimeColumnSchema.shape);

export const CreateDateTimeColumnSchema = BaseCreateColumnSchema.extend(
  BaseDateTimeColumnSchema.shape,
);

export const UpdateDateTimeColumnSchema = BaseUpdateColumnSchema.extend(
  BaseDateTimeColumnSchema.shape,
);
