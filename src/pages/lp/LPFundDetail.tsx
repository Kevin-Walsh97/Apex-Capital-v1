import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  BarChart3,
  Info,
  Download,
  CheckCircle2,
  Circle,
  Send,
  Loader2,
  BookOpen,
  Shield,
  AlertTriangle,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Percent,
  Building,
  Target,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { FundDocument, DocumentType } from '../../types';
import { formatCurrency, formatDate, formatFileSize, getStrategyColor, getConfidenceLabel } from '../../utils/format';
import { sampleSummaries } from '../../data/sampleData';

type TabId = 'overview' | 'documents' | 'qa' | 'summary';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: <Info className="h-4 w-4" /> },
  { id: 'documents', label: 'Documents', icon: <FileText className="h-4 w-4" /> },
  { id: 'qa', label: 'Q&A', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'summary', label: 'Summary', icon: <BarChart3 className="h-4 w-4" /> },
];

const documentTypes: Array<DocumentType | 'All'> = [
  'All',
  'PPM',
  'DDQ',
  'Track Record',
  'LPA',
  'Quarterly Letter',
  'Portfolio Update',
  'Other',
];

export default function LPFundDetail() {
  const { fundId } = useParams<{ fundId: string }>();
  const { getFundById, currentUser, qaHistory, addQAEntry, getQAByFund } = useStore();

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [docCategoryFilter, setDocCategoryFilter] = useState<DocumentType | 'All'>('All');
  const [reviewedDocs, setReviewedDocs] = useState<Set<string>>(new Set());
  const [qaInput, setQaInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const qaEndRef = useRef<HTMLDivElement>(null);

  const fund = fundId ? getFundById(fundId) : undefined;
  const fundQA = fundId ? getQAByFund(fundId) : [];
  const myQA = fundQA.filter((q) => q.lpId === currentUser?.id);
  const summary = fundId ? sampleSummaries[fundId] : undefined;

  useEffect(() => {
    qaEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [myQA.length]);

  if (!fund) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Fund not found</h2>
          <Link to="/lp/discover" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  const accessibleDocs = fund.documents.filter(
    (doc) => !currentUser || doc.accessibleTo.includes(currentUser.id)
  );

  const filteredDocs =
    docCategoryFilter === 'All'
      ? accessibleDocs
      : accessibleDocs.filter((doc) => doc.fileType === docCategoryFilter);

  const toggleReviewed = (docId: string) => {
    setReviewedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) {
        next.delete(docId);
      } else {
        next.add(docId);
      }
      return next;
    });
  };

  const handleAskQuestion = () => {
    if (!qaInput.trim() || !currentUser || !fundId) return;

    const question = qaInput.trim();
    setQaInput('');
    setIsLoading(true);

    // Search fund documents for relevant content
    const relevantDoc = fund.documents.find(
      (doc) =>
        doc.content &&
        doc.content.toLowerCase().includes(question.toLowerCase().split(' ').slice(0, 3).join(' '))
    );

    const fallbackDoc = fund.documents.find((doc) => doc.content);

    const sourceDoc = relevantDoc || fallbackDoc;
    const docContent = sourceDoc?.content || '';

    // Generate mock answer based on document content
    const sentences = docContent.split('.').filter((s) => s.trim().length > 20);
    const relevantSentences = sentences
      .filter((s) => {
        const words = question.toLowerCase().split(' ');
        return words.some((w) => w.length > 3 && s.toLowerCase().includes(w));
      })
      .slice(0, 3);

    const answerText =
      relevantSentences.length > 0
        ? relevantSentences.map((s) => s.trim()).join('. ') + '.'
        : `Based on the fund documentation, ${fund.name} ${sentences.slice(0, 2).map((s) => s.trim()).join('. ')}. Please refer to the attached documents for complete details.`;

    const confidence = 0.85 + Math.random() * 0.12; // 0.85-0.97

    setTimeout(() => {
      addQAEntry({
        fundId,
        lpId: currentUser.id,
        question,
        answer: answerText,
        sources: sourceDoc
          ? [
              {
                documentId: sourceDoc.id,
                documentName: sourceDoc.fileName,
                pageNumber: Math.floor(Math.random() * 12) + 1,
                excerpt:
                  relevantSentences[0]?.trim().slice(0, 200) ||
                  sentences[0]?.trim().slice(0, 200) ||
                  'See full document for details.',
              },
            ]
          : [],
        confidence: parseFloat(confidence.toFixed(2)),
      });
      setIsLoading(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/lp/discover"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Discover
        </Link>

        {/* Fund Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{fund.name}</h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStrategyColor(fund.strategy)}`}
                >
                  {fund.strategy}
                </span>
              </div>
              <p className="text-gray-600">{fund.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Vintage {fund.vintageYear}</span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${fund.status === 'Open' ? 'bg-green-100 text-green-700' : fund.status === 'Closed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}
              >
                {fund.status}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <nav className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="p-6">
            {/* ========== OVERVIEW TAB ========== */}
            {activeTab === 'overview' && (
              <div>
                {/* Key Metrics Grid */}
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <MetricCard
                    icon={<Target className="h-5 w-5 text-blue-500" />}
                    label="Target Size"
                    value={formatCurrency(fund.targetSize)}
                  />
                  <MetricCard
                    icon={<DollarSign className="h-5 w-5 text-green-500" />}
                    label="Min Investment"
                    value={formatCurrency(fund.minimumInvestment)}
                  />
                  <MetricCard
                    icon={<Percent className="h-5 w-5 text-purple-500" />}
                    label="Management Fee"
                    value={fund.managementFee}
                  />
                  <MetricCard
                    icon={<Percent className="h-5 w-5 text-orange-500" />}
                    label="Carry"
                    value={fund.carry}
                  />
                  <MetricCard
                    icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
                    label="Historical IRR"
                    value={fund.irr || 'N/A'}
                  />
                  <MetricCard
                    icon={<BarChart3 className="h-5 w-5 text-indigo-500" />}
                    label="Historical MOIC"
                    value={fund.moic || 'N/A'}
                  />
                  <MetricCard
                    icon={<Users className="h-5 w-5 text-cyan-500" />}
                    label="Team Size"
                    value={`${fund.teamSize} professionals`}
                  />
                  <MetricCard
                    icon={<Calendar className="h-5 w-5 text-rose-500" />}
                    label="Vintage Year"
                    value={String(fund.vintageYear)}
                  />
                </div>

                {/* Closing Schedule Timeline */}
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Closing Schedule</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="relative flex items-center justify-between">
                    {/* Timeline line */}
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300" />

                    {/* First Close */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mb-2">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">First Close</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(fund.closingSchedule.firstClose)}
                      </span>
                    </div>

                    {/* Interim Close */}
                    {fund.closingSchedule.interimClose && (
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mb-2">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Interim Close</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(fund.closingSchedule.interimClose)}
                        </span>
                      </div>
                    )}

                    {/* Final Close */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center mb-2">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Final Close</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(fund.closingSchedule.finalClose)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========== DOCUMENTS TAB ========== */}
            {activeTab === 'documents' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Fund Documents</h2>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Category</label>
                    <select
                      value={docCategoryFilter}
                      onChange={(e) =>
                        setDocCategoryFilter(e.target.value as DocumentType | 'All')
                      }
                      className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {documentTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {filteredDocs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <p>No documents available in this category.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredDocs.map((doc) => (
                      <DocumentRow
                        key={doc.id}
                        doc={doc}
                        reviewed={reviewedDocs.has(doc.id)}
                        onToggleReviewed={() => toggleReviewed(doc.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========== Q&A TAB ========== */}
            {activeTab === 'qa' && (
              <div className="flex flex-col h-[600px]">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Ask Questions About This Fund
                </h2>

                {/* Q&A History */}
                <div className="flex-1 overflow-y-auto space-y-6 mb-4 pr-2">
                  {myQA.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-gray-500">
                      <MessageSquare className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">No questions yet</p>
                      <p className="text-sm mt-1">
                        Ask a question about {fund.name} and get AI-powered answers sourced from
                        fund documents.
                      </p>
                    </div>
                  )}

                  {myQA.map((entry) => {
                    const conf = getConfidenceLabel(entry.confidence);
                    return (
                      <div key={entry.id} className="space-y-3">
                        {/* Question */}
                        <div className="flex justify-end">
                          <div className="bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-[75%]">
                            <p className="text-sm">{entry.question}</p>
                          </div>
                        </div>

                        {/* Answer */}
                        <div className="flex justify-start">
                          <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                            <p className="text-sm text-gray-800">{entry.answer}</p>

                            {/* Sources */}
                            {entry.sources.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs font-medium text-gray-500 mb-2">Sources</p>
                                {entry.sources.map((source, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-white rounded-lg p-2.5 mb-2 border border-gray-200"
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <FileText className="h-3.5 w-3.5 text-blue-500" />
                                      <span className="text-xs font-medium text-gray-700">
                                        {source.documentName}
                                      </span>
                                      <span className="text-xs text-gray-400">
                                        p. {source.pageNumber}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500 italic line-clamp-2">
                                      "{source.excerpt}"
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Confidence Badge */}
                            <div className="mt-2 flex items-center gap-2">
                              <Shield className="h-3.5 w-3.5 text-gray-400" />
                              <span className={`text-xs font-medium ${conf.color}`}>
                                Confidence: {conf.label} ({(entry.confidence * 100).toFixed(0)}%)
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatDate(entry.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Loading State */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Searching fund documents...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={qaEndRef} />
                </div>

                {/* Input Field */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={qaInput}
                      onChange={(e) => setQaInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                      placeholder="Ask a question about this fund..."
                      disabled={isLoading}
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <button
                      onClick={handleAskQuestion}
                      disabled={isLoading || !qaInput.trim()}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========== SUMMARY TAB ========== */}
            {activeTab === 'summary' && (
              <div>
                {!summary ? (
                  <div className="text-center py-12 text-gray-500">
                    <BarChart3 className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <p>No AI summary available for this fund yet.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Executive Brief */}
                    <section>
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Executive Brief</h2>
                      </div>
                      <p className="text-gray-700 leading-relaxed bg-blue-50 rounded-lg p-4 border border-blue-100">
                        {summary.executiveBrief}
                      </p>
                    </section>

                    {/* Key Terms Table */}
                    <section>
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Key Terms</h2>
                      </div>
                      <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="w-full">
                          <tbody className="divide-y divide-gray-200">
                            {Object.entries(summary.keyTerms).map(([key, value]) => (
                              <tr key={key} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50 w-48 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">{value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>

                    {/* Track Record Highlights */}
                    <section>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                          Track Record Highlights
                        </h2>
                      </div>
                      <ul className="space-y-2">
                        {summary.trackRecordHighlights.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100"
                          >
                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    {/* Risk Factors */}
                    <section>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Risk Factors</h2>
                      </div>
                      <ul className="space-y-2">
                        {summary.riskFactors.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100"
                          >
                            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ Sub-components ============ */

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function DocumentRow({
  doc,
  reviewed,
  onToggleReviewed,
}: {
  doc: FundDocument;
  reviewed: boolean;
  onToggleReviewed: () => void;
}) {
  const typeColors: Record<string, string> = {
    PPM: 'bg-purple-100 text-purple-700',
    DDQ: 'bg-blue-100 text-blue-700',
    'Track Record': 'bg-green-100 text-green-700',
    LPA: 'bg-orange-100 text-orange-700',
    'Quarterly Letter': 'bg-cyan-100 text-cyan-700',
    'Portfolio Update': 'bg-pink-100 text-pink-700',
    Other: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <FileText className="h-8 w-8 text-gray-400 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</p>
          <div className="flex items-center gap-3 mt-1">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeColors[doc.fileType] || typeColors.Other}`}
            >
              {doc.fileType}
            </span>
            <span className="text-xs text-gray-500">{formatDate(doc.uploadedAt)}</span>
            <span className="text-xs text-gray-500">{formatFileSize(doc.fileSize)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleReviewed}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            reviewed
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {reviewed ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <Circle className="h-3.5 w-3.5" />
          )}
          {reviewed ? 'Reviewed' : 'Mark Reviewed'}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
          <Download className="h-3.5 w-3.5" />
          Download
        </button>
      </div>
    </div>
  );
}
