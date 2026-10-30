import { Position, InternalNode, Edge } from '@xyflow/react';

// returns the position (top,right,bottom or right) passed node compared to
function getParams(
  sourceNode: InternalNode,
  targetNode: InternalNode,
  relatedEdge: Edge,
): [number, number, Position] {
  const centerA = getNodeCenter(sourceNode);
  const centerB = getNodeCenter(targetNode);

  // edges always leave a table from its left or right side
  const position = centerA.x > centerB.x ? Position.Left : Position.Right;

  const [x, y] = getHandleCoordsByPosition(sourceNode, position, relatedEdge);

  return [x, y, position];
}

function getHandleCoordsByPosition(
  sourceNode: InternalNode,
  handlePosition: Position,
  relatedEdge: Edge,
): [number, number] {
  const sourceHandleId = relatedEdge.sourceHandle?.split('-').slice(0, -2).join('-');
  const targetHandleId = relatedEdge.targetHandle?.split('-').slice(0, -1).join('-');

  // all handles are from type source, that's why we use handleBounds.source here
  const handle = sourceNode.internals.handleBounds?.source?.find((h) => {
    const hId = h.id?.split('-').slice(0, -2).join('-');

    return h.position === handlePosition && (hId === sourceHandleId || hId === targetHandleId);
  });

  let offsetX = (handle?.width ?? 0) / 2;
  let offsetY = (handle?.height ?? 0) / 2;

  // this is a tiny detail to make the markerEnd of an edge visible.
  // The handle position that gets calculated has the origin top-left, so depending which side we are using, we add a little offset
  // when the handlePosition is Position.Right for example, we need to add an offset as big as the handle itself in order to get the correct position
  switch (handlePosition) {
    case Position.Left:
      offsetX = 0;
      break;
    case Position.Right:
      offsetX = handle?.width ?? 0;
      break;
    case Position.Top:
      offsetY = 0;
      break;
    case Position.Bottom:
      offsetY = handle?.height ?? 0;
      break;
  }

  const x = sourceNode.internals.positionAbsolute.x + (handle?.x ?? 0) + offsetX;
  const y = sourceNode.internals.positionAbsolute.y + (handle?.y ?? 0) + offsetY;

  return [x, y];
}

function getNodeCenter(node: InternalNode) {
  return {
    x: node.internals.positionAbsolute.x + (node.measured.width ?? 0) / 2,
    y: node.internals.positionAbsolute.y + (node.measured.height ?? 0) / 2,
  };
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(
  sourceNode: InternalNode,
  targetNode: InternalNode,
  relatedEdge: Edge,
) {
  const [sx, sy, sourcePos] = getParams(sourceNode, targetNode, relatedEdge);
  const [tx, ty, targetPos] = getParams(targetNode, sourceNode, relatedEdge);

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  };
}
