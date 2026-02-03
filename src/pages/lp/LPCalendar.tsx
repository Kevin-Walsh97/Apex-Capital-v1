import { useState, useMemo } from 'react';
import {
  Calendar,
  Eye,
  EyeOff,
  Filter,
  MapPin,
  DollarSign,
  Building,
  Clock,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { FundStrategy } from '../../types';
import { sampleCalendarEvents } from '../../data/sampleData';
import { formatCurrency, formatDate, getStrategyColor } from '../../utils/format';

const strategies: Array<FundStrategy | 'All'> = ['All', 'PE', 'VC', 'Credit', 'Real Estate'];

const eventTypeColors: Record<string, { bg: string; text: string; dot: string }> = {
  'First Close': { bg: 'bg-green-50 border-green-200', text: 'text-green-700', dot: 'bg-green-500' },
  'Interim Close': { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
  'Final Close': { bg: 'bg-red-50 border-red-200', text: 'text-red-700', dot: 'bg-red-500' },
};

export default function LPCalendar() {
  const { watchingFunds, toggleWatchingFund } = useStore();

  const [strategyFilter, setStrategyFilter] = useState<FundStrategy | 'All'>('All');
  const [geographyFilter, setGeographyFilter] = useState('');

  const filteredEvents = useMemo(() => {
    return sampleCalendarEvents
      .filter((event) => {
        const matchesStrategy =
          strategyFilter === 'All' || event.strategy === strategyFilter;
        const matchesGeo =
          geographyFilter === '' ||
          event.geography.toLowerCase().includes(geographyFilter.toLowerCase());
        return matchesStrategy && matchesGeo;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [strategyFilter, geographyFilter]);

  // Group events by month
  const groupedByMonth = useMemo(() => {
    const groups: Record<string, typeof filteredEvents> = {};
    filteredEvents.forEach((event) => {
      const d = new Date(event.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(event);
    });
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, events]) => {
        const d = new Date(events[0].date);
        const label = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        return { key, label, events };
      });
  }, [filteredEvents]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Fundraising Calendar</h1>
          <p className="mt-2 text-gray-600">
            Track upcoming fund closings and key fundraising dates.
          </p>
        </div>

        {/* Filters */}
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
              placeholder="e.g. Global"
              value={geographyFilter}
              onChange={(e) => setGeographyFilter(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
            />
          </div>

          {/* Legend */}
          <div className="ml-auto flex items-center gap-4">
            {Object.entries(eventTypeColors).map(([type, colors]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                <span className="text-xs text-gray-600">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No events found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedByMonth.map((group) => (
              <div key={group.key}>
                {/* Month Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gray-900 text-white px-4 py-1.5 rounded-lg text-sm font-semibold">
                    {group.label}
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Events */}
                <div className="space-y-3 ml-4">
                  {group.events.map((event) => {
                    const colors = eventTypeColors[event.eventType] || eventTypeColors['First Close'];
                    const isWatching = watchingFunds.includes(event.fundId);

                    return (
                      <div
                        key={event.id}
                        className={`relative flex items-start gap-4 p-5 rounded-xl border ${colors.bg} transition-all hover:shadow-sm`}
                      >
                        {/* Timeline dot */}
                        <div className="flex flex-col items-center shrink-0">
                          <div
                            className={`w-10 h-10 rounded-full ${colors.dot} flex items-center justify-center text-white`}
                          >
                            <Clock className="h-5 w-5" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-base font-semibold text-gray-900">
                                {event.fundName}
                              </h3>
                              <div className="flex items-center flex-wrap gap-3 mt-1.5">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors.text} bg-white/60`}
                                >
                                  {event.eventType}
                                </span>
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStrategyColor(event.strategy)}`}
                                >
                                  {event.strategy}
                                </span>
                              </div>
                            </div>

                            {/* Watch Toggle */}
                            <button
                              onClick={() => toggleWatchingFund(event.fundId)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                                isWatching
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {isWatching ? (
                                <>
                                  <Eye className="h-3.5 w-3.5" />
                                  Watching
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-3.5 w-3.5" />
                                  Watch
                                </>
                              )}
                            </button>
                          </div>

                          {/* Details row */}
                          <div className="flex items-center flex-wrap gap-4 mt-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {formatDate(event.date)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Building className="h-4 w-4 text-gray-400" />
                              {event.gpName}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              {event.geography}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                              Target: {formatCurrency(event.targetSize)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
