import React, { useState } from 'react';
import { PALETTE_CATEGORIES, ICON_MAP } from '../constants';
import { NodeType, NodeSubtype, NodeStyle } from '../types';
import { ChevronDown, ChevronRight, Search, Plus, X } from 'lucide-react';

// Color mapping for the "Add Element" feature
const COLOR_THEMES: Record<string, NodeStyle> = {
  orange: { border: 'border-orange-400', bg: 'bg-orange-50', iconBg: 'bg-orange-100 text-orange-600' },
  blue: { border: 'border-blue-500', bg: 'bg-blue-50', iconBg: 'bg-blue-100 text-blue-600' },
  indigo: { border: 'border-indigo-500', bg: 'bg-indigo-50', iconBg: 'bg-indigo-100 text-indigo-600' },
  emerald: { border: 'border-emerald-500', bg: 'bg-emerald-50', iconBg: 'bg-emerald-100 text-emerald-600' },
  sky: { border: 'border-sky-600', bg: 'bg-sky-50', iconBg: 'bg-sky-100 text-sky-600' },
  rose: { border: 'border-rose-400', bg: 'bg-rose-50', iconBg: 'bg-rose-100 text-rose-600' },
  gray: { border: 'border-gray-300', bg: 'bg-white', iconBg: 'bg-gray-100 text-gray-600' },
};

// Interface definitions to support customStyle
interface PaletteItem {
  type: NodeType;
  subtype: NodeSubtype;
  label: string;
  icon: string;
  customStyle?: NodeStyle;
}

interface PaletteCategory {
  id: string;
  label: string;
  items: PaletteItem[];
}

interface NewItemForm {
  label: string;
  icon: string;
  theme: string;
}

const Sidebar: React.FC = () => {
  // State for palette categories (initialized from constant)
  const [categories, setCategories] = useState<PaletteCategory[]>(PALETTE_CATEGORIES as PaletteCategory[]);
  
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'apex_vars': true,
    'apex_logic': true
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetCategoryId, setTargetCategoryId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<NewItemForm>({
    label: '',
    icon: 'Code',
    theme: 'blue'
  });

  const toggleCategory = (id: string) => {
    setOpenCategories(prev => ({...prev, [id]: !prev[id]}));
  };

  const onDragStart = (event: React.DragEvent, nodeType: NodeType, subType: NodeSubtype, label: string, icon: string, customStyle?: NodeStyle) => {
    const dragData = { type: nodeType, subtype: subType, label, icon, customStyle };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(dragData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const openAddModal = (e: React.MouseEvent, categoryId: string) => {
    e.stopPropagation(); // Prevent toggling accordion
    setTargetCategoryId(categoryId);
    setNewItem({ label: '', icon: 'Code', theme: 'blue' });
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    if (!targetCategoryId || !newItem.label) return;

    setCategories(prevCats => prevCats.map(cat => {
      if (cat.id === targetCategoryId) {
        // Determine default type/subtype based on existing items or generic fallback
        const defaultType = cat.items.length > 0 ? cat.items[0].type : NodeType.CUSTOM;
        const defaultSubtype = cat.items.length > 0 ? cat.items[0].subtype : NodeSubtype.CUSTOM_GENERIC;

        const newItemObj: PaletteItem = {
          type: defaultType,
          subtype: defaultSubtype,
          label: newItem.label,
          icon: newItem.icon,
          customStyle: COLOR_THEMES[newItem.theme]
        };
        return { ...cat, items: [...cat.items, newItemObj] };
      }
      return cat;
    }));

    setIsModalOpen(false);
    setTargetCategoryId(null);
  };

  return (
    <>
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
          {categories.map(cat => (
            <div key={cat.id} className="mb-2">
              <div 
                className="w-full flex items-center justify-between p-2 text-left text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded transition-colors group"
                onClick={() => toggleCategory(cat.id)}
              >
                <div className="flex items-center gap-2">
                   {openCategories[cat.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                   <span>{cat.label}</span>
                </div>
                
                {/* Add Button */}
                <button 
                  onClick={(e) => openAddModal(e, cat.id)}
                  className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-[#0176D3] opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Add Item"
                >
                  <Plus size={14} />
                </button>
              </div>
              
              {openCategories[cat.id] && (
                <div className="ml-2 mt-1 space-y-1">
                  {cat.items.map((item, idx) => {
                     const Icon = ICON_MAP[item.icon] || ICON_MAP['Code'];
                     // Determine color for sidebar preview (approximate)
                     let iconColorClass = "text-gray-500";
                     if (item.customStyle) {
                        // Extract color class logic for preview
                        if (item.customStyle.bg.includes('orange')) iconColorClass = "text-orange-600";
                        else if (item.customStyle.bg.includes('blue')) iconColorClass = "text-blue-600";
                        else if (item.customStyle.bg.includes('indigo')) iconColorClass = "text-indigo-600";
                        else if (item.customStyle.bg.includes('emerald')) iconColorClass = "text-emerald-600";
                        else if (item.customStyle.bg.includes('sky')) iconColorClass = "text-sky-600";
                        else if (item.customStyle.bg.includes('rose')) iconColorClass = "text-rose-600";
                     }

                     return (
                      <div
                        key={`${item.type}-${item.subtype}-${idx}`}
                        className="flex items-center p-2 bg-white border border-gray-200 rounded cursor-grab hover:border-blue-500 hover:shadow-sm transition-all"
                        onDragStart={(event) => onDragStart(event, item.type, item.subtype, item.label, item.icon, item.customStyle)}
                        draggable
                      >
                        <div className={`mr-3 ${iconColorClass}`}>
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

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-80 overflow-hidden">
            <div className="bg-[#0176D3] px-4 py-3 flex justify-between items-center">
              <h3 className="text-white font-semibold text-sm">Add New Component</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Label / Name</label>
                <input 
                  type="text" 
                  autoFocus
                  value={newItem.label}
                  onChange={(e) => setNewItem({...newItem, label: e.target.value})}
                  className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Marketing Cloud"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Icon</label>
                <select 
                  value={newItem.icon}
                  onChange={(e) => setNewItem({...newItem, icon: e.target.value})}
                  className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 focus:outline-none"
                >
                  {Object.keys(ICON_MAP).sort().map(iconName => (
                    <option key={iconName} value={iconName}>{iconName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Color Theme</label>
                <select 
                  value={newItem.theme}
                  onChange={(e) => setNewItem({...newItem, theme: e.target.value})}
                  className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="orange">Orange (Variables)</option>
                  <option value="blue">Blue (Logic)</option>
                  <option value="indigo">Indigo (LWC)</option>
                  <option value="emerald">Emerald (Integrations)</option>
                  <option value="sky">Sky (Clouds)</option>
                  <option value="rose">Rose (Experience)</option>
                  <option value="gray">Gray (Generic)</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddItem}
                className="px-3 py-1.5 text-sm bg-[#0176D3] hover:bg-[#014486] text-white rounded shadow-sm font-medium"
              >
                Add Component
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
