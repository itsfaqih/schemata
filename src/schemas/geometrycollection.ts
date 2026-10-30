import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseGeometryCollectionColumnSchema = z.object({
  type: z.literal('GEOMETRYCOLLECTION'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const GeometryCollectionColumnSchema = BaseColumnSchema.extend(
  BaseGeometryCollectionColumnSchema.shape,
);

export const CreateGeometryCollectionColumnSchema = BaseCreateColumnSchema.extend(
  BaseGeometryCollectionColumnSchema.shape,
);

export const UpdateGeometryCollectionColumnSchema = BaseUpdateColumnSchema.extend(
  BaseGeometryCollectionColumnSchema.shape,
);
