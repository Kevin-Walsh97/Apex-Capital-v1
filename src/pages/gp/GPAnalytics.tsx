import {
  Clock,
  MessageSquare,
  FileText,
} from 'lucide-react';
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { sampleAnalytics } from '../../data/sampleData';
import { formatCurrency } from '../../utils/format';

export default function GPAnalytics() {
  const { fundraisingProgress, weeklyActivity, documentViews, lpEngagement, commonQuestions } =
    sampleAnalytics;

  const progressPct = (val: number) =>
    Math.round((val / fundraisingProgress.target) * 100);

  const progressBars = [
    {
      label: 'Committed',
      value: fundraisingProgress.committed,
      pct: progressPct(fundraisingProgress.committed),
      color: 'bg-green-500',
    },
    {
      label: 'Soft Circle',
      value: fundraisingProgress.softCircle,
      pct: progressPct(fundraisingProgress.softCircle),
      color: 'bg-yellow-500',
    },
    {
      label: 'Pipeline',
      value: fundraisingProgress.pipeline,
      pct: progressPct(fundraisingProgress.pipeline),
      color: 'bg-blue-500',
    },
  ];

  const totalRaised =
    fundraisingProgress.committed +
    fundraisingProgress.softCircle +
    fundraisingProgress.pipeline;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track LP engagement, fundraising progress, and data room activity.
        </p>
      </div>

      {/* Fundraising Progress */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Fundraising Progress</h2>
          <span className="text-sm text-gray-500">
            Target: {formatCurrency(fundraisingProgress.target)}
          </span>
        </div>

        {/* Overall progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Overall</span>
            <span className="text-sm text-gray-500">
              {formatCurrency(totalRaised)} / {formatCurrency(fundraisingProgress.target)} (
              {progressPct(totalRaised)}%)
            </span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="flex h-full">
              <div
                className="bg-green-500 transition-all"
                style={{ width: `${progressPct(fundraisingProgress.committed)}%` }}
              />
              <div
                className="bg-yellow-500 transition-all"
                style={{ width: `${progressPct(fundraisingProgress.softCircle)}%` }}
              />
              <div
                className="bg-blue-500 transition-all"
                style={{ width: `${progressPct(fundraisingProgress.pipeline)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Individual segments */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {progressBars.map((bar) => (
            <div key={bar.label} className="rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-3 w-3 rounded-full ${bar.color}`} />
                <span className="text-sm font-medium text-gray-700">{bar.label}</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(bar.value)}</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${bar.color} transition-all`}
                  style={{ width: `${bar.pct}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {bar.pct}% of target
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Weekly Activity Line Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Weekly Activity</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  name="Document Views"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="questions"
                  name="Questions"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Document Views Bar Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Top Documents by Views
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={documentViews} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis
                  type="category"
                  dataKey="documentName"
                  width={130}
                  tick={{ fontSize: 11 }}
                  stroke="#9ca3af"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="views"
                  name="Total Views"
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="uniqueViewers"
                  name="Unique Viewers"
                  fill="#93c5fd"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* LP Engagement Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">LP Engagement</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  LP Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Time Spent (min)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Questions Asked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Docs Viewed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lpEngagement.map((lp) => (
                <tr key={lp.lpName} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
                        {lp.lpName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{lp.lpName}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {lp.timeSpent}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      {lp.questionsAsked}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FileText className="h-4 w-4 text-gray-400" />
                      {lp.documentsViewed}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Common Questions */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Common Questions</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {commonQuestions.map((q, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-sm font-medium text-purple-600">
                  {idx + 1}
                </div>
                <span className="text-sm text-gray-900">{q.question}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                  {q.frequency} times
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
