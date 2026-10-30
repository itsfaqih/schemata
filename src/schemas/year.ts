import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod/mini';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseYearColumnSchema = z.object({
  type: z.literal('YEAR'),
  attributes: uniqueArrayElement(z.array(BaseColumnAttributeEnum)),
});

export const YearColumnSchema = z.extend(BaseColumnSchema, BaseYearColumnSchema.shape);

export const CreateYearColumnSchema = z.extend(BaseCreateColumnSchema, BaseYearColumnSchema.shape);

export const UpdateYearColumnSchema = z.extend(BaseUpdateColumnSchema, BaseYearColumnSchema.shape);
