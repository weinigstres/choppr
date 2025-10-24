import { Node, Edge } from 'reactflow';

export interface CanvasProcess {
  id: string;
  org_id: string;
  key: string;
  name: string;
  value_stream: string;
  x: number;
  y: number;
}

export interface CanvasRelationship {
  id: string;
  org_id: string;
  from_process: string;
  to_process: string;
  label: string | null;
}

export function colorByValueStream(valueStream: string): string {
  const colors: Record<string, string> = {
    Strategy2Portfolio: '#3b82f6',
    Requirement2Deploy: '#10b981',
    Request2Fulfill: '#f59e0b',
    Detect2Correct: '#ef4444',
  };
  return colors[valueStream] || '#6b7280';
}

export function toFlowNodes(processes: CanvasProcess[]): Node[] {
  return processes.map((process) => ({
    id: process.id,
    type: 'processNode',
    position: { x: process.x, y: process.y },
    data: {
      key: process.key,
      name: process.name,
      value_stream: process.value_stream,
    },
  }));
}

export function toFlowEdges(relationships: CanvasRelationship[]): Edge[] {
  return relationships.map((rel) => ({
    id: rel.id,
    source: rel.from_process,
    target: rel.to_process,
    label: rel.label || undefined,
    type: 'smoothstep',
  }));
}
