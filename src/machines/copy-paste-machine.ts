import { assign, setup } from 'xstate';
import { ReactFlowInstance } from '@xyflow/react';
import { ColumnType } from '@/schemas/column';
import { TableType } from '@/schemas/table';

type ClipboardPayloadType =
  | { type: 'COLUMN'; payload: ColumnType }
  | { type: 'TABLE'; payload: TableType };

type ClipboardPayloadWithStatusType =
  | ({ status: 'COPIED' | 'CUT' } & ClipboardPayloadType)
  | { status: 'EMPTY' };

type CopyPasteMachineContext = { clipboard: ClipboardPayloadWithStatusType };

type CopyPasteMachineEvent =
  | { type: 'COPY'; data: ClipboardPayloadType }
  | { type: 'CUT'; data: ClipboardPayloadType; reactFlowInstance: ReactFlowInstance };

type CopyPasteMachineTypes = { context?: CopyPasteMachineContext; events?: CopyPasteMachineEvent };

// setup() reads only the field types; no value is ever stored here
const types: CopyPasteMachineTypes = {};

export const copyPasteMachine = setup({
  types,
  actions: {
    replaceClipboard: assign({
      clipboard: ({ event }) => ({
        ...event.data,
        status: event.type === 'COPY' ? 'COPIED' : 'CUT',
      }),
    }),
    deleteInstance: ({ event }) => {
      if (event.type === 'CUT' && event.data.type === 'TABLE') {
        void event.reactFlowInstance.deleteElements({ nodes: [{ id: event.data.payload.id }] });
      }
    },
  },
}).createMachine({
  id: 'COPY_PASTE_MACHINE',
  initial: 'EMPTY_CLIPBOARD',
  context: { clipboard: { status: 'EMPTY' } },
  states: {
    EMPTY_CLIPBOARD: {
      on: {
        COPY: {
          target: 'FILLED_CLIPBOARD',
          actions: ['replaceClipboard'],
        },
        CUT: {
          target: 'FILLED_CLIPBOARD',
          actions: ['replaceClipboard', 'deleteInstance'],
        },
      },
    },
    FILLED_CLIPBOARD: {
      on: {
        COPY: {
          actions: ['replaceClipboard'],
        },
        CUT: {
          actions: ['replaceClipboard', 'deleteInstance'],
        },
      },
    },
  },
});
