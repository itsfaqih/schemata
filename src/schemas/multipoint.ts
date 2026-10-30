import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseMultiPointColumnSchema = z.object({
  type: z.literal('MULTIPOINT'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const MultiPointColumnSchema = BaseColumnSchema.extend(BaseMultiPointColumnSchema.shape);

export const CreateMultiPointColumnSchema = BaseCreateColumnSchema.extend(
  BaseMultiPointColumnSchema.shape,
);

export const UpdateMultiPointColumnSchema = BaseUpdateColumnSchema.extend(
  BaseMultiPointColumnSchema.shape,
);
