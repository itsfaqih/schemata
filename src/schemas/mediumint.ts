import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseMediumIntColumnSchema = z.object({
  type: z.literal('MEDIUMINT'),
  length: z.optional(z.catch(z.number().check(z.int(), z.minimum(1), z.maximum(9)), 9)),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const MediumIntColumnSchema = z.extend(BaseColumnSchema, BaseMediumIntColumnSchema.shape);

export const CreateMediumIntColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseMediumIntColumnSchema.shape,
);

export const UpdateMediumIntColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseMediumIntColumnSchema.shape,
);
