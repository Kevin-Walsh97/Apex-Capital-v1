export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(0)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function formatFullCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1_000_000) {
    return `${(bytes / 1_000_000).toFixed(1)} MB`;
  }
  return `${(bytes / 1_000).toFixed(0)} KB`;
}

export function getStrategyColor(strategy: string): string {
  const colors: Record<string, string> = {
    'VC': 'bg-blue-100 text-blue-800',
    'PE': 'bg-purple-100 text-purple-800',
    'Credit': 'bg-amber-100 text-amber-800',
    'Real Estate': 'bg-green-100 text-green-800',
  };
  return colors[strategy] || 'bg-gray-100 text-gray-800';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'Inquired': 'bg-gray-100 text-gray-700',
    'Under Review': 'bg-blue-100 text-blue-700',
    'Soft Circle': 'bg-yellow-100 text-yellow-700',
    'Committed': 'bg-green-100 text-green-700',
    'Passed': 'bg-red-100 text-red-700',
    'Open': 'bg-green-100 text-green-700',
    'Closed': 'bg-red-100 text-red-700',
    'Coming Soon': 'bg-blue-100 text-blue-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getConfidenceLabel(confidence: number): { label: string; color: string } {
  if (confidence >= 0.9) return { label: 'High', color: 'text-green-600' };
  if (confidence >= 0.7) return { label: 'Medium', color: 'text-yellow-600' };
  return { label: 'Low', color: 'text-red-600' };
}
