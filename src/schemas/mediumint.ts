import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseMediumIntColumnSchema = z.object({
  type: z.literal('MEDIUMINT'),
  length: z.number().int().min(1).max(9).catch(9).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const MediumIntColumnSchema = BaseColumnSchema.extend(BaseMediumIntColumnSchema.shape);

export const CreateMediumIntColumnSchema = BaseCreateColumnSchema.extend(
  BaseMediumIntColumnSchema.shape,
);

export const UpdateMediumIntColumnSchema = BaseUpdateColumnSchema.extend(
  BaseMediumIntColumnSchema.shape,
);
