import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseLineStringColumnSchema = z.object({
  type: z.literal('LINESTRING'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const LineStringColumnSchema = z.extend(BaseColumnSchema, BaseLineStringColumnSchema.shape);

export const CreateLineStringColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseLineStringColumnSchema.shape,
);

export const UpdateLineStringColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseLineStringColumnSchema.shape,
);
