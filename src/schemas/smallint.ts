import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  SignabilityAttribute,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseSmallIntColumnSchema = z.object({
  type: z.literal('SMALLINT'),
  length: z.number().int().min(1).max(5).catch(5).optional(),
  attributes: uniqueArrayElement(z.union([BaseColumnAttributeEnum, SignabilityAttribute]).array()),
});

export const SmallIntColumnSchema = BaseColumnSchema.extend(BaseSmallIntColumnSchema.shape);

export const CreateSmallIntColumnSchema = BaseCreateColumnSchema.extend(
  BaseSmallIntColumnSchema.shape,
);

export const UpdateSmallIntColumnSchema = BaseUpdateColumnSchema.extend(
  BaseSmallIntColumnSchema.shape,
);
