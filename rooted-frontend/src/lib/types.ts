export type RiskLevel = "Low" | "Medium" | "High";

export interface User {
  username: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface Goal {
  id: string;
  username: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface HistoryEntry {
  id: string;
  username: string;
  date: string;
  risk_level: RiskLevel;
  impact_score: number;
  ai_consult: string;
}

export interface DiagnosisPayload {
  age: number;
  gender: number;
  relationship: number;
  occupation: number;
  org_type: number;
  platforms: number;
  usage_hours: number;
  purposeless: number;
  distracted: number;
  restless: number;
  concentration: number;
  focus_issue: number;
  comparison: number;
  comparison_feelings: number;
  validation: number;
  interest_fluctuation: number;
}

export interface DiagnosisResult {
  status: string;
  ml_results: {
    predicted_risk: RiskLevel;
    overall_score: number;
    probabilities: Record<string, number>;
  };
  ai_consultation: string;
}

export interface ChatMessagePayload {
  message: string;
  language?: string;
}

export interface ChatReply {
  response: string;
}
