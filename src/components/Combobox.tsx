import { clsx } from '@/utils/clsx';
import { forwardRef, Ref } from 'react';
import type { GroupBase, Props, SelectInstance } from 'react-select';
import { deferModule } from '@/utils/defer-module';
import type { ComboboxOption } from './select-parts';

export const selectParts = deferModule(() => import('./select-parts'));

// Holds the control's place until react-select arrives, so the form does not shift
export function SelectPlaceholder() {
  return <div aria-hidden className="h-[42px] rounded-md border border-slate-300 shadow-xs" />;
}

type ComboboxProps<
  Option extends ComboboxOption,
  isMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = Props<Option, isMulti, Group> & {
  name: string;
  label: string;
  srOnlyLabel?: boolean;
};

function ComboboxComponent<
  Option extends ComboboxOption,
  isMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  { name, label, srOnlyLabel, id, className, ...props }: ComboboxProps<Option, isMulti, Group>,
  ref: Ref<SelectInstance<Option, isMulti, Group>>,
) {
  const elementId = id || name;
  const parts = selectParts.useModule();

  return (
    <div className={clsx('flex flex-col gap-y-1', className)}>
      <label
        htmlFor={elementId}
        className={clsx('text-sm font-medium text-slate-500', { 'sr-only': srOnlyLabel })}
      >
        {label}
      </label>
      {parts ? (
        <parts.Select
          ref={ref}
          components={{ Control: parts.Control, Option: parts.Option }}
          name={name}
          inputId={elementId}
          menuPortalTarget={document.body}
          className={clsx('react-select-container')}
          classNamePrefix="react-select"
          {...props}
        />
      ) : (
        <SelectPlaceholder />
      )}
    </div>
  );
}

export const Combobox = forwardRef(ComboboxComponent);
