import { clsx } from '@/utils/clsx';
import { TableHeader } from './TableHeader';
import { useCreateColumn } from '@/flow-hooks/useCreateColumn';
import { emptyCreateVarcharColumn } from '@/utils/reactflow';
import { TableNodeType } from '@/schemas/table';
import { Tooltip } from './Tooltip';
import { memo, useState } from 'react';
import { PlusIcon } from '@heroicons/react/20/solid';
import { TableColumnList } from './TableColumnList';
import { DndContext } from '@dnd-kit/core';
import { NodeProps } from '@xyflow/react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useReorderColumn } from '@/flow-hooks/useReorderColumn';

// React Flow passes the node's position on every drag move; the table renders only from its id and data
export const TableNode = memo(
  TableNodeContent,
  (previous, next) => previous.id === next.id && previous.data === next.data,
);

function TableNodeContent({ id, data: table }: NodeProps<TableNodeType>) {
  const createColumn = useCreateColumn();

  const [isFocused, setIsFocused] = useState(false);

  const reorderColumn = useReorderColumn();

  return (
    <div
      id={`table-${id}`}
      onClick={() => {
        document.getElementById(`table-header-${id}`)?.focus();
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      data-test="table-node"
      className={clsx(
        'group/node min-w-[20rem] rounded-md bg-slate-200 px-3 pb-4 shadow-xs ring-1 ring-slate-200 ring-offset-2',
        'outline-offset-2 outline-sky-500 [&:has([id*=table-header-]:focus)]:outline-2',
      )}
    >
      <TableHeader table={{ id, ...table }} />

      <DndContext
        onDragEnd={({ active, over }) => {
          if (over && active.id !== over.id) {
            reorderColumn({
              movedColumnId: String(active.id),
              hoveredColumnId: String(over.id),
              tableId: id,
            });
          }
        }}
      >
        <SortableContext items={table.columns} strategy={verticalListSortingStrategy}>
          <TableColumnList table={{ id, ...table }} />
        </SortableContext>
      </DndContext>

      <Tooltip text="(SHIFT + ENTER)" disabled={!isFocused}>
        <button
          onClick={() => createColumn({ ...emptyCreateVarcharColumn(), tableId: id })}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              document.getElementById(`table-header-${id}`)?.focus();
            }

            if (e.key.includes('Arrow')) {
              e.stopPropagation();
            }
          }}
          data-test="create-column-button"
          className={clsx(
            'nodrag hidden w-full rounded-b bg-white py-3 px-4 text-left text-sm font-semibold text-sky-600 outline-sky-500',
            'hover:bg-slate-100',
            'group-hover/node:flex',
            'group-focus-within/node:flex',
            'focus:relative focus:z-10 focus:rounded-t focus:outline-2',
            'enabled:active:bg-slate-100',
            { 'rounded-t': table.columns.length === 0 },
          )}
        >
          <span className="flex items-center gap-x-2 text-sm tracking-wide uppercase">
            <PlusIcon aria-hidden className="h-5 w-5" />
            Add field
          </span>
        </button>
      </Tooltip>
    </div>
  );
}
