import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { AppNodeData } from '../types';
import { ICON_MAP } from '../constants';

const CustomNode = ({ data, selected }: NodeProps<AppNodeData>) => {
  const IconComponent = data.icon && ICON_MAP[data.icon] ? ICON_MAP[data.icon] : ICON_MAP['Code'];

  // Define border colors (accents) and subtle background colors
  const getStyles = () => {
    switch(data.type) {
      case 'VARIABLE': 
        return { 
          border: 'border-orange-400', 
          bg: 'bg-orange-50',
          iconBg: 'bg-orange-100 text-orange-600'
        };
      case 'LOGIC': 
        return { 
          border: 'border-blue-500', 
          bg: 'bg-blue-50',
          iconBg: 'bg-blue-100 text-blue-600'
        };
      case 'LWC': 
        return { 
          border: 'border-indigo-500', 
          bg: 'bg-indigo-50',
          iconBg: 'bg-indigo-100 text-indigo-600'
        };
      case 'INTEGRATION': 
        return { 
          border: 'border-emerald-500', 
          bg: 'bg-emerald-50',
          iconBg: 'bg-emerald-100 text-emerald-600'
        };
      case 'CLOUD': 
        return { 
          border: 'border-sky-600', 
          bg: 'bg-sky-50',
          iconBg: 'bg-sky-100 text-sky-600'
        };
      case 'EXPERIENCE': 
        return { 
          border: 'border-rose-400', 
          bg: 'bg-rose-50',
          iconBg: 'bg-rose-100 text-rose-600'
        };
      default: 
        return { 
          border: 'border-gray-300', 
          bg: 'bg-white',
          iconBg: 'bg-gray-100 text-gray-600'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`shadow-sm rounded-lg w-64 overflow-hidden border-l-4 transition-all duration-200 ${styles.bg} ${styles.border} ${selected ? 'ring-2 ring-blue-400 shadow-md' : 'hover:shadow-md'}`}>
      <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-3 !h-3" />
      
      <div className="flex items-center p-3 border-b border-black/5">
        <div className={`p-1.5 rounded-md mr-3 ${styles.iconBg}`}>
          <IconComponent size={18} />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="font-bold text-gray-800 text-sm truncate" title={data.properties.label}>
            {data.properties.label}
          </h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
            {data.subtype.replace('LOGIC_', '').replace('VAR_', '').replace('_', ' ')}
          </p>
        </div>
      </div>
      
      {data.properties.description && (
        <div className="p-2 px-3 text-xs text-gray-600 italic line-clamp-2 bg-white/50">
          {data.properties.description}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !w-3 !h-3" />
    </div>
  );
};

export default memo(CustomNode);