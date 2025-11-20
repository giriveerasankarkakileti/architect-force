import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Cloud, Download, FolderOpen, Save, Share2, ChevronDown, FileImage, FileText } from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import Sidebar from './components/Sidebar';
import WrappedCanvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import { AppNode, AppEdge } from './types';
import { generateFullApexCode } from './services/apexGenerator';
import { saveProject, loadProject, downloadApex } from './services/projectService';

const App: React.FC = () => {
  const [nodes, setNodes] = useState<AppNode[]>([]);
  const [edges, setEdges] = useState<AppEdge[]>([]);
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const [showExportMenu, setShowExportMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId) || null;

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onNodeClick = (_: React.MouseEvent, node: AppNode) => {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null); // Deselect edge when node clicked
  };

  const onEdgeClick = (_: React.MouseEvent, edge: AppEdge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null); // Deselect node when edge clicked
  };

  const onUpdateNode = (id: string, newProps: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              properties: { ...node.data.properties, ...newProps },
            },
          };
        }
        return node;
      })
    );
  };

  const onUpdateEdge = (id: string, label: string, color: string) => {
    setEdges((eds) => 
      eds.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            label: label,
            style: { ...edge.style, stroke: color },
            // Update label styles to match the selected color
            labelStyle: { fill: color, fontWeight: 700 }, 
            labelBgStyle: { fill: '#ffffff', stroke: color, strokeWidth: 1, fillOpacity: 0.95 },
          };
        }
        return edge;
      })
    );
  };

  const onDeleteNode = (id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setSelectedNodeId(null);
  };

  const onDeleteEdge = (id: string) => {
    setEdges((eds) => eds.filter((e) => e.id !== id));
    setSelectedEdgeId(null);
  };

  // Actions
  const handleSave = () => saveProject('ArchitectForce', nodes, edges);
  
  const handleLoadClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadProject(file, (data) => {
        setNodes(data.nodes);
        setEdges(data.edges);
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
      });
    }
  };

  const handleDownloadApex = () => {
    const code = generateFullApexCode(nodes, edges);
    downloadApex(code);
  };

  const getCanvasElement = () => document.querySelector('.react-flow') as HTMLElement;

  const handleDownloadSvg = useCallback(() => {
    const canvasElement = getCanvasElement();
    if (canvasElement) {
      toSvg(canvasElement, { 
        backgroundColor: '#ffffff', // Force white background
        filter: (node) => {
            // Filter out controls and the background grid pattern
            const classList = node.classList;
            if (!classList) return true;
            return !classList.contains('react-flow__controls') && !classList.contains('react-flow__background');
        }
      })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'architect_force_map.svg';
          link.href = dataUrl;
          link.click();
          setShowExportMenu(false);
        })
        .catch((err) => {
          console.error('Failed to export SVG', err);
          alert('Could not generate SVG. Please try again.');
        });
    } else {
        alert('Canvas not found.');
    }
  }, []);

  const handleDownloadPdf = useCallback(() => {
    const canvasElement = getCanvasElement();
    if (canvasElement) {
      // Using toPng first as it's more reliable for embedding in jsPDF
      toPng(canvasElement, { 
        backgroundColor: '#ffffff', // Force white background
        filter: (node) => {
            // Filter out controls and the background grid pattern
            const classList = node.classList;
            if (!classList) return true;
            return !classList.contains('react-flow__controls') && !classList.contains('react-flow__background');
        }
      })
        .then((dataUrl) => {
          const pdf = new jsPDF({
            orientation: 'landscape',
          });
          
          const imgProps = pdf.getImageProperties(dataUrl);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          
          pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('architect_force_map.pdf');
          setShowExportMenu(false);
        })
        .catch((err) => {
          console.error('Failed to export PDF', err);
          alert('Could not generate PDF. Please try again.');
        });
    } else {
        alert('Canvas not found.');
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm z-30 relative">
        <div className="flex items-center gap-2">
          <div className="bg-[#0176D3] text-white p-1.5 rounded-md">
            <Cloud size={20} />
          </div>
          <h1 className="font-semibold text-gray-800 text-lg">Architect Force</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".json" 
            onChange={handleFileChange} 
          />
          
          <button onClick={handleLoadClick} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#0176D3] px-3 py-1.5 rounded transition-colors">
            <FolderOpen size={16} />
            <span>Load</span>
          </button>

          <button onClick={handleSave} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#0176D3] px-3 py-1.5 rounded transition-colors">
            <Save size={16} />
            <span>Save</span>
          </button>

          <div className="h-6 w-px bg-gray-300 mx-1"></div>

          {/* Export Dropdown */}
          <div className="relative" ref={exportMenuRef}>
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)} 
              className={`flex items-center gap-1.5 text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded shadow-sm transition-all ${showExportMenu ? 'bg-gray-100 ring-2 ring-blue-100 border-blue-300' : ''}`}
            >
              <Share2 size={16} />
              <span>Export Map</span>
              <ChevronDown size={14} className={`transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showExportMenu && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-50">
                <div className="py-1">
                  <button 
                    onClick={handleDownloadSvg}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#0176D3] transition-colors text-left"
                  >
                    <FileImage size={16} />
                    <span>Download as SVG</span>
                  </button>
                  <button 
                    onClick={handleDownloadPdf}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#0176D3] transition-colors text-left"
                  >
                    <FileText size={16} />
                    <span>Download as PDF</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleDownloadApex} className="flex items-center gap-1.5 text-sm bg-[#0176D3] hover:bg-[#014486] text-white px-4 py-1.5 rounded shadow-sm transition-all font-medium">
            <Download size={16} />
            <span>Get Apex</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        
        <main className="flex-1 relative h-full">
          <WrappedCanvas 
            nodes={nodes} 
            edges={edges} 
            setNodes={setNodes} 
            setEdges={setEdges} 
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
          />
        </main>

        {(selectedNodeId || selectedEdgeId) && (
          <PropertiesPanel 
            node={selectedNode} 
            edge={selectedEdge}
            onUpdateNode={onUpdateNode}
            onUpdateEdge={onUpdateEdge}
            onDeleteNode={onDeleteNode}
            onDeleteEdge={onDeleteEdge}
            onClose={() => {
                setSelectedNodeId(null);
                setSelectedEdgeId(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default App;
