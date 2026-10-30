import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseEnumColumnSchema = z.object({
  type: z.literal('ENUM'),
  values: uniqueArrayElement(z.array(z.string()).check(z.minLength(1))),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const EnumColumnSchema = z.extend(BaseColumnSchema, BaseEnumColumnSchema.shape);

export const CreateEnumColumnSchema = z.extend(BaseCreateColumnSchema, BaseEnumColumnSchema.shape);

export const UpdateEnumColumnSchema = z.extend(BaseUpdateColumnSchema, BaseEnumColumnSchema.shape);
