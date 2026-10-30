import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BasePolygonColumnSchema = z.object({
  type: z.literal('POLYGON'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const PolygonColumnSchema = z.extend(BaseColumnSchema, BasePolygonColumnSchema.shape);

export const CreatePolygonColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BasePolygonColumnSchema.shape,
);

export const UpdatePolygonColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BasePolygonColumnSchema.shape,
);
