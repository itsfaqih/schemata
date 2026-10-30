import { z } from 'zod/mini';
import { BaseColumnSchema } from './base';

export const DeleteColumnSchema = z.extend(z.pick(BaseColumnSchema, { id: true }), {
  tableId: z.uuid(),
});

export type DeleteColumnType = z.infer<typeof DeleteColumnSchema>;
