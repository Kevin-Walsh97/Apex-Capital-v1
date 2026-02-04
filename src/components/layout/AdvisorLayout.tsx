import { Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, BarChart3, FolderOpen } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import type { SidebarItem } from './Sidebar';

const advisorNavItems: SidebarItem[] = [
  { label: 'Dashboard', path: '/advisor', icon: LayoutDashboard },
  { label: 'Documents', path: '/advisor/documents', icon: FileText },
  { label: 'Pipeline', path: '/advisor/pipeline', icon: Users },
  { label: 'Analytics', path: '/advisor/analytics', icon: BarChart3 },
  { label: 'Data Room', path: '/advisor/dataroom', icon: FolderOpen },
];

export default function AdvisorLayout() {
  return (
    <DashboardLayout sidebarItems={advisorNavItems} title="Advisor Dashboard">
      <Outlet />
    </DashboardLayout>
  );
}
