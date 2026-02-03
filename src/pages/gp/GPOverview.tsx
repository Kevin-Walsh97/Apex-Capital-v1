import { Link } from 'react-router-dom';
import {
  BarChart3,
  Users,
  DollarSign,
  FileText,
  Plus,
  Upload,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/format';

export default function GPOverview() {
  const { currentUser, pipeline } = useStore();
  const getFundsByGP = useStore((s) => s.getFundsByGP);

  const gpFunds = currentUser ? getFundsByGP(currentUser.id) : [];
  const gpPipeline = pipeline.filter((p) => gpFunds.some((f) => f.id === p.fundId));
  const allDocuments = gpFunds.flatMap((f) => f.documents);

  const totalCommitted = gpPipeline
    .filter((p) => p.status === 'Committed')
    .reduce((sum, p) => sum + p.allocationRequested, 0);

  const recentPipeline = [...gpPipeline]
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: 'Total Funds',
      value: gpFunds.length,
      icon: BarChart3,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Pipeline',
      value: gpPipeline.length,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Capital Committed',
      value: formatCurrency(totalCommitted),
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Active Documents',
      value: allDocuments.length,
      icon: FileText,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {currentUser?.name ?? 'GP'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here is an overview of your fundraising activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bg} rounded-lg p-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Pipeline Activity */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Pipeline Activity</h2>
            <Link
              to="/gp/pipeline"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentPipeline.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-gray-500">
                No pipeline activity yet.
              </div>
            ) : (
              recentPipeline.map((entry) => {
                const fund = gpFunds.find((f) => f.id === entry.fundId);
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {entry.lpName}
                          </p>
                          <p className="text-xs text-gray-500">{entry.lpOrganization}</p>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        {fund?.name ?? 'Unknown Fund'} &middot;{' '}
                        {formatCurrency(entry.allocationRequested)}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col items-end gap-1">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(entry.status)}`}
                      >
                        {entry.status}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {formatDate(entry.lastUpdated)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions & Fund Summary */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <div className="mt-4 space-y-3">
              <Link
                to="/gp/documents"
                className="flex w-full items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Upload className="h-5 w-5 text-blue-600" />
                Upload Document
              </Link>
              <Link
                to="/gp/pipeline"
                className="flex w-full items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-5 w-5 text-green-600" />
                Create Fund
              </Link>
              <Link
                to="/gp/analytics"
                className="flex w-full items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <TrendingUp className="h-5 w-5 text-purple-600" />
                View Analytics
              </Link>
            </div>
          </div>

          {/* Funds Summary */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Funds</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {gpFunds.map((fund) => {
                const pct = Math.round((fund.currentSize / fund.targetSize) * 100);
                return (
                  <div key={fund.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fund.name}
                      </p>
                      <span className="text-xs font-medium text-gray-500">{pct}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatCurrency(fund.currentSize)} / {formatCurrency(fund.targetSize)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
