import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseDecimalColumnSchema = z.object({
  type: z.literal('DECIMAL'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const DecimalColumnSchema = BaseColumnSchema.extend(BaseDecimalColumnSchema.shape);

export const CreateDecimalColumnSchema = BaseCreateColumnSchema.extend(
  BaseDecimalColumnSchema.shape,
);

export const UpdateDecimalColumnSchema = BaseUpdateColumnSchema.extend(
  BaseDecimalColumnSchema.shape,
);
