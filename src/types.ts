export type DialecticStyle = 'chola' | 'malandra' | 'fresa';

export interface DialecticalState {
  thesis: string;
  thesisSources?: { uri: string; title?: string }[];
  antithesis: string;
  synthesis: string;
  energySignature?: string;
  feedback?: 'liked' | 'disliked';
}

export interface ProcessingStatus {
  step: 'idle' | 'analyzing_thesis' | 'analyzing_antithesis' | 'synthesizing' | 'disrupting' | 'complete' | 'error';
  message?: string;
}

export interface CapabilityStatus {
  languageModel: 'local' | 'cloud' | 'unavailable';
  summarizer: 'local' | 'cloud' | 'unavailable';
}

export interface DisruptionResult {
  original: string;
  disrupted: string;
  level: number;
}

export interface PromptHistory {
  id: string;
  timestamp: string;
  input: string;
  result: DialecticalState;
  styles: {
    thesis: DialecticStyle;
    antithesis: DialecticStyle;
  };
}
