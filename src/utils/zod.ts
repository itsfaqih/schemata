import { z } from 'zod';

export function uniqueArrayElement<T extends z.ZodType>(schema: z.ZodArray<T>) {
  return schema.transform((elements) => Array.from(new Set(elements)));
}

export function isUuid(data: string) {
  return z.uuid().safeParse(data).success;
}
