import { components, ControlProps, GroupBase, InputProps, OptionProps } from 'react-select';

export { default as Select } from 'react-select';

export { default as CreatableSelect } from 'react-select/creatable';

export type ComboboxOption = {
  label: string;
  value: string;
};

export function Option<
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

export function Control<
  Option extends ComboboxOption,
  isMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: ControlProps<Option, isMulti, Group> & { 'data-test'?: string }) {
  const innerProps: ControlProps<Option, isMulti, Group>['innerProps'] & {
    'data-test': string | undefined;
  } = { ...props.innerProps, 'data-test': props.selectProps['data-test'] };

  return <components.Control {...props} innerProps={innerProps} />;
}

export function Input<
  Option extends ComboboxOption,
  isMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: InputProps<Option, isMulti, Group> & { 'data-test'?: string }) {
  return <components.Input {...props} data-test={`${props.selectProps['data-test']}-input`} />;
}
