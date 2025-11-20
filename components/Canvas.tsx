import React, { useCallback, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Connection, 
  Edge, 
  addEdge, 
  NodeChange, 
  EdgeChange, 
  applyNodeChanges, 
  applyEdgeChanges,
  ReactFlowProvider,
  BackgroundVariant
} from 'reactflow';
import CustomNode from './CustomNode';
import { AppNode, AppEdge } from '../types';

const nodeTypes = {
  VARIABLE: CustomNode,
  LOGIC: CustomNode,
  LWC: CustomNode,
  EXPERIENCE: CustomNode,
  CLOUD: CustomNode,
  INTEGRATION: CustomNode,
  CUSTOM: CustomNode,
};

interface Props {
  nodes: AppNode[];
  edges: AppEdge[];
  setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<AppEdge[]>>;
  onNodeClick: (event: React.MouseEvent, node: AppNode) => void;
}

const Canvas: React.FC<Props> = ({ nodes, edges, setNodes, setEdges, onNodeClick }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const rawData = event.dataTransfer.getData('application/reactflow');
      
      if (!rawData || !reactFlowBounds) return;

      const { type, subtype, label, icon } = JSON.parse(rawData);

      // Calculate position relative to canvas
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 40,
      };

      const newNode: AppNode = {
        id: `${type}_${Date.now()}`,
        type: type, // Uses CustomNode for all types mapped in nodeTypes
        position,
        data: {
          type,
          subtype,
          icon,
          properties: { label, description: '' }
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  return (
    <div className="flex-1 h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        className="bg-white"
        defaultEdgeOptions={{ type: 'smoothstep', style: { strokeWidth: 2, stroke: '#b0adab' } }}
      >
        <Background color="#f1f5f9" variant={BackgroundVariant.Lines} gap={24} size={1} />
        <Controls className="!bg-white !shadow-md !border-none !text-gray-600" />
        <MiniMap 
          nodeColor={(n) => {
             switch(n.data.type) {
                 case 'LOGIC': return '#3b82f6';
                 case 'VARIABLE': return '#fb923c';
                 default: return '#d1d5db';
             }
          }}
          className="!bg-white !border !border-gray-200 !shadow-md rounded-md"
        />
      </ReactFlow>
    </div>
  );
};

export default function WrappedCanvas(props: Props) {
    return (
        <ReactFlowProvider>
            <Canvas {...props} />
        </ReactFlowProvider>
    )
}