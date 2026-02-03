
export enum AppMode {
  FIELD = 'FIELD',
  LAB = 'LAB'
}

export enum UserTier {
  STUDENT = 'STUDENT',
  RESEARCHER = 'RESEARCHER'
}

export type BasinContext = 'GLOBAL' | 'FLOOR' | 'SWAT' | 'HUNZA' | 'ISLOT' | 'SOAN';

export interface AnalysisResult {
  identification: string;
  confidence: number;
  type: string; // Igneous, Sedimentary, Metamorphic
  mineralogy: string[];
  texture: string;
  provenance?: {
    rounding: string;
    transportDistance: string;
    basinSource: string;
  };
  physicalProperties: {
    hardness: string;
    specificGravity: string;
    grainSize: string;
  };
  geologicalAge: string;
  stratigraphicContext?: string;
  educationalNote?: string;
  professionalInsight?: string;
  isFossil: boolean;
  fossilAuthenticity?: number;
}

export interface StratigraphyEntry {
  id: string;
  timestamp: string;
  unit: string;
  thickness: string;
  lithology: string;
  notes: string;
}
