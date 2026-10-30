import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseEnumColumnSchema = z.object({
  type: z.literal('ENUM'),
  values: uniqueArrayElement(z.string().array().nonempty()),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const EnumColumnSchema = BaseColumnSchema.extend(BaseEnumColumnSchema.shape);

export const CreateEnumColumnSchema = BaseCreateColumnSchema.extend(BaseEnumColumnSchema.shape);

export const UpdateEnumColumnSchema = BaseUpdateColumnSchema.extend(BaseEnumColumnSchema.shape);
