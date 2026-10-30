import { en } from 'zod/locales';
import { z } from 'zod/mini';

// zod/mini ships no locale, so issues would read "Invalid input"; keep the messages classic zod gave
z.config(en());

export function uniqueArrayElement<T extends z.core.SomeType>(schema: z.ZodMiniArray<T>) {
  return z.pipe(
    schema,
    z.transform((elements: z.output<T>[]) => Array.from(new Set(elements))),
  );
}

export function isUuid(data: string) {
  return z.uuid().safeParse(data).success;
}
