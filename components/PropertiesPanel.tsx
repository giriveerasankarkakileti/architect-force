import React, { useEffect, useState } from 'react';
import { AppNode } from '../types';
import { generateApexSnippet } from '../services/apexGenerator';
import { X, Trash2 } from 'lucide-react';

interface Props {
  node: AppNode | null;
  onUpdate: (id: string, newProps: any) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const PropertiesPanel: React.FC<Props> = ({ node, onUpdate, onDelete, onClose }) => {
  const [label, setLabel] = useState('');
  const [apiName, setApiName] = useState('');
  const [description, setDescription] = useState('');
  const [snippet, setSnippet] = useState('');

  // additional specific fields
  const [dataType, setDataType] = useState('');
  const [objectType, setObjectType] = useState('');
  const [query, setQuery] = useState('');

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

  useEffect(() => {
    if (node) {
      // Construct a temp node with current form state to generate preview
      const tempNode = {
        ...node,
        data: {
          ...node.data,
          properties: {
            label,
            apiName,
            description,
            dataType,
            objectType,
            query
          }
        }
      };
      setSnippet(generateApexSnippet(tempNode));
    }
  }, [node, label, apiName, description, dataType, objectType, query]);

  if (!node) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6 flex flex-col items-center justify-center text-center text-gray-500">
        <p>Select a node to edit properties</p>
      </div>
    );
  }

  const handleSave = () => {
    onUpdate(node.id, {
      label,
      apiName,
      description,
      dataType,
      objectType,
      query
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this node?')) {
        onDelete(node.id);
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
            onBlur={handleSave}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">API Name</label>
          <input 
            type="text" 
            className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono bg-gray-50"
            value={apiName}
            onChange={e => setApiName(e.target.value)}
            onBlur={handleSave}
          />
        </div>

        <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
            <textarea 
                className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none h-20 resize-none"
                value={description}
                onChange={e => setDescription(e.target.value)}
                onBlur={handleSave}
            />
        </div>

        {/* Dynamic Inputs based on Node Type */}
        {(node.data.subtype.includes('VAR_') || node.data.subtype === 'LOGIC_LOOP') && (
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Data Type / Collection</label>
                <input 
                    type="text" 
                    placeholder="e.g., String, List<Account>"
                    className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    value={dataType}
                    onChange={e => setDataType(e.target.value)}
                    onBlur={handleSave}
                />
            </div>
        )}

        {(node.data.subtype === 'VAR_SOBJECT' || node.data.subtype === 'LOGIC_DML' || node.data.subtype === 'LOGIC_SOQL') && (
             <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">SObject Type</label>
                <input 
                    type="text" 
                    placeholder="e.g., Account"
                    className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    value={objectType}
                    onChange={e => setObjectType(e.target.value)}
                    onBlur={handleSave}
                />
            </div>
        )}
        
        {node.data.subtype === 'LOGIC_SOQL' && (
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">SOQL Query</label>
                <textarea 
                    className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none h-24 font-mono text-xs"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onBlur={handleSave}
                />
            </div>
        )}

        <div className="pt-4">
            <button 
                onClick={handleDelete}
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