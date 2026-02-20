
export type Industry = 
  | "Solar Energy (B2C)" 
  | "SaaS - Cybersecurity (B2B)" 
  | "Insurance - Medicare/Life (B2C)" 
  | "Marketing Agency (B2B)" 
  | "Medical Logistics (B2B)" 
  | "Commercial HVAC (B2B)";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface VoiceSettings {
  pitch: "Deep" | "Balanced" | "High";
  speed: "Slow" | "Normal" | "Fast";
  accent: "Neutral" | "Southern US" | "New York" | "Midwestern";
}

export interface Lead {
  id: string;
  name: string;
  industry: Industry;
  persona: string;
  context: string;
  difficulty: Difficulty;
  gatekeeper?: boolean;
}

export interface GameState {
  step: "setup" | "dossier" | "roleplay" | "coaching";
  setupView: "industry" | "leads";
  selectedIndustry: Industry | null;
  userIndustry: Industry | null;
  difficulty: Difficulty;
  currentLead: Lead | null;
  voiceSettings: VoiceSettings;
  messages: Message[];
  finalEvaluation?: string;
  isCallEnded: boolean;
}

export interface Message {
  role: "user" | "model";
  content: string;
}

export interface EvaluationScore {
  score: number;
  patternInterrupt: string;
  videoAlignment: string;
  objectionHandling: string;
  theClose: string;
}
