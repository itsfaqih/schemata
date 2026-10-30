import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseMultiPointColumnSchema = z.object({
  type: z.literal('MULTIPOINT'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const MultiPointColumnSchema = z.extend(BaseColumnSchema, BaseMultiPointColumnSchema.shape);

export const CreateMultiPointColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseMultiPointColumnSchema.shape,
);

export const UpdateMultiPointColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseMultiPointColumnSchema.shape,
);
