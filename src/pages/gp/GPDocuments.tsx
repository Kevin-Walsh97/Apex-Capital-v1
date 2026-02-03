import { useState, useMemo } from 'react';
import {
  Upload,
  X,
  Search,
  Filter,
  File,
  Eye,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { DocumentType } from '../../types';
import { formatDate, formatFileSize } from '../../utils/format';

const DOCUMENT_TYPES: DocumentType[] = [
  'PPM',
  'DDQ',
  'Track Record',
  'LPA',
  'Quarterly Letter',
  'Portfolio Update',
  'Other',
];

const CATEGORY_TABS = ['All', 'PPM', 'DDQ', 'Track Record', 'LPA', 'Other'] as const;

export default function GPDocuments() {
  const { currentUser } = useStore();
  const getFundsByGP = useStore((s) => s.getFundsByGP);
  const addDocument = useStore((s) => s.addDocument);

  const gpFunds = currentUser ? getFundsByGP(currentUser.id) : [];

  const [selectedFundId, setSelectedFundId] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Upload form state
  const [uploadFundId, setUploadFundId] = useState<string>(gpFunds[0]?.id ?? '');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileType, setUploadFileType] = useState<DocumentType>('PPM');

  const allDocuments = useMemo(() => {
    return gpFunds.flatMap((fund) =>
      fund.documents.map((doc) => ({
        ...doc,
        fundName: fund.name,
      }))
    );
  }, [gpFunds]);

  const filteredDocuments = useMemo(() => {
    let docs = allDocuments;

    if (selectedFundId !== 'all') {
      docs = docs.filter((d) => d.fundId === selectedFundId);
    }

    if (activeCategory !== 'All') {
      if (activeCategory === 'Other') {
        docs = docs.filter(
          (d) =>
            !['PPM', 'DDQ', 'Track Record', 'LPA'].includes(d.fileType)
        );
      } else {
        docs = docs.filter((d) => d.fileType === activeCategory);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.fileName.toLowerCase().includes(q) ||
          d.fileType.toLowerCase().includes(q) ||
          d.fundName.toLowerCase().includes(q)
      );
    }

    return docs;
  }, [allDocuments, selectedFundId, activeCategory, searchQuery]);

  const handleUpload = () => {
    if (!uploadFileName.trim() || !uploadFundId) return;

    addDocument({
      fundId: uploadFundId,
      fileName: uploadFileName.trim(),
      fileType: uploadFileType,
      uploadedBy: currentUser?.id ?? '',
      fileSize: Math.floor(Math.random() * 5000000) + 500000,
      filePath: `/documents/${uploadFileName.trim().replace(/\s+/g, '-').toLowerCase()}`,
      accessibleTo: [],
    });

    setUploadFileName('');
    setUploadFileType('PPM');
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and organize fund documents across your data rooms.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Upload Document
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Fund Selector */}
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

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-1">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveCategory(tab)}
            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Documents Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Fund
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Access
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    No documents found.
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-50 p-2">
                          <File className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {doc.fileName}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {doc.fileType}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {doc.fundName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(doc.uploadedAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatFileSize(doc.fileSize)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      v{doc.version}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Eye className="h-4 w-4" />
                        {doc.accessibleTo.length}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-lg rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              {/* Fund Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Fund</label>
                <select
                  value={uploadFundId}
                  onChange={(e) => setUploadFundId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {gpFunds.map((fund) => (
                    <option key={fund.id} value={fund.id}>
                      {fund.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Document Type
                </label>
                <select
                  value={uploadFileType}
                  onChange={(e) => setUploadFileType(e.target.value as DocumentType)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {DOCUMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">File Name</label>
                <input
                  type="text"
                  placeholder="e.g. Fund V - PPM.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Mock File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">File</label>
                <div className="mt-1 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 transition-colors hover:border-gray-400">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Drag and drop or click to select
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      PDF, DOCX, XLSX up to 50 MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowUploadModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!uploadFileName.trim()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
