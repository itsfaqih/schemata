import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseYearColumnSchema = z.object({
  type: z.literal('YEAR'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const YearColumnSchema = BaseColumnSchema.extend(BaseYearColumnSchema.shape);

export const CreateYearColumnSchema = BaseCreateColumnSchema.extend(BaseYearColumnSchema.shape);

export const UpdateYearColumnSchema = BaseUpdateColumnSchema.extend(BaseYearColumnSchema.shape);
