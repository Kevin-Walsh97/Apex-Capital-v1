export type UserRole = 'GP' | 'LP';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  organization: string;
  createdAt: string;
}

export type FundStrategy = 'PE' | 'VC' | 'Credit' | 'Real Estate';
export type FundStatus = 'Open' | 'Closed' | 'Coming Soon';

export interface Fund {
  id: string;
  gpId: string;
  name: string;
  strategy: FundStrategy;
  targetSize: number;
  currentSize: number;
  minimumInvestment: number;
  geography: string;
  vintageYear: number;
  description: string;
  managementFee: string;
  carry: string;
  irr?: string;
  moic?: string;
  closingSchedule: {
    firstClose: string;
    interimClose?: string;
    finalClose: string;
  };
  status: FundStatus;
  documents: FundDocument[];
  teamSize: number;
  createdAt: string;
}

export type DocumentType = 'PPM' | 'DDQ' | 'Track Record' | 'LPA' | 'Quarterly Letter' | 'Portfolio Update' | 'Other';

export interface FundDocument {
  id: string;
  fundId: string;
  fileName: string;
  fileType: DocumentType;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: number;
  filePath: string;
  version: number;
  accessibleTo: string[];
  reviewed?: boolean;
  content?: string;
}

export type PipelineStatus = 'Inquired' | 'Under Review' | 'Soft Circle' | 'Committed' | 'Passed';

export interface LPInterest {
  id: string;
  fundId: string;
  lpId: string;
  gpId: string;
  lpName: string;
  lpOrganization: string;
  status: PipelineStatus;
  allocationRequested: number;
  notes: string;
  lastUpdated: string;
}

export interface QAEntry {
  id: string;
  fundId: string;
  lpId: string;
  question: string;
  answer: string;
  sources: Array<{
    documentId: string;
    documentName: string;
    pageNumber: number;
    excerpt: string;
  }>;
  confidence: number;
  timestamp: string;
}

export interface FundSummary {
  executiveBrief: string;
  keyTerms: {
    managementFee: string;
    carry: string;
    minimumInvestment: string;
    term: string;
    targetSize: string;
  };
  trackRecordHighlights: string[];
  riskFactors: string[];
}

export interface CalendarEvent {
  id: string;
  fundId: string;
  fundName: string;
  gpName: string;
  strategy: FundStrategy;
  geography: string;
  eventType: 'First Close' | 'Interim Close' | 'Final Close';
  date: string;
  targetSize: number;
}

export interface AnalyticsData {
  documentViews: Array<{
    documentName: string;
    views: number;
    uniqueViewers: number;
  }>;
  lpEngagement: Array<{
    lpName: string;
    timeSpent: number;
    questionsAsked: number;
    documentsViewed: number;
  }>;
  fundraisingProgress: {
    target: number;
    committed: number;
    softCircle: number;
    pipeline: number;
  };
  commonQuestions: Array<{
    question: string;
    frequency: number;
  }>;
  weeklyActivity: Array<{
    week: string;
    views: number;
    questions: number;
  }>;
}
