import React, { useEffect, useState } from 'react';
import { AppNode, AppEdge } from '../types';
import { generateApexSnippet } from '../services/apexGenerator';
import { X, Trash2, ArrowRight } from 'lucide-react';

interface Props {
  node: AppNode | null;
  edge: AppEdge | null;
  onUpdateNode: (id: string, newProps: any) => void;
  onUpdateEdge: (id: string, label: string, color: string) => void;
  onDeleteNode: (id: string) => void;
  onDeleteEdge: (id: string) => void;
  onClose: () => void;
}

const PropertiesPanel: React.FC<Props> = ({ node, edge, onUpdateNode, onUpdateEdge, onDeleteNode, onDeleteEdge, onClose }) => {
  // Node State
  const [label, setLabel] = useState('');
  const [apiName, setApiName] = useState('');
  const [description, setDescription] = useState('');
  const [snippet, setSnippet] = useState('');
  const [dataType, setDataType] = useState('');
  const [objectType, setObjectType] = useState('');
  const [query, setQuery] = useState('');

  // Edge State
  const [edgeLabel, setEdgeLabel] = useState('');
  const [edgeColor, setEdgeColor] = useState('#b0adab');

  // Update Node State when node changes
  useEffect(() => {
    if (node) {
      const props = node.data.properties;
      setLabel(props.label || '');
      setApiName(props.apiName || '');
      setDescription(props.description || '');
      setDataType(props.dataType || '');
      setObjectType(props.objectType || '');
      setQuery(props.query || '');
    }
  }, [node]);

  // Update Edge State when edge changes
  useEffect(() => {
    if (edge) {
      setEdgeLabel(edge.label as string || '');
      setEdgeColor(edge.style?.stroke as string || '#b0adab');
    }
  }, [edge]);

  // Generate Snippet
  useEffect(() => {
    if (node) {
      const tempNode = {
        ...node,
        data: {
          ...node.data,
          properties: { label, apiName, description, dataType, objectType, query }
        }
      };
      setSnippet(generateApexSnippet(tempNode));
    }
  }, [node, label, apiName, description, dataType, objectType, query]);

  if (!node && !edge) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6 flex flex-col items-center justify-center text-center text-gray-500">
        <p>Select a node or connection to edit properties</p>
      </div>
    );
  }

  // --- EDGE PANEL ---
  if (edge) {
    const handleEdgeSave = () => {
        onUpdateEdge(edge.id, edgeLabel, edgeColor);
    };

    const handleEdgeDelete = () => {
        if (confirm('Are you sure you want to delete this connection?')) {
            onDeleteEdge(edge.id);
            onClose();
        }
    };

    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full shadow-xl z-20">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
             <ArrowRight size={16} className="text-gray-500"/>
             <h2 className="text-sm font-bold text-gray-700 uppercase">Path Properties</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Path Label</label>
            <input 
              type="text" 
              placeholder="e.g. Success, True, On Error"
              className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              value={edgeLabel}
              onChange={e => setEdgeLabel(e.target.value)}
              onBlur={handleEdgeSave}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Path Color</label>
            <select 
                value={edgeColor} 
                onChange={(e) => {
                    setEdgeColor(e.target.value);
                    // Automatically save on selection change for better UX
                    onUpdateEdge(edge.id, edgeLabel, e.target.value);
                }}
                className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 outline-none"
            >
                <option value="#b0adab">Neutral (Gray)</option>
                <option value="#04844b">Success / True (Green)</option>
                <option value="#ea001e">Failure / False (Red)</option>
                <option value="#0176d3">Standard (Blue)</option>
                <option value="#eab308">Warning (Yellow)</option>
            </select>
          </div>

          <div className="pt-4">
            <button 
                onClick={handleEdgeDelete}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-sm rounded hover:bg-red-50 transition-colors"
            >
                <Trash2 size={16} />
                Delete Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- NODE PANEL ---
  const handleNodeSave = () => {
    onUpdateNode(node!.id, {
      label,
      apiName,
      description,
      dataType,
      objectType,
      query
    });
  };

  const handleNodeDelete = () => {
    if (confirm('Are you sure you want to delete this node?')) {
        onDeleteNode(node!.id);
        onClose();
    }
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full shadow-xl z-20">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h2 className="text-sm font-bold text-gray-700 uppercase">Properties</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
          <input 
            type="text" 
            className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            value={label}
            onChange={e => setLabel(e.target.value)}
            onBlur={handleNodeSave}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">API Name</label>
          <input 
            type="text" 
            className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono bg-gray-50"
            value={apiName}
            onChange={e => setApiName(e.target.value)}
            onBlur={handleNodeSave}
          />
        </div>

        <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
            <textarea 
                className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none h-20 resize-none"
                value={description}
                onChange={e => setDescription(e.target.value)}
                onBlur={handleNodeSave}
            />
        </div>

        {/* Dynamic Inputs based on Node Type */}
        {(node!.data.subtype.includes('VAR_') || node!.data.subtype === 'LOGIC_LOOP') && (
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Data Type / Collection</label>
                <input 
                    type="text" 
                    placeholder="e.g., String, List<Account>"
                    className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    value={dataType}
                    onChange={e => setDataType(e.target.value)}
                    onBlur={handleNodeSave}
                />
            </div>
        )}

        {(node!.data.subtype === 'VAR_SOBJECT' || node!.data.subtype === 'LOGIC_DML' || node!.data.subtype === 'LOGIC_SOQL') && (
             <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">SObject Type</label>
                <input 
                    type="text" 
                    placeholder="e.g., Account"
                    className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    value={objectType}
                    onChange={e => setObjectType(e.target.value)}
                    onBlur={handleNodeSave}
                />
            </div>
        )}
        
        {node!.data.subtype === 'LOGIC_SOQL' && (
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">SOQL Query</label>
                <textarea 
                    className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none h-24 font-mono text-xs"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onBlur={handleNodeSave}
                />
            </div>
        )}

        <div className="pt-4">
            <button 
                onClick={handleNodeDelete}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-sm rounded hover:bg-red-50 transition-colors"
            >
                <Trash2 size={16} />
                Delete Node
            </button>
        </div>

      </div>

      {/* Code Preview */}
      <div className="p-4 border-t border-gray-200 bg-slate-900 text-white">
        <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Apex Preview</h3>
        <pre className="text-xs font-mono overflow-x-auto p-2 bg-black rounded border border-slate-700 text-green-400">
            {snippet}
        </pre>
      </div>
    </div>
  );
};

export default PropertiesPanel;
