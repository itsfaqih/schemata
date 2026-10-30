import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseMultiPolygonColumnSchema = z.object({
  type: z.literal('MULTIPOLYGON'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const MultiPolygonColumnSchema = BaseColumnSchema.extend(BaseMultiPolygonColumnSchema.shape);

export const CreateMultiPolygonColumnSchema = BaseCreateColumnSchema.extend(
  BaseMultiPolygonColumnSchema.shape,
);

export const UpdateMultiPolygonColumnSchema = BaseUpdateColumnSchema.extend(
  BaseMultiPolygonColumnSchema.shape,
);
