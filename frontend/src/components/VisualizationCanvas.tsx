"use client";

import { useCompilerStore } from "../store/useCompilerStore";
import { ReactFlow, Background, Controls, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import FrameNode from "./FrameNode";
import HeapNode from "./HeapNode";
import { useMemo } from "react";
import dagre from "dagre";

const nodeTypes = {
  frameNode: FrameNode,
  heapNode: HeapNode,
};

export default function VisualizationCanvas() {
  const traceResult = useCompilerStore((state) => state.traceResult);
  const currentStepIndex = useCompilerStore((state) => state.currentStepIndex);
  
  const step = traceResult?.steps[currentStepIndex];

  const { nodes, edges } = useMemo(() => {
    if (!step) return { nodes: [], edges: [] };
    
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Map Frames
    step.frames.forEach((frame, idx) => {
      newNodes.push({
        id: `frame-${idx}`,
        type: 'frameNode',
        position: { x: 50, y: 50 + idx * 200 },
        data: frame,
      });

          frame.locals.forEach((loc) => {
        if (loc.ref_id) {
          newEdges.push({
            id: `edge-frame-${idx}-${loc.name}-to-${loc.ref_id}`,
            source: `frame-${idx}`,
            sourceHandle: loc.name,
            target: `heap-${loc.ref_id}`,
            animated: true,
            style: { stroke: 'var(--accent)', strokeWidth: 2 },
          });
        }
      });
    });

    // Map Heap Objects
    let heapY = 50;
    Object.values(step.heap).forEach((obj) => {
      newNodes.push({
        id: `heap-${obj.id}`,
        type: 'heapNode',
        position: { x: 450, y: heapY },
        data: obj,
      });
      heapY += 150;

      if (obj.type === 'list' || obj.type === 'tuple' || obj.type === 'set') {
        obj.value.forEach((item: any, i: number) => {
          if (item.ref) {
            newEdges.push({
              id: `edge-heap-${obj.id}-${i}-to-${item.ref}`,
              source: `heap-${obj.id}`,
              sourceHandle: `list-${obj.id}-${i}`,
              target: `heap-${item.ref}`,
              animated: true,
              style: { stroke: 'var(--primary)', strokeWidth: 2 },
            });
          }
        });
      } else if (obj.type === 'dict') {
        Object.entries(obj.value).forEach(([k, item]: [string, any]) => {
          if (item.ref) {
            newEdges.push({
              id: `edge-heap-${obj.id}-${k}-to-${item.ref}`,
              source: `heap-${obj.id}`,
              sourceHandle: `dict-${obj.id}-${k}`,
              target: `heap-${item.ref}`,
              animated: true,
              style: { stroke: 'var(--primary)', strokeWidth: 2 },
            });
          }
        });
      }
    });

    // Auto-layout with Dagre
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: 'LR', align: 'UL', nodesep: 50, ranksep: 120 });
    g.setDefaultEdgeLabel(() => ({}));

    newNodes.forEach((node) => {
      const width = node.type === 'frameNode' ? 250 : 200;
      const height = node.type === 'frameNode' ? Math.max(100, node.data.locals.length * 30) : 100;
      g.setNode(node.id, { width, height });
    });

    newEdges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    newNodes.forEach((node) => {
      const nodeWithPosition = g.node(node.id);
      node.position = {
        x: nodeWithPosition.x - nodeWithPosition.width / 2 + 50, // Added left padding
        y: nodeWithPosition.y - nodeWithPosition.height / 2 + 50, // Added top padding
      };
    });

    return { nodes: newNodes, edges: newEdges };
  }, [step]);

  return (
    <div className="w-full h-full border border-border rounded-xl overflow-hidden bg-panel relative flex flex-col transition-colors duration-300">
      <div className="w-full h-10 bg-header border-b border-border flex items-center px-4 backdrop-blur-md z-10 transition-colors duration-300">
        <span className="text-xs font-mono text-text-muted">Memory & Canvas</span>
      </div>
      <div className="flex-1 w-full h-full">
        {step ? (
          <ReactFlow 
            nodes={nodes} 
            edges={edges} 
            nodeTypes={nodeTypes}
            fitView
            panActivationKeyCode={null}
            selectionKeyCode={null}
            zoomActivationKeyCode={null}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="var(--border)" gap={16} />
            <Controls className="!bg-panel !border-border !fill-foreground" />
          </ReactFlow>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-text-muted text-sm transition-colors duration-300">
            <p>Write some Python code and hit Play to visualize execution.</p>
          </div>
        )}
      </div>
    </div>
  );
}
