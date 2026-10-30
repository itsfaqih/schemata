import { DragEventHandler, useCallback, useEffect, MouseEvent, useRef } from 'react';
import { ReactFlow, Background, EdgeTypes, NodeTypes, Panel, useReactFlow } from '@xyflow/react';
import { useSelector } from '@xstate/react';
import { TableNode } from './TableNode';
import { GeneralPropsPanel } from './GeneralPropsPanel';
import { EditorPropsPanel } from './EditorPropsPanel';
import { ToolbarPanel } from './ToolbarPanel';
import { SimpleFloatingEdge } from './ReactFlow/SimpleFloatingEdge';
import { useAddCreateTableShortcut } from '@/flow-hooks/useAddCreateTableShortcut';
import { isUuid } from '@/utils/zod';
import { useHandleEdgeMarker } from '@/flow-hooks/useHandleEdgeMarker';
import { Markers } from './Markers';
import { useHandleCreateTableOnDrop } from '@/flow-hooks/useHandleCreateTableOnDrop';
import { emptyTableWithoutId, getColumnIdFromHandleId } from '@/utils/reactflow';
import { ContextMenu } from './ContextMenu';
import { useEditorState } from '@/contexts/EditorStateContext';
import { useCreateTable } from '@/flow-hooks/useCreateTable';
import { UtilsPanel } from './UtilsPanel';
import { AddTableIcon } from './Icon/AddTableIcon';
import { ClipboardIcon } from '@heroicons/react/20/solid';
import { TableNodeType } from '@/schemas/table';
import { SchemaType } from '@/schemas/schema';
import { RelationEdgeType } from '@/schemas/relation';

const nodeTypes: NodeTypes = { table: TableNode };

const edgeTypes: EdgeTypes = {
  floating: SimpleFloatingEdge,
};

type CanvasProps = {
  schema: SchemaType;
};

export function Canvas({ schema }: CanvasProps) {
  const reactFlowInstance = useReactFlow<TableNodeType, RelationEdgeType>();

  const { copyPasteService, defaults, undoableService } = useEditorState();

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop: DragEventHandler<HTMLDivElement> = useHandleCreateTableOnDrop();

  // Read only by keyboard shortcuts, so a mouse move does not re-render the canvas
  const cursorPositionRef = useRef({ x: 0, y: 0 });

  useAddCreateTableShortcut(cursorPositionRef);
  const handleEdgeMarker = useHandleEdgeMarker();

  const createTable = useCreateTable();

  const triggerPaste = (position: { x: number; y: number }) => {
    const {
      context: { clipboard },
    } = copyPasteService.getSnapshot();

    const finalPosition = reactFlowInstance.screenToFlowPosition(position);

    if (clipboard.status === 'COPIED' && clipboard.type === 'TABLE') {
      const { id: _id, ...payloadWithoutId } = clipboard.payload;

      createTable(payloadWithoutId, finalPosition);
    } else if (clipboard.status === 'CUT' && clipboard.type === 'TABLE') {
      createTable(clipboard.payload, finalPosition);
    }
  };

  useEffect(() => {
    const registerUndoRedoShortcut = (e: KeyboardEvent) => {
      if (
        !(
          document.activeElement instanceof HTMLDivElement ||
          document.activeElement instanceof HTMLBodyElement
        )
      ) {
        return;
      }

      if (e.target === e.currentTarget && e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        e.stopPropagation();

        undoableService.undo();
      }

      if (e.target === e.currentTarget && e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        e.stopPropagation();

        undoableService.redo();
      }
    };

    const registerPasteShortcut = (e: KeyboardEvent) => {
      if (e.target === e.currentTarget && e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        e.stopPropagation();
        triggerPaste(cursorPositionRef.current);
      }
    };

    document.body.addEventListener('keydown', registerUndoRedoShortcut);
    document.body.addEventListener('keydown', registerPasteShortcut);

    return () => {
      document.body.removeEventListener('keydown', registerUndoRedoShortcut);
      document.body.removeEventListener('keydown', registerPasteShortcut);
    };
  });

  const triggerCreateTable = (e: MouseEvent) => {
    const position = reactFlowInstance.screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    createTable(emptyTableWithoutId(), position);
  };

  const canPaste = useSelector(copyPasteService, (state) => state.matches('FILLED_CLIPBOARD'));

  return (
    <ContextMenu
      menu={[
        {
          label: 'Add table',
          'data-test': 'canvas-context-menu-add-table',
          icon: AddTableIcon,
          onClick: triggerCreateTable,
          kbd: 'T',
        },
        {
          label: 'Paste',
          'data-test': 'canvas-context-menu-paste',
          icon: ClipboardIcon,
          onClick: (e) => triggerPaste({ x: e.clientX, y: e.clientY }),
          disabled: !canPaste,
          kbd: 'CTRL + V',
        },
      ]}
    >
      <div className="h-screen w-full">
        <ReactFlow
          id="canvas"
          defaultNodes={defaults.nodes}
          defaultEdges={defaults.edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onDragOver={onDragOver}
          onDrop={onDrop}
          elevateEdgesOnSelect
          defaultEdgeOptions={{ type: 'floating' }}
          onNodesDelete={() => undoableService.updateData(true)}
          onEdgesDelete={() => undoableService.updateData(true)}
          onNodeDragStop={() => undoableService.updateData(true)}
          onConnect={() => {
            const edges =
              reactFlowInstance.getEdges().map((edge) => {
                if (isUuid(edge.id)) {
                  return edge;
                }

                if (!edge.sourceHandle || !edge.targetHandle) {
                  throw Error(`Handle id for edge ${edge.id} is empty`);
                }

                const { markerEnd, markerStart } = handleEdgeMarker(edge);

                const sourceTable = reactFlowInstance
                  .getNodes()
                  .find((node) => node.id === edge.source)?.data;

                const targetTable = reactFlowInstance
                  .getNodes()
                  .find((node) => node.id === edge.target)?.data;

                const sourceColumnId = getColumnIdFromHandleId(edge.sourceHandle);

                const sourceColumn = sourceTable?.columns.find(
                  (column) => column.id === sourceColumnId,
                );

                return {
                  ...edge,
                  id: crypto.randomUUID(),
                  markerEnd,
                  markerStart,
                  data: {
                    name: `fk_${sourceTable?.name}_${targetTable?.name}_${sourceColumn?.name}`,
                    sourceColumnId,
                    targetColumnId: getColumnIdFromHandleId(edge.targetHandle),
                    actions: { onUpdate: 'RESTRICT' as const, onDelete: 'RESTRICT' as const },
                  },
                };
              }) ?? [];

            reactFlowInstance.setEdges(edges);
          }}
          onConnectEnd={() => {
            undoableService.updateData(true);
          }}
          onPaneMouseMove={(e) => {
            cursorPositionRef.current = { x: e.clientX, y: e.clientY };
          }}
          data-test="canvas"
        >
          <Markers />
          <Panel position="top-left">
            <GeneralPropsPanel schema={schema} />
          </Panel>
          <Panel position="top-right">
            <EditorPropsPanel schema={schema} />
          </Panel>
          <Panel position="top-center">
            <ToolbarPanel />
          </Panel>
          <Panel position="bottom-left">
            <UtilsPanel />
          </Panel>
          {/* React Flow 12 centres each dot in its 20px cell; -9.5 (half the gap less half the
              dot) puts the dots back on the cell corners where version 11 drew them */}
          <Background className="bg-white" color="black" offset={-9.5} />
        </ReactFlow>
      </div>
    </ContextMenu>
  );
}
