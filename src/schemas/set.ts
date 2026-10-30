import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseSetColumnSchema = z.object({
  type: z.literal('SET'),
  values: uniqueArrayElement(z.string().array().nonempty()),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const SetColumnSchema = BaseColumnSchema.extend(BaseSetColumnSchema.shape);

export const CreateSetColumnSchema = BaseCreateColumnSchema.extend(BaseSetColumnSchema.shape);

export const UpdateSetColumnSchema = BaseUpdateColumnSchema.extend(BaseSetColumnSchema.shape);
