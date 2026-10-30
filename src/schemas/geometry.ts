import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseGeometryColumnSchema = z.object({
  type: z.literal('GEOMETRY'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const GeometryColumnSchema = BaseColumnSchema.extend(BaseGeometryColumnSchema.shape);

export const CreateGeometryColumnSchema = BaseCreateColumnSchema.extend(
  BaseGeometryColumnSchema.shape,
);

export const UpdateGeometryColumnSchema = BaseUpdateColumnSchema.extend(
  BaseGeometryColumnSchema.shape,
);
