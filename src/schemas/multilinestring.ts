import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseMultiLineStringColumnSchema = z.object({
  type: z.literal('MULTILINESTRING'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const MultiLineStringColumnSchema = z.extend(
  BaseColumnSchema,
  BaseMultiLineStringColumnSchema.shape,
);

export const CreateMultiLineStringColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseMultiLineStringColumnSchema.shape,
);

export const UpdateMultiLineStringColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseMultiLineStringColumnSchema.shape,
);
