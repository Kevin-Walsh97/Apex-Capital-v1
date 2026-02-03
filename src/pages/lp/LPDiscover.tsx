import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, MapPin, Calendar, TrendingUp, DollarSign, Filter } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { FundStrategy, FundStatus } from '../../types';
import { formatCurrency, getStrategyColor, getStatusColor } from '../../utils/format';

const strategies: Array<FundStrategy | 'All'> = ['All', 'PE', 'VC', 'Credit', 'Real Estate'];
const statuses: Array<FundStatus | 'All'> = ['All', 'Open', 'Closed', 'Coming Soon'];

export default function LPDiscover() {
  const { funds, savedFunds, toggleSavedFund } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [strategyFilter, setStrategyFilter] = useState<FundStrategy | 'All'>('All');
  const [geographyFilter, setGeographyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<FundStatus | 'All'>('All');

  const filteredFunds = useMemo(() => {
    return funds.filter((fund) => {
      const matchesSearch =
        searchQuery === '' ||
        fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fund.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStrategy = strategyFilter === 'All' || fund.strategy === strategyFilter;
      const matchesGeography =
        geographyFilter === '' ||
        fund.geography.toLowerCase().includes(geographyFilter.toLowerCase());
      const matchesStatus = statusFilter === 'All' || fund.status === statusFilter;
      return matchesSearch && matchesStrategy && matchesGeography && matchesStatus;
    });
  }, [funds, searchQuery, strategyFilter, geographyFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Discover Funds</h1>
          <p className="mt-2 text-gray-600">
            Explore private market investment opportunities across strategies and geographies.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search funds by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Strategy</label>
            <select
              value={strategyFilter}
              onChange={(e) => setStrategyFilter(e.target.value as FundStrategy | 'All')}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {strategies.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Geography</label>
            <input
              type="text"
              placeholder="e.g. North America"
              value={geographyFilter}
              onChange={(e) => setGeographyFilter(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FundStatus | 'All')}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-500 mb-4">
          {filteredFunds.length} fund{filteredFunds.length !== 1 ? 's' : ''} found
        </p>

        {/* Fund Cards Grid */}
        {filteredFunds.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No funds match your criteria</h3>
            <p className="text-gray-500 mt-1">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFunds.map((fund) => {
              const isSaved = savedFunds.includes(fund.id);
              return (
                <div
                  key={fund.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    {/* Top row: strategy badge + save button */}
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStrategyColor(fund.strategy)}`}
                      >
                        {fund.strategy}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleSavedFund(fund.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title={isSaved ? 'Remove from saved' : 'Save fund'}
                      >
                        <Heart
                          className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                        />
                      </button>
                    </div>

                    {/* Fund name (link) */}
                    <Link to={`/lp/funds/${fund.id}`} className="block group">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {fund.name}
                      </h3>
                    </Link>

                    {/* GP name placeholder */}
                    <p className="text-sm text-gray-500 mt-1">Managed by GP Partner</p>

                    {/* Metrics */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Target Size</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(fund.targetSize)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Min Investment</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(fund.minimumInvestment)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-gray-400 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Historical IRR</p>
                          <p className="text-sm font-medium text-gray-900">
                            {fund.irr || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Geography</p>
                          <p className="text-sm font-medium text-gray-900">{fund.geography}</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer row: status + vintage */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fund.status)}`}
                      >
                        {fund.status}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        Vintage {fund.vintageYear}
                      </span>
                    </div>
                  </div>

                  {/* Card link overlay */}
                  <Link
                    to={`/lp/funds/${fund.id}`}
                    className="block px-6 py-3 bg-gray-50 border-t border-gray-100 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
