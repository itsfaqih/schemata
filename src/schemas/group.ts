import { z } from 'zod/mini';

export const GroupSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  width: z.number().check(z.int()),
  height: z.number().check(z.int()),
  color: z.object({
    background: z.string(),
    border: z.string(),
  }),
});
