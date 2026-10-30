import { z } from 'zod';

export const GroupSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  color: z.object({
    background: z.string(),
    border: z.string(),
  }),
});
