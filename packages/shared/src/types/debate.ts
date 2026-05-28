export interface Argument {
  agent: "BULL" | "BEAR";
  trade_id: string;
  thesis: string;
  evidence: string[];
  confidence: number;
  target?: number;
  risks?: string[];
  worst_case?: number;
}

export interface Verdict {
  id: string;
  trade_id: string;
  action: "APPROVE" | "REJECT" | "MODIFY";
  modifications?: {
    size?: number;
    stoploss?: number;
    target?: number;
  };
  reasoning: string;
  confidence: number;
  timestamp: number;
}
