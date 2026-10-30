import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseJsonColumnSchema = z.object({
  type: z.literal('JSON'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const JsonColumnSchema = BaseColumnSchema.extend(BaseJsonColumnSchema.shape);

export const CreateJsonColumnSchema = BaseCreateColumnSchema.extend(BaseJsonColumnSchema.shape);

export const UpdateJsonColumnSchema = BaseUpdateColumnSchema.extend(BaseJsonColumnSchema.shape);
