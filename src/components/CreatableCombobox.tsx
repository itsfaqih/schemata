import { clsx } from '@/utils/clsx';
import { forwardRef, Ref } from 'react';
import CreatableSelect from 'react-select/creatable';
import {
  components,
  ControlProps,
  GroupBase,
  InputProps,
  MultiValue,
  OptionProps,
  Props,
  SelectInstance,
  SingleValue,
} from 'react-select';

type ComboboxOption = {
  label: string;
  value: string;
};

function Option<
  Option extends ComboboxOption,
  isMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: OptionProps<Option, isMulti, Group> & { 'data-test'?: string }) {
  const innerProps: OptionProps<Option, isMulti, Group>['innerProps'] & { 'data-test': string } = {
    ...props.innerProps,
    'data-test': `${props.selectProps['data-test']}-${props.data.value}`,
  };

  return <components.Option {...props} innerProps={innerProps} />;
}

function Control<
  Option extends ComboboxOption,
  isMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: ControlProps<Option, isMulti, Group> & { 'data-test'?: string }) {
  const innerProps: ControlProps<Option, isMulti, Group>['innerProps'] & {
    'data-test': string | undefined;
  } = { ...props.innerProps, 'data-test': props.selectProps['data-test'] };

  return <components.Control {...props} innerProps={innerProps} />;
}

function Input<
  Option extends ComboboxOption,
  isMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: InputProps<Option, isMulti, Group> & { 'data-test'?: string }) {
  return <components.Input {...props} data-test={`${props.selectProps['data-test']}-input`} />;
}

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

  return (
    <div className={clsx('flex flex-col gap-y-1', className)}>
      <label
        htmlFor={elementId}
        className={clsx('text-sm font-medium text-slate-500', { 'sr-only': srOnlyLabel })}
      >
        {label}
      </label>
      <CreatableSelect
        ref={ref}
        components={{ Control, Option, Input }}
        name={name}
        inputId={elementId}
        menuPortalTarget={document.body}
        className={clsx('react-select-container')}
        classNamePrefix="react-select"
        {...props}
      />
    </div>
  );
}

export const CreatableCombobox = forwardRef(CreatableComboboxComponent);
