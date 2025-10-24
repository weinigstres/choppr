'use client';

import { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeDragHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { supabase } from '@/lib/supabase/client';
import {
  CanvasProcess,
  CanvasRelationship,
  toFlowNodes,
  toFlowEdges,
  colorByValueStream,
} from '@/lib/canvas';
import ProcessNode from './ProcessNode';

const nodeTypes = {
  processNode: ProcessNode,
};

export default function OperatingModelCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [editName, setEditName] = useState('');
  const [editKey, setEditKey] = useState('');
  const [editValueStream, setEditValueStream] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrgAndData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      const { data: membership } = await supabase
        .from('org_members')
        .select('org_id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!membership) return;

      setOrgId(membership.org_id);
      await loadCanvasData(membership.org_id);
    }
    loadOrgAndData();
  }, []);

  async function loadCanvasData(orgId: string) {
    setLoading(true);
    try {
      const { data: processes } = await supabase
        .from('canvas_processes')
        .select('*')
        .eq('org_id', orgId);

      const { data: relationships } = await supabase
        .from('process_relationships')
        .select('*')
        .eq('org_id', orgId);

      if (processes) {
        setNodes(toFlowNodes(processes as CanvasProcess[]));
      }

      if (relationships) {
        setEdges(toFlowEdges(relationships as CanvasRelationship[]));
      }
    } catch (error) {
      console.error('Failed to load canvas data:', error);
    } finally {
      setLoading(false);
    }
  }

  const onNodeDragStop: NodeDragHandler = useCallback(
    async (event, node) => {
      if (!orgId) return;

      await supabase
        .from('canvas_processes')
        .update({
          x: Math.round(node.position.x),
          y: Math.round(node.position.y),
        })
        .eq('id', node.id);
    },
    [orgId]
  );

  const onConnect = useCallback(
    async (connection: Connection) => {
      if (!orgId || !connection.source || !connection.target) return;

      const { data } = await supabase
        .from('process_relationships')
        .insert({
          org_id: orgId,
          from_process: connection.source,
          to_process: connection.target,
          label: null,
        })
        .select()
        .single();

      if (data) {
        setEdges((eds) => addEdge({ ...connection, id: data.id }, eds));
      }
    },
    [orgId, setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setEditName(node.data.name);
    setEditKey(node.data.key);
    setEditValueStream(node.data.value_stream);
  }, []);

  const closeSheet = () => {
    setSelectedNode(null);
  };

  async function saveNodeChanges() {
    if (!selectedNode || !orgId) return;

    await supabase
      .from('canvas_processes')
      .update({
        name: editName,
        key: editKey,
        value_stream: editValueStream,
      })
      .eq('id', selectedNode.id);

    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? {
              ...n,
              data: {
                ...n.data,
                name: editName,
                key: editKey,
                value_stream: editValueStream,
              },
            }
          : n
      )
    );

    closeSheet();
  }

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div>Loading canvas...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap nodeColor={(node) => colorByValueStream(node.data.value_stream)} />
      </ReactFlow>

      {selectedNode && (
        <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-lg border-l p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Process</h3>
            <button onClick={closeSheet} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Key</label>
              <input
                type="text"
                value={editKey}
                onChange={(e) => setEditKey(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Value Stream</label>
              <select
                value={editValueStream}
                onChange={(e) => setEditValueStream(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Strategy2Portfolio">Strategy to Portfolio</option>
                <option value="Requirement2Deploy">Requirement to Deploy</option>
                <option value="Request2Fulfill">Request to Fulfill</option>
                <option value="Detect2Correct">Detect to Correct</option>
              </select>
            </div>

            <button
              onClick={saveNodeChanges}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
