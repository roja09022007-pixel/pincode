export type VerificationStatus = 'VERIFIED' | 'NEEDS_REVIEW' | 'MISMATCH' | 'UNVERIFIED';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface AddressInput {
  fullName?: string;
  houseFlat?: string;
  streetLocality: string;
  city: string;
  district?: string;
  state: string;
  pinCode: string;
  rawAddress?: string;
}

export interface ParsedAddress {
  fullName?: string;
  houseFlat?: string;
  streetLocality: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  landmark?: string;
  confidenceScore: number;
}

export interface PostalOfficeRecord {
  officeName: string;
  pincode: string;
  officeType: 'B.O' | 'S.O' | 'H.O' | 'G.P.O'; // Branch Office, Sub Office, Head Office, General Post Office
  deliveryStatus: 'Delivery' | 'Non-Delivery';
  division: string;
  region: string;
  circle: string; // Postal Circle (e.g. Andhra Pradesh, Karnataka, Maharashtra)
  taluk: string;
  district: string;
  state: string;
  matchedLocalities?: string[];
}

export interface VerificationExplanation {
  summary: string;
  details: string[];
  recommendation?: string;
  postalMatchReason: string;
}

export interface VerificationResult {
  id: string;
  timestamp: string;
  status: VerificationStatus;
  confidence: ConfidenceLevel;
  confidenceReason: string;
  input: AddressInput;
  parsedAddress: ParsedAddress;
  matchedPostOffice?: PostalOfficeRecord;
  alternativePostOffices?: PostalOfficeRecord[];
  enteredPin: string;
  suggestedPin?: string;
  suggestedPostOffice?: string;
  mismatchType?: 'PIN_LOCALITY_MISMATCH' | 'DISTRICT_MISMATCH' | 'STATE_MISMATCH' | 'PIN_NOT_FOUND' | 'INCOMPLETE_DATA';
  explanation: VerificationExplanation;
  source: 'DEMO_DATASET' | 'N8N_WEBHOOK' | 'LIVE_POSTAL_API';
  processingTimeMs: number;
  stagesCompleted: number;
}

export interface VerificationStep {
  step: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  detail?: string;
}

export interface BulkVerificationRow {
  id: string;
  rawRow: Record<string, string>;
  name: string;
  house: string;
  street: string;
  locality: string;
  city: string;
  district: string;
  state: string;
  pin: string;
  status: VerificationStatus;
  matchedPostOffice?: string;
  matchedPin?: string;
  confidence?: ConfidenceLevel;
  reason?: string;
  error?: string;
}

export interface VerificationHistoryItem {
  id: string;
  timestamp: string;
  addressSummary: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  postOfficeName: string;
  status: VerificationStatus;
  confidence: ConfidenceLevel;
  result: VerificationResult;
}

export interface DashboardStats {
  total: number;
  verified: number;
  needsReview: number;
  mismatch: number;
  unverified: number;
  recentActivity: Array<{
    date: string;
    verified: number;
    needsReview: number;
    mismatch: number;
  }>;
}
