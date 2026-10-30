import { z } from 'zod';

export const PositionSchema = z.object({
  itemId: z.uuid(),
  groupId: z.uuid().optional(),
  x: z.number(),
  y: z.number(),
});

export type PositionType = z.infer<typeof PositionSchema>;
