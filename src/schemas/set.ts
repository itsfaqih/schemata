import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseSetColumnSchema = z.object({
  type: z.literal('SET'),
  values: uniqueArrayElement(z.array(z.string()).check(z.minLength(1))),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const SetColumnSchema = z.extend(BaseColumnSchema, BaseSetColumnSchema.shape);

export const CreateSetColumnSchema = z.extend(BaseCreateColumnSchema, BaseSetColumnSchema.shape);

export const UpdateSetColumnSchema = z.extend(BaseUpdateColumnSchema, BaseSetColumnSchema.shape);
