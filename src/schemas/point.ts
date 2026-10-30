import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BasePointColumnSchema = z.object({
  type: z.literal('POINT'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const PointColumnSchema = z.extend(BaseColumnSchema, BasePointColumnSchema.shape);

export const CreatePointColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BasePointColumnSchema.shape,
);

export const UpdatePointColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BasePointColumnSchema.shape,
);
