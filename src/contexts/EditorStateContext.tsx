import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useActorRef } from '@xstate/react';
import { copyPasteMachine } from '@/machines/copy-paste-machine';
import { ActorRefFrom } from 'xstate';
import { SchemaType } from '@/schemas/schema';
import { useReactFlow } from '@xyflow/react';
import useUndoable from 'use-undoable';
import { useTransformSchemaToReactFlowData } from '@/flow-hooks/useTransformSchemaToReactFlowData';
import { CreateRelationDialogProps } from '@/components/CreateRelationDialog';
import { useHandleSaveLocalSchema } from '@/flow-hooks/useHandleSaveLocalSchema';
import { TableNodeType } from '@/schemas/table';
import { RelationEdgeType } from '@/schemas/relation';

type ReactFlowDataType = { nodes: TableNodeType[]; edges: RelationEdgeType[] };

type EditorState = {
  defaults: ReactFlowDataType;
  undoableService: {
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
  };
  relationDialogSource: CreateRelationDialogProps['source'];
};

// Kept stable across edits, so the tables and columns that read it re-render only from their own data
type EditorActions = {
  copyPasteService: ActorRefFrom<typeof copyPasteMachine>;
  updateData: (forcePass?: boolean) => void;
  setRelationDialogSource: CreateRelationDialogProps['setSource'];
};

const EditorStateContext = createContext<EditorState | null>(null);

const EditorActionsContext = createContext<EditorActions | null>(null);

export function useEditorState(): EditorState {
  const editorState = useContext(EditorStateContext);

  if (!editorState) {
    throw Error('useEditorState must be used within EditorStateProvider');
  }

  return editorState;
}

export function useEditorActions(): EditorActions {
  const editorActions = useContext(EditorActionsContext);

  if (!editorActions) {
    throw Error('useEditorActions must be used within EditorStateProvider');
  }

  return editorActions;
}

type EditorStateProviderProps = {
  schema: SchemaType;
  children: ReactNode;
};

export function EditorStateProvider({ schema, children }: EditorStateProviderProps) {
  const copyPasteService = useActorRef(copyPasteMachine);

  const transformSchemaToReactFlowData = useTransformSchemaToReactFlowData();

  // Parsed once: later schema changes flow through the undoable state, not the defaults
  const [defaults] = useState(() => transformSchemaToReactFlowData.parse(schema));

  const [, setReactFlowData, { undo, redo, canUndo, canRedo, past: pasts, future: futures }] =
    useUndoable({
      nodes: defaults.nodes,
      edges: defaults.edges,
    });

  const reactFlowInstance = useReactFlow<TableNodeType, RelationEdgeType>();
  const handleSaveSchema = useHandleSaveLocalSchema(schema.id);

  // React Flow applies setNodes, setEdges and deleteElements in a layout effect before its next
  // render, so the canvas is read in a passive effect once that render committed
  const forcePassRequested = useRef(false);
  const [updateRequests, requestUpdate] = useReducer((count: number) => count + 1, 0);

  const recordCanvas = useEffectEvent(() => {
    const forcePass = forcePassRequested.current;

    forcePassRequested.current = false;

    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();

    const nodePositionsMap = new Map(nodes.map((node) => [node.id, node.position]));

    setReactFlowData((currentData) => {
      if (forcePass) {
        return { edges, nodes };
      }

      const isPositionChanged = !!currentData.nodes.find((node) => {
        const newPosition = nodePositionsMap.get(node.id);

        return node.position.x !== newPosition?.x && node.position.y !== newPosition?.y;
      });

      const isNodeCountChanged = currentData.nodes.length !== nodes.length;

      if (!isPositionChanged && !isNodeCountChanged) {
        return currentData;
      }

      return { edges, nodes };
    });

    handleSaveSchema();
  });

  useEffect(() => {
    if (updateRequests > 0) {
      recordCanvas();
    }
  }, [updateRequests]);

  const handleUndo = () => {
    undo();

    const past = pasts.at(-1);

    if (!past) {
      return;
    }

    reactFlowInstance.setNodes(past.nodes);
    reactFlowInstance.setEdges(past.edges);
  };

  const handleRedo = () => {
    redo();

    const future = futures[0];

    if (!future) {
      return;
    }

    reactFlowInstance.setNodes(future.nodes);
    reactFlowInstance.setEdges(future.edges);
  };

  const [relationDialogSource, setRelationDialogSource] =
    useState<CreateRelationDialogProps['source']>(null);

  const actions = useMemo<EditorActions>(
    () => ({
      copyPasteService,
      updateData(forcePass = false) {
        forcePassRequested.current ||= forcePass;
        requestUpdate();
      },
      setRelationDialogSource,
    }),
    [copyPasteService],
  );

  return (
    <EditorActionsContext.Provider value={actions}>
      <EditorStateContext.Provider
        value={{
          defaults,
          undoableService: {
            undo: handleUndo,
            redo: handleRedo,
            canUndo,
            canRedo,
          },
          relationDialogSource,
        }}
      >
        {children}
      </EditorStateContext.Provider>
    </EditorActionsContext.Provider>
  );
}
