import React, { useState } from 'react';
import { PALETTE_CATEGORIES, ICON_MAP } from '../constants';
import { NodeType, NodeSubtype } from '../types';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';

const Sidebar: React.FC = () => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'apex_vars': true,
    'apex_logic': true
  });

  const toggleCategory = (id: string) => {
    setOpenCategories(prev => ({...prev, [id]: !prev[id]}));
  };

  const onDragStart = (event: React.DragEvent, nodeType: NodeType, subType: NodeSubtype, label: string, icon: string) => {
    const dragData = { type: nodeType, subtype: subType, label, icon };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(dragData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg z-10">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Components</h2>
        <div className="relative">
            <Search className="absolute left-2 top-2 text-gray-400" size={14} />
            <input 
                type="text" 
                placeholder="Filter items..." 
                className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {PALETTE_CATEGORIES.map(cat => (
          <div key={cat.id} className="mb-2">
            <button 
              onClick={() => toggleCategory(cat.id)}
              className="w-full flex items-center justify-between p-2 text-left text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              <span>{cat.label}</span>
              {openCategories[cat.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            
            {openCategories[cat.id] && (
              <div className="ml-2 mt-1 space-y-1">
                {cat.items.map((item, idx) => {
                   const Icon = ICON_MAP[item.icon] || ICON_MAP['Code'];
                   return (
                    <div
                      key={`${item.type}-${item.subtype}-${idx}`}
                      className="flex items-center p-2 bg-white border border-gray-200 rounded cursor-grab hover:border-blue-500 hover:shadow-sm transition-all"
                      onDragStart={(event) => onDragStart(event, item.type, item.subtype, item.label, item.icon)}
                      draggable
                    >
                      <div className="mr-3 text-gray-500">
                        <Icon size={16} />
                      </div>
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </div>
                   );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;