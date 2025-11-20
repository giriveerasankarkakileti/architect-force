import { AppNode, AppEdge, ProjectData } from '../types';
import saveAs from 'file-saver';

export const saveProject = (name: string, nodes: AppNode[], edges: AppEdge[]) => {
  const data: ProjectData = { name, nodes, edges };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  saveAs(blob, `${name.replace(/\s+/g, '_')}.json`);
};

export const loadProject = (file: File, callback: (data: ProjectData) => void) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target?.result as string);
      if (json.nodes && json.edges) {
        callback(json);
      } else {
        alert('Invalid project file structure.');
      }
    } catch (err) {
      alert('Failed to parse JSON.');
    }
  };
  reader.readAsText(file);
};

export const downloadApex = (content: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'SolutionSkeleton.cls');
};