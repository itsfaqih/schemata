import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseMultiLineStringColumnSchema = z.object({
  type: z.literal('MULTILINESTRING'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const MultiLineStringColumnSchema = BaseColumnSchema.extend(
  BaseMultiLineStringColumnSchema.shape,
);

export const CreateMultiLineStringColumnSchema = BaseCreateColumnSchema.extend(
  BaseMultiLineStringColumnSchema.shape,
);

export const UpdateMultiLineStringColumnSchema = BaseUpdateColumnSchema.extend(
  BaseMultiLineStringColumnSchema.shape,
);
