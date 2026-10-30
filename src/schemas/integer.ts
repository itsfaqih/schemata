import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseIntegerColumnSchema = z.object({
  type: z.literal('INTEGER'),
  length: z.number().int().min(1).max(11).catch(11).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const IntegerColumnSchema = BaseColumnSchema.extend(BaseIntegerColumnSchema.shape);

export const CreateIntegerColumnSchema = BaseCreateColumnSchema.extend(
  BaseIntegerColumnSchema.shape,
);

export const UpdateIntegerColumnSchema = BaseUpdateColumnSchema.extend(
  BaseIntegerColumnSchema.shape,
);
