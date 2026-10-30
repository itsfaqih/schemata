import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseGeometryColumnSchema = z.object({
  type: z.literal('GEOMETRY'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const GeometryColumnSchema = z.extend(BaseColumnSchema, BaseGeometryColumnSchema.shape);

export const CreateGeometryColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseGeometryColumnSchema.shape,
);

export const UpdateGeometryColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseGeometryColumnSchema.shape,
);
