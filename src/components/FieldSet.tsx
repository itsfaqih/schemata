import { clsx } from '@/utils/clsx';
import { ReactNode } from 'react';

type FieldSetProps = {
  label: ReactNode;
  children: ReactNode;
  className?: string;
};

export function FieldSet({ label, children, className }: FieldSetProps) {
  return (
    <fieldset className={clsx('rounded-sm border border-gray-200 px-4 pt-2 pb-4', className)}>
      <legend className="text-sm font-medium tracking-wider text-slate-400 uppercase">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}
