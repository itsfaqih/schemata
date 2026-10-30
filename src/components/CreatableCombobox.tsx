import { clsx } from '@/utils/clsx';
import { forwardRef, Ref } from 'react';
import type { GroupBase, MultiValue, Props, SelectInstance, SingleValue } from 'react-select';
import { SelectPlaceholder, selectParts } from './Combobox';
import type { ComboboxOption } from './select-parts';

export function isMultiValue<Option>(
  value: MultiValue<Option> | SingleValue<Option>,
): value is MultiValue<Option> {
  return Array.isArray(value);
}

type CreatableComboboxProps<
  Option extends ComboboxOption,
  isMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = Props<Option, isMulti, Group> & {
  name: string;
  label: string;
  srOnlyLabel?: boolean;
};

function CreatableComboboxComponent<
  Option extends ComboboxOption,
  isMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  {
    name,
    label,
    srOnlyLabel,
    id,
    className,
    ...props
  }: CreatableComboboxProps<Option, isMulti, Group>,
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
        <parts.CreatableSelect
          ref={ref}
          components={{ Control: parts.Control, Option: parts.Option, Input: parts.Input }}
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

export const CreatableCombobox = forwardRef(CreatableComboboxComponent);
