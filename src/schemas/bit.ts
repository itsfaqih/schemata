import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseBitColumnSchema = z.object({
  type: z.literal('BIT'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const BitColumnSchema = BaseColumnSchema.extend(BaseBitColumnSchema.shape);

export const CreateBitColumnSchema = BaseCreateColumnSchema.extend(BaseBitColumnSchema.shape);

export const UpdateBitColumnSchema = BaseUpdateColumnSchema.extend(BaseBitColumnSchema.shape);
