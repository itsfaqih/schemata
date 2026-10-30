import { z } from 'zod/mini';

export const PositionSchema = z.object({
  itemId: z.uuid(),
  groupId: z.optional(z.uuid()),
  x: z.number(),
  y: z.number(),
});

export type PositionType = z.infer<typeof PositionSchema>;
