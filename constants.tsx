import { 
  Code, Database, Shuffle, Box, Layers, Globe, Cloud, 
  Cpu, Activity, Shield, Zap, GitBranch, Repeat, 
  Search, Save, AlertTriangle, Play, Clock, Link,
  Server, MessageSquare, Wifi, FileJson, FileCode,
  Layout, UserCheck, Navigation
} from 'lucide-react';
import { NodeType, NodeSubtype } from './types';

export const PALETTE_CATEGORIES = [
  {
    id: 'apex_vars',
    label: 'Apex Variables',
    items: [
      { type: NodeType.VARIABLE, subtype: NodeSubtype.VAR_PRIMITIVE, label: 'Primitive (String/Int)', icon: 'Code' },
      { type: NodeType.VARIABLE, subtype: NodeSubtype.VAR_COLLECTION, label: 'Collection (List/Set)', icon: 'Layers' },
      { type: NodeType.VARIABLE, subtype: NodeSubtype.VAR_SOBJECT, label: 'SObject Variable', icon: 'Database' },
    ]
  },
  {
    id: 'apex_logic',
    label: 'Apex Logic & Flow',
    items: [
      { type: NodeType.LOGIC, subtype: NodeSubtype.LOGIC_TRIGGER, label: 'Apex Trigger', icon: 'Zap' },
      { type: NodeType.LOGIC, subtype: NodeSubtype.LOGIC_METHOD, label: 'Apex Method', icon: 'Play' },
      { type: NodeType.LOGIC, subtype: NodeSubtype.LOGIC_ASSIGNMENT, label: 'Assignment', icon: 'Shuffle' },
      { type: NodeType.LOGIC, subtype: NodeSubtype.LOGIC_IF, label: 'If / Else', icon: 'GitBranch' },
      { type: NodeType.LOGIC, subtype: NodeSubtype.LOGIC_LOOP, label: 'Loop (For/While)', icon: 'Repeat' },
      { type: NodeType.LOGIC, subtype: NodeSubtype.LOGIC_SOQL, label: 'SOQL Query', icon: 'Search' },
      { type: NodeType.LOGIC, subtype: NodeSubtype.LOGIC_DML, label: 'DML Operation', icon: 'Save' },
      { type: NodeType.LOGIC, subtype: NodeSubtype.LOGIC_TRY_CATCH, label: 'Try / Catch', icon: 'AlertTriangle' },
      { type: NodeType.LOGIC, subtype: NodeSubtype.LOGIC_ASYNC, label: 'Async (Future/Queue)', icon: 'Clock' },
    ]
  },
  {
    id: 'lwc',
    label: 'LWC Components',
    items: [
      { type: NodeType.LWC, subtype: NodeSubtype.LWC_COMPONENT, label: 'LWC Component', icon: 'Box' },
      { type: NodeType.LWC, subtype: NodeSubtype.LWC_WIRE, label: 'Wire Adapter', icon: 'Link' },
      { type: NodeType.LWC, subtype: NodeSubtype.LWC_EVENT_EMIT, label: 'Dispatch Event', icon: 'Wifi' },
      { type: NodeType.LWC, subtype: NodeSubtype.LWC_IMPERATIVE, label: 'Imperative Apex', icon: 'Server' },
    ]
  },
  {
    id: 'experience',
    label: 'Experience Cloud',
    items: [
      { type: NodeType.EXPERIENCE, subtype: NodeSubtype.EXP_PAGE, label: 'Site Page', icon: 'Layout' },
      { type: NodeType.EXPERIENCE, subtype: NodeSubtype.EXP_ACCESS, label: 'Guest Access', icon: 'UserCheck' },
    ]
  },
  {
    id: 'integrations',
    label: 'Integrations',
    items: [
      { type: NodeType.INTEGRATION, subtype: NodeSubtype.INT_REST, label: 'REST Callout', icon: 'Globe' },
      { type: NodeType.INTEGRATION, subtype: NodeSubtype.INT_PLATFORM_EVENT, label: 'Platform Event', icon: 'Activity' },
    ]
  },
  {
    id: 'clouds',
    label: 'Salesforce Clouds',
    items: [
      { type: NodeType.CLOUD, subtype: NodeSubtype.CLOUD_SALES, label: 'Sales Cloud', icon: 'Cloud' },
      { type: NodeType.CLOUD, subtype: NodeSubtype.CLOUD_SERVICE, label: 'Service Cloud', icon: 'Shield' },
    ]
  },
  {
    id: 'custom',
    label: 'Custom',
    items: [
      { type: NodeType.CUSTOM, subtype: NodeSubtype.CUSTOM_GENERIC, label: 'Custom Node', icon: 'Cpu' },
    ]
  }
];

export const ICON_MAP: Record<string, any> = {
  Code, Database, Shuffle, Box, Layers, Globe, Cloud, Cpu, Activity, Shield, 
  Zap, GitBranch, Repeat, Search, Save, AlertTriangle, Play, Clock, Link, 
  Server, MessageSquare, Wifi, FileJson, FileCode, Layout, UserCheck, Navigation
};

export const DEFAULT_NODE_PROPS = {
  label: 'New Node',
  description: '',
  apiName: '',
};