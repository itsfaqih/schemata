import { useReactFlow } from '@xyflow/react';

export function useDeleteSelectedTable() {
  const reactFlowInstance = useReactFlow();

  return () => {
    const nodes = reactFlowInstance.getNodes();
    const selectedNodes = nodes.filter((node) => node.selected);

    void reactFlowInstance.deleteElements({ nodes: selectedNodes });
  };
}
