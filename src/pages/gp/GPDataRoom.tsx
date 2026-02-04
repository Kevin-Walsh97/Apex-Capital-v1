import { useState, useMemo } from 'react';
import {
  Filter,
  Folder,
  FolderOpen,
  FileText,
  Link as LinkIcon,
  Copy,
  Check,
  Shield,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useFundsForUser } from '../../hooks/useFundsForUser';
import type { DocumentType, FundDocument } from '../../types';
import { formatFileSize, formatDate } from '../../utils/format';

const CATEGORIES: DocumentType[] = [
  'PPM',
  'DDQ',
  'Track Record',
  'LPA',
  'Quarterly Letter',
  'Portfolio Update',
  'Other',
];

export default function GPDataRoom() {
  const pipeline = useStore((s) => s.pipeline);

  const gpFunds = useFundsForUser();

  const [selectedFundId, setSelectedFundId] = useState<string>(gpFunds[0]?.id ?? '');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(CATEGORIES)
  );
  const [copiedLink, setCopiedLink] = useState(false);

  // Track local access permission toggles
  const selectedFund = gpFunds.find((f) => f.id === selectedFundId);
  const documents = selectedFund?.documents ?? [];

  // Build a map of docId -> accessibleTo (local state for toggling)
  const [accessOverrides, setAccessOverrides] = useState<Record<string, string[]>>({});

  const getAccessList = (doc: FundDocument): string[] => {
    return accessOverrides[doc.id] ?? doc.accessibleTo;
  };

  // Unique LPs from pipeline for this GP
  const uniqueLPs = useMemo(() => {
    const fundIds = gpFunds.map((f) => f.id);
    const lpMap = new Map<string, { id: string; name: string; organization: string }>();
    pipeline
      .filter((p) => fundIds.includes(p.fundId))
      .forEach((p) => {
        if (!lpMap.has(p.lpId)) {
          lpMap.set(p.lpId, {
            id: p.lpId,
            name: p.lpName,
            organization: p.lpOrganization,
          });
        }
      });
    return Array.from(lpMap.values());
  }, [pipeline, gpFunds]);

  const documentsByCategory = useMemo(() => {
    const grouped: Record<string, FundDocument[]> = {};
    CATEGORIES.forEach((cat) => {
      grouped[cat] = [];
    });
    documents.forEach((doc) => {
      if (grouped[doc.fileType]) {
        grouped[doc.fileType].push(doc);
      } else {
        grouped['Other'].push(doc);
      }
    });
    return grouped;
  }, [documents]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const toggleAccess = (docId: string, lpId: string) => {
    setAccessOverrides((prev) => {
      const current = prev[docId] ?? documents.find((d) => d.id === docId)?.accessibleTo ?? [];
      const next = current.includes(lpId)
        ? current.filter((id) => id !== lpId)
        : [...current, lpId];
      return { ...prev, [docId]: next };
    });
  };

  const mockLink = `https://apex-capital.io/dataroom/${selectedFundId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mockLink).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const totalDocs = documents.length;
  const categoryCounts = CATEGORIES.map((cat) => ({
    category: cat,
    count: documentsByCategory[cat]?.length ?? 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Room</h1>
          <p className="mt-1 text-sm text-gray-500">
            Organize documents and manage LP access permissions.
          </p>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <select
            value={selectedFundId}
            onChange={(e) => {
              setSelectedFundId(e.target.value);
              setAccessOverrides({});
            }}
            className="rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-8 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {gpFunds.map((fund) => (
              <option key={fund.id} value={fund.id}>
                {fund.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Shareable Link */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <LinkIcon className="h-5 w-5 text-blue-600" />
          <h2 className="text-sm font-semibold text-gray-900">Shareable Data Room Link</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5">
            <code className="text-sm text-gray-700 break-all">{mockLink}</code>
          </div>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Category Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
          <p className="text-xs font-medium text-blue-600">Total</p>
          <p className="mt-1 text-xl font-bold text-blue-900">{totalDocs}</p>
        </div>
        {categoryCounts
          .filter((c) => c.count > 0)
          .map((c) => (
            <div
              key={c.category}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3"
            >
              <p className="text-xs font-medium text-gray-500">{c.category}</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{c.count}</p>
            </div>
          ))}
      </div>

      {/* Folder View with Access Permissions */}
      <div className="space-y-3">
        {CATEGORIES.map((category) => {
          const docs = documentsByCategory[category] ?? [];
          if (docs.length === 0) return null;

          const isExpanded = expandedCategories.has(category);

          return (
            <div
              key={category}
              className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
            >
              {/* Folder Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="flex w-full items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <FolderOpen className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Folder className="h-5 w-5 text-amber-500" />
                  )}
                  <span className="text-sm font-semibold text-gray-900">{category}</span>
                  <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {docs.length} {docs.length === 1 ? 'file' : 'files'}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </button>

              {/* Folder Content */}
              {isExpanded && (
                <div className="border-t border-gray-100">
                  {docs.map((doc) => {
                    const accessList = getAccessList(doc);
                    return (
                      <div
                        key={doc.id}
                        className="border-b border-gray-50 last:border-b-0 px-6 py-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          {/* Doc Info */}
                          <div className="flex items-center gap-3 min-w-0">
                            <FileText className="h-4 w-4 flex-shrink-0 text-blue-500" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {doc.fileName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(doc.fileSize)} &middot; v{doc.version} &middot;{' '}
                                {formatDate(doc.uploadedAt)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Access Permissions */}
                        <div className="mt-3 ml-7">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-xs font-medium text-gray-500">
                              LP Access Permissions
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {uniqueLPs.map((lp) => {
                              const hasAccess = accessList.includes(lp.id);
                              return (
                                <label
                                  key={lp.id}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={hasAccess}
                                    onChange={() => toggleAccess(doc.id, lp.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-xs text-gray-700">
                                    {lp.name}{' '}
                                    <span className="text-gray-400">({lp.organization})</span>
                                  </span>
                                </label>
                              );
                            })}
                            {uniqueLPs.length === 0 && (
                              <span className="text-xs text-gray-400">
                                No LPs in pipeline yet.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {documents.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Folder className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              No documents uploaded for this fund yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
