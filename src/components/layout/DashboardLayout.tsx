import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import Sidebar from './Sidebar';
import { useStore } from '../../store/useStore';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarItems: Array<{ label: string; path: string; icon: LucideIcon }>;
  title: string;
}

export default function DashboardLayout({ children, sidebarItems, title }: DashboardLayoutProps) {
  const currentUser = useStore((s) => s.currentUser);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar items={sidebarItems} title={title} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {currentUser && (
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
              <p className="text-xs text-gray-500">{currentUser.organization}</p>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
