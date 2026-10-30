import { createContext, ReactNode, useContext, useState } from 'react';
import { useInterpret } from '@xstate/react';
import { copyPasteMachine } from '@/machines/copy-paste-machine';
import { InterpreterFrom } from 'xstate';
import { SchemaType } from '@/schemas/schema';
import { Edge, useReactFlow } from 'reactflow';
import useUndoable from 'use-undoable';
import { useTransformSchemaToReactFlowData } from '@/flow-hooks/useTransformSchemaToReactFlowData';
import { CreateRelationDialogProps } from '@/components/CreateRelationDialog';
import { useHandleSaveLocalSchema } from '@/flow-hooks/useHandleSaveLocalSchema';
import { TableNodeType } from '@/schemas/table';

type ReactFlowDataType = { nodes: TableNodeType[]; edges: Edge[] };

type EditorState = {
  copyPasteService: InterpreterFrom<typeof copyPasteMachine>;
  defaults: ReactFlowDataType;
  undoableService: {
    data: ReactFlowDataType;
    setData: (value: (currentData: ReactFlowDataType) => ReactFlowDataType) => void;
    updateData: (forcePass?: boolean) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
  };
  createRelationDialogStore: CreateRelationDialogProps;
};

const EditorStateContext = createContext<EditorState | null>(null);

export function useEditorState(): EditorState {
  const editorState = useContext(EditorStateContext);

  if (!editorState) {
    throw Error('useEditorState must be used within EditorStateProvider');
  }

  return editorState;
}

type EditorStateProviderProps = {
  schema: SchemaType;
  children: ReactNode;
};

export function EditorStateProvider({ schema, children }: EditorStateProviderProps) {
  const copyPasteService = useInterpret(copyPasteMachine);

  const transformSchemaToReactFlowData = useTransformSchemaToReactFlowData();

  // Parsed once: later schema changes flow through the undoable state, not the defaults
  const [defaults] = useState(() => transformSchemaToReactFlowData.parse(schema));

  const [
    reactFlowData,
    setReactFlowData,
    { undo, redo, canUndo, canRedo, past: pasts, future: futures },
  ] = useUndoable({
    nodes: defaults.nodes,
    edges: defaults.edges,
  });

  const reactFlowInstance = useReactFlow();
  const handleSaveSchema = useHandleSaveLocalSchema(schema.id);

  const updateData = (forcePass?: boolean) => {
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
  };

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

  const [createRelationDialogState, setCreateRelationDialogState] = useState<{
    source: CreateRelationDialogProps['source'];
  }>({
    source: null,
  });

  return (
    <EditorStateContext.Provider
      value={{
        copyPasteService,
        defaults,
        undoableService: {
          data: reactFlowData,
          setData: setReactFlowData,
          updateData,
          undo: handleUndo,
          redo: handleRedo,
          canUndo,
          canRedo,
        },
        createRelationDialogStore: {
          source: createRelationDialogState.source,
          setSource(source: CreateRelationDialogProps['source']) {
            setCreateRelationDialogState((currentState) => ({ ...currentState, source }));
          },
        },
      }}
    >
      {children}
    </EditorStateContext.Provider>
  );
}
