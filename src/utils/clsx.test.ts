import { expect, it } from 'vitest';
import { clsx } from './clsx';

it.each([
  ['h-5 w-5', 'h-4 w-4', 'h-4 w-4'],
  ['rounded-lg px-3 shadow-xs', 'px-0 shadow-none', 'rounded-lg px-0 shadow-none'],
  [
    'text-slate-600 outline-sky-500',
    'text-white/50 outline-red-400',
    'text-white/50 outline-red-400',
  ],
])('lets the classes %s give way to %s passed after them', (defaults, override, merged) => {
  expect(clsx(defaults, override)).toBe(merged);
});

it('keeps classes that do not conflict and drops falsy ones', () => {
  expect(clsx('rounded-lg border px-3', { 'sr-only': false }, 'flex items-center')).toBe(
    'rounded-lg border px-3 flex items-center',
  );
});
