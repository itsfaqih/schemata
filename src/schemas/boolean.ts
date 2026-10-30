import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseBooleanColumnSchema = z.object({
  type: z.literal('BOOLEAN'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const BooleanColumnSchema = BaseColumnSchema.extend(BaseBooleanColumnSchema.shape);

export const CreateBooleanColumnSchema = BaseCreateColumnSchema.extend(
  BaseBooleanColumnSchema.shape,
);

export const UpdateBooleanColumnSchema = BaseUpdateColumnSchema.extend(
  BaseBooleanColumnSchema.shape,
);
