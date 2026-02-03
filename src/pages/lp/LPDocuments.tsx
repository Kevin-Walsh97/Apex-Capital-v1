import { useState, useMemo } from 'react';
import {
  Search,
  FileText,
  Download,
  CheckCircle2,
  Circle,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { DocumentType, FundDocument } from '../../types';
import { formatDate, formatFileSize } from '../../utils/format';

type SortField = 'date' | 'name' | 'type';
type SortDirection = 'asc' | 'desc';

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

const typeColors: Record<string, string> = {
  PPM: 'bg-purple-100 text-purple-700',
  DDQ: 'bg-blue-100 text-blue-700',
  'Track Record': 'bg-green-100 text-green-700',
  LPA: 'bg-orange-100 text-orange-700',
  'Quarterly Letter': 'bg-cyan-100 text-cyan-700',
  'Portfolio Update': 'bg-pink-100 text-pink-700',
  Other: 'bg-gray-100 text-gray-700',
};

interface EnrichedDocument extends FundDocument {
  fundName: string;
}

export default function LPDocuments() {
  const { funds, currentUser } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [fundFilter, setFundFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'All'>('All');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [reviewedDocs, setReviewedDocs] = useState<Set<string>>(new Set());

  // Gather all documents accessible to current LP
  const allDocuments: EnrichedDocument[] = useMemo(() => {
    const docs: EnrichedDocument[] = [];
    funds.forEach((fund) => {
      fund.documents.forEach((doc) => {
        if (!currentUser || doc.accessibleTo.includes(currentUser.id)) {
          docs.push({ ...doc, fundName: fund.name });
        }
      });
    });
    return docs;
  }, [funds, currentUser]);

  const fundNames = useMemo(() => {
    const names = new Set(allDocuments.map((d) => d.fundName));
    return ['All', ...Array.from(names).sort()];
  }, [allDocuments]);

  const filteredAndSorted = useMemo(() => {
    let result = allDocuments;

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((doc) => doc.fileName.toLowerCase().includes(q));
    }

    // Fund filter
    if (fundFilter !== 'All') {
      result = result.filter((doc) => doc.fundName === fundFilter);
    }

    // Type filter
    if (typeFilter !== 'All') {
      result = result.filter((doc) => doc.fileType === typeFilter);
    }

    // Sort
    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'date':
          cmp = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
          break;
        case 'name':
          cmp = a.fileName.localeCompare(b.fileName);
          break;
        case 'type':
          cmp = a.fileType.localeCompare(b.fileType);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [allDocuments, searchQuery, fundFilter, typeFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Document Library</h1>
          <p className="mt-2 text-gray-600">
            Browse and review all fund documents available to you.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search document names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Fund</label>
            <select
              value={fundFilter}
              onChange={(e) => setFundFilter(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {fundNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as DocumentType | 'All')}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {documentTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <span className="ml-auto text-sm text-gray-500">
            {filteredAndSorted.length} document{filteredAndSorted.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {filteredAndSorted.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No documents found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => toggleSort('name')}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                      >
                        Document Name
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Fund
                    </th>
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => toggleSort('type')}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                      >
                        Type
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3">
                      <button
                        onClick={() => toggleSort('date')}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                      >
                        Date
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Reviewed
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAndSorted.map((doc) => {
                    const isReviewed = reviewedDocs.has(doc.id);
                    return (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-400 shrink-0" />
                            <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {doc.fileName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600 truncate max-w-[200px] block">
                            {doc.fundName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeColors[doc.fileType] || typeColors.Other}`}
                          >
                            {doc.fileType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(doc.uploadedAt)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatFileSize(doc.fileSize)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleReviewed(doc.id)}
                            className="inline-flex items-center justify-center"
                            title={isReviewed ? 'Mark as unreviewed' : 'Mark as reviewed'}
                          >
                            {isReviewed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-300 hover:text-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
