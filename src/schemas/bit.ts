import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseBitColumnSchema = z.object({
  type: z.literal('BIT'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const BitColumnSchema = z.extend(BaseColumnSchema, BaseBitColumnSchema.shape);

export const CreateBitColumnSchema = z.extend(BaseCreateColumnSchema, BaseBitColumnSchema.shape);

export const UpdateBitColumnSchema = z.extend(BaseUpdateColumnSchema, BaseBitColumnSchema.shape);
