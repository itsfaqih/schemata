import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseGeometryCollectionColumnSchema = z.object({
  type: z.literal('GEOMETRYCOLLECTION'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const GeometryCollectionColumnSchema = z.extend(
  BaseColumnSchema,
  BaseGeometryCollectionColumnSchema.shape,
);

export const CreateGeometryCollectionColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseGeometryCollectionColumnSchema.shape,
);

export const UpdateGeometryCollectionColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseGeometryCollectionColumnSchema.shape,
);
