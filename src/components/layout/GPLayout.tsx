import { Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, BarChart3, FolderOpen } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import type { SidebarItem } from './Sidebar';

const gpNavItems: SidebarItem[] = [
  { label: 'Dashboard', path: '/gp', icon: LayoutDashboard },
  { label: 'Documents', path: '/gp/documents', icon: FileText },
  { label: 'Pipeline', path: '/gp/pipeline', icon: Users },
  { label: 'Analytics', path: '/gp/analytics', icon: BarChart3 },
  { label: 'Data Room', path: '/gp/dataroom', icon: FolderOpen },
];

export default function GPLayout() {
  return (
    <DashboardLayout sidebarItems={gpNavItems} title="GP Dashboard">
      <Outlet />
    </DashboardLayout>
  );
}
