import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseJsonColumnSchema = z.object({
  type: z.literal('JSON'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const JsonColumnSchema = z.extend(BaseColumnSchema, BaseJsonColumnSchema.shape);

export const CreateJsonColumnSchema = z.extend(BaseCreateColumnSchema, BaseJsonColumnSchema.shape);

export const UpdateJsonColumnSchema = z.extend(BaseUpdateColumnSchema, BaseJsonColumnSchema.shape);
