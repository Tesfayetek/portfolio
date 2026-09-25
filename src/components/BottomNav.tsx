import React from 'react';
import { NavTab } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isAdmin?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  isAdmin = false,
}) => {
  const publicNavItems: { id: NavTab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'dashboard' },
    { id: 'experience', label: 'Experience', icon: 'workspace_premium' },
    { id: 'skills', label: 'Skills', icon: 'psychology' },
    { id: 'projects', label: 'Projects', icon: 'rocket_launch' },
  ];

  const adminNavItems: { id: NavTab; label: string; icon: string }[] = [
    ...publicNavItems,
    { id: 'admin', label: 'Admin', icon: 'admin_panel_settings' },
  ];

  const navItems = isAdmin ? adminNavItems : publicNavItems;

  return (
    <nav
      className="fixed bottom-0 w-full z-50 pb-safe bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.05)] border-t border-border-subtle/40"
      data-active-classes="text-secondary font-semibold"
    >
      <div className="flex items-center justify-around h-16 px-space-xs max-w-5xl mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-secondary font-semibold'
                  : 'text-slate-cool hover:text-primary font-medium'
              }`}
              onClick={() => setActiveTab(item.id)}
              type="button"
            >
              <span
                className={`material-symbols-outlined text-[24px] transition-transform ${
                  isActive ? 'scale-110' : ''
                }`}
              >
                {item.icon}
              </span>
              <span className="font-label-sm text-label-sm mt-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
