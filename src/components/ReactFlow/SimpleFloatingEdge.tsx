import { useReverseRelation } from '@/flow-hooks/useReverseRelation';
import { RelationEdgeType } from '@/schemas/relation';
import { TableNodeType } from '@/schemas/table';
import { getColumnIdFromHandleId } from '@/utils/reactflow';
import { ArrowsRightLeftIcon, Bars3Icon, TrashIcon } from '@heroicons/react/20/solid';
import { useCallback } from 'react';
import {
  useStore,
  getSmoothStepPath,
  useReactFlow,
  useInternalNode,
  EdgeProps,
} from '@xyflow/react';
import { DropdownMenu } from '../DropdownMenu';
import { getEdgeParams } from './utils';

type SimpleFloatingEdgeProps = Pick<
  EdgeProps<RelationEdgeType>,
  'id' | 'source' | 'target' | 'markerStart' | 'markerEnd' | 'style' | 'data'
>;

const foreignObjectSize = 40;

export function SimpleFloatingEdge({
  id,
  source,
  target,
  markerStart,
  markerEnd,
  style,
  data,
}: SimpleFloatingEdgeProps) {
  const reactFlowInstance = useReactFlow<TableNodeType>();
  const sourceNode = useInternalNode<TableNodeType>(source);
  const targetNode = useInternalNode<TableNodeType>(target);

  const sourceColumnId = data?.sourceColumnId;
  const targetColumnId = data?.targetColumnId;

  const relatedEdge = useStore(
    useCallback(
      (store) =>
        store.edges.find(
          (edge) =>
            !!edge.sourceHandle &&
            !!edge.targetHandle &&
            getColumnIdFromHandleId(edge.sourceHandle) === sourceColumnId &&
            getColumnIdFromHandleId(edge.targetHandle) === targetColumnId,
        ),
      [sourceColumnId, targetColumnId],
    ),
  );

  const reverseRelation = useReverseRelation();

  if (!sourceNode || !targetNode || !relatedEdge) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
    relatedEdge,
  );

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
    borderRadius: 16,
  });

  return (
    <>
      <path
        tabIndex={0}
        id={id}
        onKeyDown={(e) => {
          e.preventDefault();

          if (e.key === 'Delete') {
            void reactFlowInstance.deleteElements({ edges: [relatedEdge] });
          }
        }}
        d={edgePath}
        markerStart={markerStart}
        markerEnd={markerEnd}
        style={style}
        className="fill-none stroke-slate-400 stroke-[1.5] outline-hidden focus:stroke-sky-500"
      />
      <path
        d={edgePath}
        onClick={(e) => {
          const edge = e.currentTarget.previousElementSibling;

          if (edge instanceof SVGElement) edge.focus();
        }}
        className="peer fill-none stroke-transparent stroke-20 outline-hidden"
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        requiredExtensions="http://www.w3.org/1999/xhtml"
        className="invisible flex items-center justify-center peer-hover:visible peer-focus:visible focus-within:visible hover:visible"
      >
        <DropdownMenu
          trigger={
            <button className="rounded-full border border-white bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-600">
              <Bars3Icon className="h-5 w-5" />
            </button>
          }
          items={[
            {
              icon: ArrowsRightLeftIcon,
              label: 'Reverse',
              onClick() {
                reverseRelation(id);
              },
            },
            {
              icon: TrashIcon,
              label: 'Delete',
              onClick() {
                void reactFlowInstance.deleteElements({ edges: [relatedEdge] });
              },
            },
          ]}
        />
      </foreignObject>
    </>
  );
}
