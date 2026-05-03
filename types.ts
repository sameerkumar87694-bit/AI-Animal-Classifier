// Fix: Removed self-import which caused a conflict with the local 'Trait' declaration.
export interface Trait {
  name: string;
  score: number;
  description: string;
}

export interface AnalysisReport {
  breed: string;
  overall_score: number;
  longevity_prediction: string;
  productivity_prediction:string;
  reproductive_efficiency: string;
  traits: Trait[];
  recommendations: string;
}

export interface AnalysisReportWithMeta extends AnalysisReport {
  id: number;
  timestamp: string;
  imageDataUrl: string;
}

export interface User {
  email: string;
  // These fields are part of the full user record, but not the session user object
  password?: string;
  isVerified?: boolean;
  verificationCode?: string;
  resetCode?: string;
  resetCodeExpiry?: number;
}
