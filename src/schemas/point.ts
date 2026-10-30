import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BasePointColumnSchema = z.object({
  type: z.literal('POINT'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const PointColumnSchema = BaseColumnSchema.extend(BasePointColumnSchema.shape);

export const CreatePointColumnSchema = BaseCreateColumnSchema.extend(BasePointColumnSchema.shape);

export const UpdatePointColumnSchema = BaseUpdateColumnSchema.extend(BasePointColumnSchema.shape);
