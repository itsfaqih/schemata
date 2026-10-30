import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseLineStringColumnSchema = z.object({
  type: z.literal('LINESTRING'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const LineStringColumnSchema = BaseColumnSchema.extend(BaseLineStringColumnSchema.shape);

export const CreateLineStringColumnSchema = BaseCreateColumnSchema.extend(
  BaseLineStringColumnSchema.shape,
);

export const UpdateLineStringColumnSchema = BaseUpdateColumnSchema.extend(
  BaseLineStringColumnSchema.shape,
);
