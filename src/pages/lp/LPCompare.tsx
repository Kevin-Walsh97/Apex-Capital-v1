import { useState, useMemo } from 'react';
import { Plus, X, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useStore } from '../../store/useStore';
import { Fund } from '../../types';
import { formatCurrency, getStrategyColor, getStatusColor } from '../../utils/format';

const MAX_COMPARE = 3;

const comparisonRows: Array<{
  label: string;
  key: string;
  getValue: (fund: Fund) => string | number;
  numeric?: boolean;
  format?: (v: number) => string;
  higherIsBetter?: boolean;
  lowerIsBetter?: boolean;
}> = [
  { label: 'Strategy', key: 'strategy', getValue: (f) => f.strategy },
  {
    label: 'Target Size',
    key: 'targetSize',
    getValue: (f) => f.targetSize,
    numeric: true,
    format: formatCurrency,
    higherIsBetter: false,
  },
  {
    label: 'Min Investment',
    key: 'minInvestment',
    getValue: (f) => f.minimumInvestment,
    numeric: true,
    format: formatCurrency,
    lowerIsBetter: true,
  },
  { label: 'Management Fee', key: 'managementFee', getValue: (f) => f.managementFee },
  { label: 'Carry', key: 'carry', getValue: (f) => f.carry },
  { label: 'Historical IRR', key: 'irr', getValue: (f) => f.irr || 'N/A' },
  { label: 'Historical MOIC', key: 'moic', getValue: (f) => f.moic || 'N/A' },
  {
    label: 'Team Size',
    key: 'teamSize',
    getValue: (f) => f.teamSize,
    numeric: true,
    higherIsBetter: true,
  },
  { label: 'Geography', key: 'geography', getValue: (f) => f.geography },
  { label: 'Vintage Year', key: 'vintageYear', getValue: (f) => f.vintageYear },
  { label: 'Status', key: 'status', getValue: (f) => f.status },
  {
    label: 'Fund Term',
    key: 'fundTerm',
    getValue: (f) => {
      const first = new Date(f.closingSchedule.firstClose);
      const final = new Date(f.closingSchedule.finalClose);
      const months = Math.round(
        (final.getTime() - first.getTime()) / (1000 * 60 * 60 * 24 * 30)
      );
      return `${months} months`;
    },
  },
];

const chartColors = ['#3b82f6', '#8b5cf6', '#10b981'];

export default function LPCompare() {
  const { funds } = useStore();
  const [selectedFundIds, setSelectedFundIds] = useState<string[]>([]);

  const selectedFunds = useMemo(
    () => selectedFundIds.map((id) => funds.find((f) => f.id === id)).filter(Boolean) as Fund[],
    [selectedFundIds, funds]
  );

  const availableFunds = funds.filter((f) => !selectedFundIds.includes(f.id));

  const addFund = (fundId: string) => {
    if (selectedFundIds.length < MAX_COMPARE && fundId) {
      setSelectedFundIds((prev) => [...prev, fundId]);
    }
  };

  const removeFund = (fundId: string) => {
    setSelectedFundIds((prev) => prev.filter((id) => id !== fundId));
  };

  // Chart data
  const targetSizeChartData = useMemo(
    () =>
      selectedFunds.map((f) => ({
        name: f.name.length > 20 ? f.name.slice(0, 20) + '...' : f.name,
        'Target Size ($M)': f.targetSize / 1_000_000,
      })),
    [selectedFunds]
  );

  const teamSizeChartData = useMemo(
    () =>
      selectedFunds.map((f) => ({
        name: f.name.length > 20 ? f.name.slice(0, 20) + '...' : f.name,
        'Team Size': f.teamSize,
      })),
    [selectedFunds]
  );

  // Best value detection for highlighting
  const getBestHighlight = (
    row: (typeof comparisonRows)[0],
    fundIndex: number
  ): boolean => {
    if (selectedFunds.length < 2) return false;
    if (!row.numeric) return false;

    const values = selectedFunds.map((f) => {
      const v = row.getValue(f);
      return typeof v === 'number' ? v : 0;
    });

    if (row.higherIsBetter) {
      const maxVal = Math.max(...values);
      return values[fundIndex] === maxVal;
    }
    if (row.lowerIsBetter) {
      const minVal = Math.min(...values);
      return values[fundIndex] === minVal;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Compare Funds</h1>
          <p className="mt-2 text-gray-600">
            Select up to {MAX_COMPARE} funds for a side-by-side comparison.
          </p>
        </div>

        {/* Fund Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {selectedFundIds.map((id, idx) => {
            const fund = funds.find((f) => f.id === id);
            return (
              <div
                key={id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {fund?.name || 'Unknown'}
                  </p>
                  {fund && (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStrategyColor(fund.strategy)}`}
                    >
                      {fund.strategy}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeFund(id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0 ml-3"
                  title="Remove fund"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            );
          })}

          {selectedFundIds.length < MAX_COMPARE && (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-4">
              <label className="text-sm text-gray-500 mb-2 block">Add Fund</label>
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) addFund(e.target.value);
                }}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a fund...</option>
                {availableFunds.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {selectedFunds.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No funds selected</h3>
            <p className="text-gray-500 mt-1">
              Choose funds from the dropdowns above to start comparing.
            </p>
          </div>
        ) : (
          <>
            {/* Comparison Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">
                        Metric
                      </th>
                      {selectedFunds.map((fund, idx) => (
                        <th
                          key={fund.id}
                          className="text-left px-6 py-4 text-sm font-semibold text-gray-900"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: chartColors[idx] }}
                            />
                            {fund.name}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {comparisonRows.map((row) => (
                      <tr key={row.key} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm font-medium text-gray-600">
                          {row.label}
                        </td>
                        {selectedFunds.map((fund, idx) => {
                          const value = row.getValue(fund);
                          const isBest = getBestHighlight(row, idx);
                          const displayValue =
                            row.format && typeof value === 'number'
                              ? row.format(value)
                              : typeof value === 'number'
                                ? value.toLocaleString()
                                : value;

                          // Special rendering for strategy & status badges
                          if (row.key === 'strategy') {
                            return (
                              <td key={fund.id} className="px-6 py-3">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStrategyColor(String(value))}`}
                                >
                                  {value}
                                </span>
                              </td>
                            );
                          }
                          if (row.key === 'status') {
                            return (
                              <td key={fund.id} className="px-6 py-3">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(String(value))}`}
                                >
                                  {value}
                                </span>
                              </td>
                            );
                          }

                          return (
                            <td
                              key={fund.id}
                              className={`px-6 py-3 text-sm ${
                                isBest
                                  ? 'text-green-700 font-semibold bg-green-50'
                                  : 'text-gray-900'
                              }`}
                            >
                              {displayValue}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual Charts */}
            {selectedFunds.length >= 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Target Size Chart */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Target Size Comparison ($M)
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={targetSizeChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="Target Size ($M)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Team Size Chart */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Team Size Comparison
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={teamSizeChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="Team Size" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
