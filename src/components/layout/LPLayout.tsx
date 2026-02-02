import { Outlet } from 'react-router-dom';
import { Search, Briefcase, MessageSquare, FileText, GitCompare, Calendar } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import type { SidebarItem } from './Sidebar';

const lpNavItems: SidebarItem[] = [
  { label: 'Discover', path: '/lp', icon: Search },
  { label: 'My Funds', path: '/lp/funds', icon: Briefcase },
  { label: 'AI Q&A', path: '/lp/qa', icon: MessageSquare },
  { label: 'Documents', path: '/lp/documents', icon: FileText },
  { label: 'Compare', path: '/lp/compare', icon: GitCompare },
  { label: 'Calendar', path: '/lp/calendar', icon: Calendar },
];

export default function LPLayout() {
  return (
    <DashboardLayout sidebarItems={lpNavItems} title="LP Dashboard">
      <Outlet />
    </DashboardLayout>
  );
}
