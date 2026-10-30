import type { GroupBase } from 'react-select';

declare module 'react-select/dist/declarations/src/Select' {
  // Comboboxes forward this to their Control, Option and Input test hooks
  export interface Props<Option, IsMulti extends boolean, Group extends GroupBase<Option>> {
    'data-test'?: string;
  }
}
