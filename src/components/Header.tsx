import React from 'react';
import { NavTab } from '../types';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isAdmin?: boolean;
  onLogout?: () => void;
  onOpenDrawer?: () => void;
  onOpenAdminLogin: () => void;
  logoUrl?: string;
  fullName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAdminLogin,
  logoUrl,
  fullName,
}) => {
  const cleanLogoUrl = (logoUrl || '').trim();

  const getSubtitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Portfolio Overview';
      case 'skills':
        return 'Competency Matrix';
      case 'experience':
        return 'Executive Experience';
      case 'projects':
        return 'Project Dossier Detail';
      case 'admin':
        return 'Executive Governance';
      case 'login':
        return 'Admin Portal';
      default:
        return 'Portfolio Overview';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-border-subtle/40 transition-colors">
      <div className="h-16 px-gutter-sm flex items-center justify-between gap-space-sm max-w-5xl mx-auto">
        {/* Left: Monogram Logo and Title */}
        <div
          className="flex items-center gap-space-sm min-w-0 cursor-pointer group"
          onClick={() => setActiveTab('home')}
        >
          {cleanLogoUrl ? (
            <img
              alt="TT Monogram Executive Logo"
              className="h-8 w-auto object-contain flex-shrink-0 group-hover:scale-105 transition-transform"
              src={cleanLogoUrl}
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary font-bold text-xs tracking-wider border border-secondary/20 shadow-xs group-hover:border-secondary transition-colors flex-shrink-0">
              TT
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold truncate leading-none">
              {fullName || 'Tesfaye Teklu'}
            </span>
            <span className="font-label-sm text-label-sm text-slate-cool uppercase tracking-wider truncate">
              {getSubtitle()}
            </span>
          </div>
        </div>

        {/* Right: Only Admin Login Button */}
        <div className="flex items-center flex-shrink-0">
          <button
            type="button"
            onClick={onOpenAdminLogin}
            id="header-admin-login-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-primary hover:bg-surface-container-high transition-all cursor-pointer font-label-sm text-label-sm font-semibold border border-border-subtle/60 active:scale-95 shadow-xs"
            title="Admin Login"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">
              lock
            </span>
            <span>Admin Login</span>
          </button>
        </div>
      </div>
    </header>
  );
};
