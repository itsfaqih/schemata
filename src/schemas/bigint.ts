import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseBigIntColumnSchema = z.object({
  type: z.literal('BIGINT'),
  length: z.number().int().min(1).max(20).catch(20).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const BigIntColumnSchema = BaseColumnSchema.extend(BaseBigIntColumnSchema.shape);

export const CreateBigIntColumnSchema = BaseCreateColumnSchema.extend(BaseBigIntColumnSchema.shape);

export const UpdateBigIntColumnSchema = BaseUpdateColumnSchema.extend(BaseBigIntColumnSchema.shape);
