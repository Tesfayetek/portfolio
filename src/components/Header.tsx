import React from 'react';
import { NavTab } from '../types';
import { ASSETS } from '../data/portfolioData';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  onOpenDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAdmin,
  setIsAdmin,
  onOpenDrawer
}) => {
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
      default:
        return 'Portfolio Overview';
    }
  };

  const handleModeSwitch = (mode: 'public' | 'admin') => {
    if (mode === 'admin') {
      setIsAdmin(true);
      setActiveTab('admin');
    } else {
      setIsAdmin(false);
      if (activeTab === 'admin') {
        setActiveTab('home');
      }
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-border-subtle/40 transition-colors">
      <div className="h-16 px-gutter-sm flex items-center justify-between gap-space-sm max-w-2xl mx-auto">
        {/* Left: Monogram Logo and Title */}
        <div
          className="flex items-center gap-space-sm min-w-0 cursor-pointer group"
          onClick={() => setActiveTab('home')}
        >
          <img
            alt="TT Monogram Executive Logo"
            className="h-8 w-auto object-contain flex-shrink-0 group-hover:scale-105 transition-transform"
            src={ASSETS.logo}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold truncate leading-none">
              Tesfaye Teklu
            </span>
            <span className="font-label-sm text-label-sm text-slate-cool uppercase tracking-wider truncate">
              {getSubtitle()}
            </span>
          </div>
        </div>

        {/* Right: Public / Admin Pill Switch + Quick Tune Button + Profile Avatar */}
        <div className="flex items-center gap-space-xs flex-shrink-0">
          <div
            aria-label="View mode"
            className="flex items-center bg-surface-container-high rounded-full p-0.5"
            role="group"
          >
            <button
              className={`min-h-[32px] px-2.5 rounded-full font-label-sm text-label-sm transition-all cursor-pointer ${
                !isAdmin
                  ? 'bg-primary text-on-primary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface font-medium'
              }`}
              onClick={() => handleModeSwitch('public')}
              type="button"
            >
              Public
            </button>
            <button
              className={`min-h-[32px] px-2.5 rounded-full font-label-sm text-label-sm transition-all cursor-pointer ${
                isAdmin
                  ? 'bg-primary text-on-primary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface font-medium'
              }`}
              onClick={() => handleModeSwitch('admin')}
              type="button"
            >
              Admin
            </button>
          </div>

          <button
            aria-label="Open quick executive drawer"
            className="w-11 h-11 flex items-center justify-center rounded-full text-primary hover:bg-surface-container transition-colors cursor-pointer active:scale-95"
            onClick={onOpenDrawer}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">tune</span>
          </button>

          <img
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover ml-0.5 ring-1 ring-border-subtle cursor-pointer hover:ring-secondary transition-all"
            onClick={onOpenDrawer}
            src={ASSETS.headerThumb}
          />
        </div>
      </div>
    </header>
  );
};
