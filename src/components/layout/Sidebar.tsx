import type { LucideIcon } from 'lucide-react';
import { Building2, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export interface SidebarItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
  title: string;
}

export default function Sidebar({ items, title }: SidebarProps) {
  const currentUser = useStore((s) => s.currentUser);
  const logout = useStore((s) => s.logout);

  return (
    <aside className="w-64 h-screen sticky top-0 bg-navy-700 text-white flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Building2 className="w-7 h-7 text-white shrink-0" />
          <div>
            <h1 className="text-base font-bold leading-tight">Apex Capital</h1>
            <p className="text-xs text-white/50">{title}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/gp' || item.path === '/lp'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-navy-800 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      {currentUser && (
        <div className="px-4 py-4 border-t border-white/10">
          <div className="mb-3">
            <p className="text-sm font-medium truncate">{currentUser.name}</p>
            <p className="text-xs text-white/50 truncate">{currentUser.organization}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </aside>
  );
}
