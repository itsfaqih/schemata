import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BasePolygonColumnSchema = z.object({
  type: z.literal('POLYGON'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const PolygonColumnSchema = BaseColumnSchema.extend(BasePolygonColumnSchema.shape);

export const CreatePolygonColumnSchema = BaseCreateColumnSchema.extend(
  BasePolygonColumnSchema.shape,
);

export const UpdatePolygonColumnSchema = BaseUpdateColumnSchema.extend(
  BasePolygonColumnSchema.shape,
);
