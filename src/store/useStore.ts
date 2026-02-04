import { create } from 'zustand';
import type { User, Fund, LPInterest, QAEntry, PipelineStatus, FundDocument } from '../types';
import { sampleUsers, sampleFunds, samplePipeline, sampleQAHistory } from '../data/sampleData';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string) => User | null;
  logout: () => void;

  // Funds
  funds: Fund[];
  addFund: (fund: Omit<Fund, 'id' | 'createdAt' | 'documents'>) => void;
  getFundById: (id: string) => Fund | undefined;
  getFundsByGP: (gpId: string) => Fund[];
  getFundsByFirm: (firmId: string) => Fund[];

  // Documents
  addDocument: (doc: Omit<FundDocument, 'id' | 'uploadedAt' | 'version'>) => void;
  getDocumentsByFund: (fundId: string) => FundDocument[];

  // Pipeline
  pipeline: LPInterest[];
  updatePipelineStatus: (id: string, status: PipelineStatus) => void;
  addPipelineEntry: (entry: Omit<LPInterest, 'id' | 'lastUpdated'>) => void;
  updatePipelineNotes: (id: string, notes: string) => void;
  getPipelineByFund: (fundId: string) => LPInterest[];
  getPipelineByLP: (lpId: string) => LPInterest[];

  // Q&A
  qaHistory: QAEntry[];
  addQAEntry: (entry: Omit<QAEntry, 'id' | 'timestamp'>) => void;
  getQAByFund: (fundId: string) => QAEntry[];
  getQAByLP: (lpId: string) => QAEntry[];

  // LP-specific
  savedFunds: string[];
  toggleSavedFund: (fundId: string) => void;
  watchingFunds: string[];
  toggleWatchingFund: (fundId: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,

  login: (email: string, password: string) => {
    const user = sampleUsers.find(u => u.email === email && u.password === password);
    if (user) {
      set({ currentUser: user });
      return user;
    }
    return null;
  },

  logout: () => set({ currentUser: null, savedFunds: [], watchingFunds: [] }),

  funds: sampleFunds,

  addFund: (fund) => {
    const newFund: Fund = {
      ...fund,
      id: uuidv4(),
      documents: [],
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ funds: [...state.funds, newFund] }));
  },

  getFundById: (id) => get().funds.find(f => f.id === id),

  getFundsByGP: (gpId) => get().funds.filter(f => f.gpId === gpId),

  getFundsByFirm: (firmId) => get().funds.filter(f => f.firmId === firmId),

  addDocument: (doc) => {
    const newDoc: FundDocument = {
      ...doc,
      id: uuidv4(),
      uploadedAt: new Date().toISOString(),
      version: 1,
    };
    set((state) => ({
      funds: state.funds.map(f =>
        f.id === doc.fundId ? { ...f, documents: [...f.documents, newDoc] } : f
      ),
    }));
  },

  getDocumentsByFund: (fundId) => {
    const fund = get().funds.find(f => f.id === fundId);
    return fund?.documents || [];
  },

  pipeline: samplePipeline,

  updatePipelineStatus: (id, status) =>
    set((state) => ({
      pipeline: state.pipeline.map(p =>
        p.id === id ? { ...p, status, lastUpdated: new Date().toISOString() } : p
      ),
    })),

  addPipelineEntry: (entry) => {
    const newEntry: LPInterest = {
      ...entry,
      id: uuidv4(),
      lastUpdated: new Date().toISOString(),
    };
    set((state) => ({ pipeline: [...state.pipeline, newEntry] }));
  },

  updatePipelineNotes: (id, notes) =>
    set((state) => ({
      pipeline: state.pipeline.map(p =>
        p.id === id ? { ...p, notes, lastUpdated: new Date().toISOString() } : p
      ),
    })),

  getPipelineByFund: (fundId) => get().pipeline.filter(p => p.fundId === fundId),
  getPipelineByLP: (lpId) => get().pipeline.filter(p => p.lpId === lpId),

  qaHistory: sampleQAHistory,

  addQAEntry: (entry) => {
    const newEntry: QAEntry = {
      ...entry,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ qaHistory: [...state.qaHistory, newEntry] }));
  },

  getQAByFund: (fundId) => get().qaHistory.filter(q => q.fundId === fundId),
  getQAByLP: (lpId) => get().qaHistory.filter(q => q.lpId === lpId),

  savedFunds: [],
  toggleSavedFund: (fundId) =>
    set((state) => ({
      savedFunds: state.savedFunds.includes(fundId)
        ? state.savedFunds.filter(id => id !== fundId)
        : [...state.savedFunds, fundId],
    })),

  watchingFunds: [],
  toggleWatchingFund: (fundId) =>
    set((state) => ({
      watchingFunds: state.watchingFunds.includes(fundId)
        ? state.watchingFunds.filter(id => id !== fundId)
        : [...state.watchingFunds, fundId],
    })),
}));
