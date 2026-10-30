import type { GroupBase } from 'react-select';
// The augmentation below merges only when react-select/base is part of the program
import type * as ReactSelectBase from 'react-select/base';

declare module 'react-select/base' {
  // Comboboxes forward this to their Control, Option and Input test hooks
  export interface Props<Option, IsMulti extends boolean, Group extends GroupBase<Option>> {
    'data-test'?: string;
  }
}
