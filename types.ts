import { Node, Edge } from 'reactflow';

export enum NodeType {
  VARIABLE = 'VARIABLE',
  LOGIC = 'LOGIC',
  LWC = 'LWC',
  EXPERIENCE = 'EXPERIENCE',
  CLOUD = 'CLOUD',
  INTEGRATION = 'INTEGRATION',
  CUSTOM = 'CUSTOM'
}

export enum NodeSubtype {
  // Variables
  VAR_PRIMITIVE = 'VAR_PRIMITIVE',
  VAR_COLLECTION = 'VAR_COLLECTION',
  VAR_SOBJECT = 'VAR_SOBJECT',
  
  // Logic
  LOGIC_ASSIGNMENT = 'LOGIC_ASSIGNMENT',
  LOGIC_IF = 'LOGIC_IF',
  LOGIC_LOOP = 'LOGIC_LOOP',
  LOGIC_SOQL = 'LOGIC_SOQL',
  LOGIC_DML = 'LOGIC_DML',
  LOGIC_TRY_CATCH = 'LOGIC_TRY_CATCH',
  LOGIC_METHOD = 'LOGIC_METHOD',
  LOGIC_TRIGGER = 'LOGIC_TRIGGER',
  LOGIC_ASYNC = 'LOGIC_ASYNC',

  // LWC
  LWC_COMPONENT = 'LWC_COMPONENT',
  LWC_EVENT_EMIT = 'LWC_EVENT_EMIT',
  LWC_EVENT_HANDLE = 'LWC_EVENT_HANDLE',
  LWC_WIRE = 'LWC_WIRE',
  LWC_IMPERATIVE = 'LWC_IMPERATIVE',

  // Experience
  EXP_PAGE = 'EXP_PAGE',
  EXP_ACCESS = 'EXP_ACCESS',

  // Integrations
  INT_REST = 'INT_REST',
  INT_SOAP = 'INT_SOAP',
  INT_PLATFORM_EVENT = 'INT_PLATFORM_EVENT',

  // Clouds
  CLOUD_SALES = 'CLOUD_SALES',
  CLOUD_SERVICE = 'CLOUD_SERVICE',
  
  // Custom
  CUSTOM_GENERIC = 'CUSTOM_GENERIC'
}

export interface NodeProperties {
  label: string;
  description?: string;
  apiName?: string;
  dataType?: string; // For variables
  objectType?: string; // For SObject, DML, SOQL
  query?: string; // For SOQL
  condition?: string; // For If/Else
  methodName?: string; // For Method
  triggerEvents?: string[]; // For Trigger
  endpoint?: string; // For Integrations
  [key: string]: any;
}

export interface AppNodeData {
  type: NodeType;
  subtype: NodeSubtype;
  properties: NodeProperties;
  icon?: string; // Lucide icon name
}

export type AppNode = Node<AppNodeData>;
export type AppEdge = Edge;

export interface ProjectData {
  name: string;
  nodes: AppNode[];
  edges: AppEdge[];
}