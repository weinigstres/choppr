import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { colorByValueStream } from '@/lib/canvas';

interface ProcessNodeData {
  key: string;
  name: string;
  value_stream: string;
}

function ProcessNode({ data }: { data: ProcessNodeData }) {
  const color = colorByValueStream(data.value_stream);

  return (
    <div className="bg-white border-2 rounded-lg shadow-md min-w-[200px]">
      <div
        className="h-2 rounded-t-md"
        style={{ backgroundColor: color }}
      />
      <div className="p-3">
        <div className="text-xs text-gray-500 mb-1">{data.key}</div>
        <div className="text-sm font-medium">{data.name}</div>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(ProcessNode);
