import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  SignabilityAttribute,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseSmallIntColumnSchema = z.object({
  type: z.literal('SMALLINT'),
  length: z.optional(z.catch(z.number().check(z.int(), z.minimum(1), z.maximum(5)), 5)),
  attributes: uniqueArrayElement(z.array(z.union([BaseColumnAttributeEnum, SignabilityAttribute]))),
});

export const SmallIntColumnSchema = z.extend(BaseColumnSchema, BaseSmallIntColumnSchema.shape);

export const CreateSmallIntColumnSchema = z.extend(
  BaseCreateColumnSchema,
  BaseSmallIntColumnSchema.shape,
);

export const UpdateSmallIntColumnSchema = z.extend(
  BaseUpdateColumnSchema,
  BaseSmallIntColumnSchema.shape,
);
