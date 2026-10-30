import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseMultiPolygonColumnSchema = z.object({
  type: z.literal('MULTIPOLYGON'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const MultiPolygonColumnSchema = z.extend(
  BaseColumnSchema,
  BaseMultiPolygonColumnSchema.shape,
);

export const CreateMultiPolygonColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseMultiPolygonColumnSchema.shape,
);

export const UpdateMultiPolygonColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseMultiPolygonColumnSchema.shape,
);
