import { useState, useMemo } from 'react';
import {
  Filter,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Clock,
  Save,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useFundsForUser } from '../../hooks/useFundsForUser';
import type { PipelineStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';

const PIPELINE_COLUMNS: PipelineStatus[] = [
  'Inquired',
  'Under Review',
  'Soft Circle',
  'Committed',
  'Passed',
];

const COLUMN_COLORS: Record<PipelineStatus, string> = {
  Inquired: 'border-t-gray-400',
  'Under Review': 'border-t-blue-500',
  'Soft Circle': 'border-t-yellow-500',
  Committed: 'border-t-green-500',
  Passed: 'border-t-red-400',
};

const COLUMN_HEADER_BG: Record<PipelineStatus, string> = {
  Inquired: 'bg-gray-50',
  'Under Review': 'bg-blue-50',
  'Soft Circle': 'bg-yellow-50',
  Committed: 'bg-green-50',
  Passed: 'bg-red-50',
};

export default function GPPipeline() {
  const pipeline = useStore((s) => s.pipeline);
  const updatePipelineStatus = useStore((s) => s.updatePipelineStatus);
  const updatePipelineNotes = useStore((s) => s.updatePipelineNotes);

  const gpFunds = useFundsForUser();

  const [selectedFundId, setSelectedFundId] = useState<string>('all');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  const filteredPipeline = useMemo(() => {
    const fundIds = gpFunds.map((f) => f.id);
    let entries = pipeline.filter((p) => fundIds.includes(p.fundId));
    if (selectedFundId !== 'all') {
      entries = entries.filter((p) => p.fundId === selectedFundId);
    }
    return entries;
  }, [pipeline, gpFunds, selectedFundId]);

  const statusCounts = useMemo(() => {
    const counts: Record<PipelineStatus, number> = {
      Inquired: 0,
      'Under Review': 0,
      'Soft Circle': 0,
      Committed: 0,
      Passed: 0,
    };
    filteredPipeline.forEach((p) => {
      counts[p.status]++;
    });
    return counts;
  }, [filteredPipeline]);

  const totalCommitted = filteredPipeline
    .filter((p) => p.status === 'Committed')
    .reduce((sum, p) => sum + p.allocationRequested, 0);

  const totalPipelineValue = filteredPipeline
    .filter((p) => p.status !== 'Passed')
    .reduce((sum, p) => sum + p.allocationRequested, 0);

  const handleStatusChange = (id: string, newStatus: PipelineStatus) => {
    updatePipelineStatus(id, newStatus);
  };

  const handleSaveNotes = (id: string) => {
    if (editingNotes[id] !== undefined) {
      updatePipelineNotes(id, editingNotes[id]);
      setEditingNotes((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const toggleExpand = (id: string, currentNotes: string) => {
    if (expandedCardId === id) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(id);
      setEditingNotes((prev) => ({ ...prev, [id]: currentNotes }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fundraising Pipeline</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage LP interest across your funds.
          </p>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <select
            value={selectedFundId}
            onChange={(e) => setSelectedFundId(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-8 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Funds</option>
            {gpFunds.map((fund) => (
              <option key={fund.id} value={fund.id}>
                {fund.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {PIPELINE_COLUMNS.map((status) => (
          <div
            key={status}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
          >
            <p className="text-xs font-medium text-gray-500">{status}</p>
            <p className="mt-1 text-xl font-bold text-gray-900">{statusCounts[status]}</p>
          </div>
        ))}
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Committed Capital</p>
          <p className="mt-1 text-xl font-bold text-green-600">
            {formatCurrency(totalCommitted)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total Pipeline</p>
          <p className="mt-1 text-xl font-bold text-blue-600">
            {formatCurrency(totalPipelineValue)}
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {PIPELINE_COLUMNS.map((status) => {
          const cards = filteredPipeline.filter((p) => p.status === status);
          return (
            <div key={status} className="flex flex-col">
              {/* Column Header */}
              <div
                className={`rounded-t-lg border-t-4 ${COLUMN_COLORS[status]} ${COLUMN_HEADER_BG[status]} px-4 py-3`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">{status}</h3>
                  <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-xs font-medium text-gray-600 shadow-sm">
                    {cards.length}
                  </span>
                </div>
              </div>

              {/* Column Body */}
              <div className="flex-1 space-y-3 rounded-b-lg border border-t-0 border-gray-200 bg-gray-50/50 p-3 min-h-[200px]">
                {cards.length === 0 ? (
                  <p className="py-8 text-center text-xs text-gray-400">No entries</p>
                ) : (
                  cards.map((entry) => {
                    const fund = gpFunds.find((f) => f.id === entry.fundId);
                    const isExpanded = expandedCardId === entry.id;

                    return (
                      <div
                        key={entry.id}
                        className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                      >
                        {/* Card Header */}
                        <div
                          className="cursor-pointer px-4 py-3"
                          onClick={() => toggleExpand(entry.id, entry.notes)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {entry.lpName}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {entry.lpOrganization}
                              </p>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 flex-shrink-0 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400" />
                            )}
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <DollarSign className="h-3 w-3 text-gray-400" />
                            <span className="text-xs font-medium text-gray-700">
                              {formatCurrency(entry.allocationRequested)}
                            </span>
                          </div>

                          {fund && (
                            <p className="mt-1 text-xs text-gray-400 truncate">
                              {fund.name}
                            </p>
                          )}

                          <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3" />
                            {formatDate(entry.lastUpdated)}
                          </div>
                        </div>

                        {/* Expanded Section */}
                        {isExpanded && (
                          <div className="border-t border-gray-100 px-4 py-3 space-y-3">
                            {/* Status Dropdown */}
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Status
                              </label>
                              <select
                                value={entry.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    entry.id,
                                    e.target.value as PipelineStatus
                                  )
                                }
                                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                {PIPELINE_COLUMNS.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Notes */}
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Notes
                              </label>
                              <textarea
                                value={editingNotes[entry.id] ?? entry.notes}
                                onChange={(e) =>
                                  setEditingNotes((prev) => ({
                                    ...prev,
                                    [entry.id]: e.target.value,
                                  }))
                                }
                                rows={3}
                                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                              />
                              <button
                                onClick={() => handleSaveNotes(entry.id)}
                                className="mt-1 inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                              >
                                <Save className="h-3 w-3" />
                                Save
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
