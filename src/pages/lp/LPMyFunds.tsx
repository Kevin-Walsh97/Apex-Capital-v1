import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Search,
  FileText,
  MessageSquare,
  ExternalLink,
  Inbox,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatCurrency, getStrategyColor, getStatusColor } from '../../utils/format';

export default function LPMyFunds() {
  const { funds, savedFunds, currentUser, pipeline } = useStore();

  const saved = useMemo(
    () => funds.filter((f) => savedFunds.includes(f.id)),
    [funds, savedFunds]
  );

  const myPipeline = useMemo(
    () => (currentUser ? pipeline.filter((p) => p.lpId === currentUser.id) : []),
    [pipeline, currentUser]
  );

  // Combine pipeline info with fund info
  const pipelineFunds = useMemo(() => {
    return myPipeline.map((entry) => {
      const fund = funds.find((f) => f.id === entry.fundId);
      return { entry, fund };
    });
  }, [myPipeline, funds]);

  if (saved.length === 0 && pipelineFunds.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Funds</h1>
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <Inbox className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No saved funds yet</h3>
            <p className="text-gray-500 mt-2 mb-6">
              Explore funds and save the ones you are interested in.
            </p>
            <Link
              to="/lp/discover"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Search className="h-4 w-4" />
              Discover Funds
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Funds</h1>
          <p className="mt-2 text-gray-600">
            Manage your saved funds and track your pipeline status.
          </p>
        </div>

        {/* Saved Funds Section */}
        {saved.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                Saved Funds ({saved.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {saved.map((fund) => {
                const pipeEntry = myPipeline.find((p) => p.fundId === fund.id);
                return (
                  <div
                    key={fund.id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStrategyColor(fund.strategy)}`}
                        >
                          {fund.strategy}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fund.status)}`}
                        >
                          {fund.status}
                        </span>
                      </div>
                      {pipeEntry && (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pipeEntry.status)}`}
                        >
                          {pipeEntry.status}
                        </span>
                      )}
                    </div>

                    <Link to={`/lp/funds/${fund.id}`} className="group">
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {fund.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                        {formatCurrency(fund.targetSize)}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5 text-gray-400" />
                        {fund.irr || 'N/A'}
                      </span>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                      <Link
                        to={`/lp/funds/${fund.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Details
                      </Link>
                      <Link
                        to={`/lp/funds/${fund.id}`}
                        state={{ tab: 'qa' }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                      >
                        <MessageSquare className="h-3 w-3" />
                        Q&A
                      </Link>
                      <Link
                        to={`/lp/funds/${fund.id}`}
                        state={{ tab: 'documents' }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-medium hover:bg-purple-100 transition-colors"
                      >
                        <FileText className="h-3 w-3" />
                        Docs
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Pipeline Status Section */}
        {pipelineFunds.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                Pipeline Status ({pipelineFunds.length})
              </h2>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Fund
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Strategy
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Allocation Requested
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pipelineFunds.map(({ entry, fund }) => (
                      <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <Link
                            to={`/lp/funds/${entry.fundId}`}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {fund?.name || 'Unknown Fund'}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          {fund && (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStrategyColor(fund.strategy)}`}
                            >
                              {fund.strategy}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}
                          >
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {entry.allocationRequested > 0
                            ? formatCurrency(entry.allocationRequested)
                            : '--'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {entry.notes}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/lp/funds/${entry.fundId}`}
                              className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View
                            </Link>
                            <Link
                              to={`/lp/funds/${entry.fundId}`}
                              state={{ tab: 'qa' }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                            >
                              <MessageSquare className="h-3 w-3" />
                              Q&A
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
