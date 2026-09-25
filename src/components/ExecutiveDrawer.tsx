import React from 'react';
import { NavTab, ProfileData } from '../types';

interface ExecutiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isAdmin: boolean;
  onLogout: () => void;
  onOpenAdminLogin: () => void;
  profile: ProfileData;
  onDownloadCv: (format?: 'pdf' | 'docx') => void;
  onOpenContact: () => void;
  logoUrl?: string;
}

export const ExecutiveDrawer: React.FC<ExecutiveDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  isAdmin,
  onLogout,
  onOpenAdminLogin,
  profile,
  onDownloadCv,
  onOpenContact,
  logoUrl,
}) => {
  if (!isOpen) return null;

  const cleanLogoUrl = (logoUrl || '').trim();

  const navigateTo = (tab: NavTab) => {
    setActiveTab(tab);
    onClose();
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      navigateTo('admin');
    } else {
      onOpenAdminLogin();
      onClose();
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-deep/50 backdrop-blur-xs flex items-end justify-center p-0 transition-opacity animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full bg-surface-container-lowest rounded-t-2xl p-space-lg shadow-2xl flex flex-col max-w-lg border-t border-border-subtle max-h-[85vh] overflow-y-auto no-scrollbar">
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-surface-container-high mx-auto mb-space-sm" />

        {/* Top header */}
        <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle mb-space-md">
          <div className="flex items-center gap-space-sm">
            {cleanLogoUrl ? (
              <img src={cleanLogoUrl} alt="TT Logo" className="h-8 w-auto object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary font-bold text-xs tracking-wider border border-secondary/20">
                TT
              </div>
            )}
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                Executive Control
              </h3>
              <p className="font-label-sm text-label-sm text-slate-cool">
                Dossier Navigation & Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-slate-cool hover:text-primary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Access Status & Authentication State */}
        <div className="bg-surface-container-low p-space-sm rounded-xl mb-space-md border border-border-subtle/50">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm text-slate-cool uppercase font-semibold">
              Access State
            </span>
            <span className="font-label-sm text-label-sm font-semibold text-secondary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              {isAdmin ? 'Authenticated Administrator' : 'Public Visitor View'}
            </span>
          </div>

          {isAdmin ? (
            <div className="flex flex-col gap-2 pt-1">
              <div className="text-xs text-on-surface-variant flex items-center justify-between">
                <span>Account:</span>
                <span className="font-medium text-primary">contactesfaye@gmail.com</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleAdminClick}
                  className="py-2 px-3 rounded-lg font-label-sm text-label-sm font-semibold bg-primary text-on-primary hover:bg-secondary transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="py-2 px-3 rounded-lg font-label-sm text-label-sm font-semibold bg-surface-container hover:bg-error/10 text-slate-cool hover:text-error transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-border-subtle"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-cool">
                Management features require administrator authentication.
              </span>
              <button
                type="button"
                onClick={handleAdminClick}
                className="py-1.5 px-3 rounded-lg font-label-sm text-label-sm font-semibold bg-primary text-on-primary hover:bg-secondary transition-colors cursor-pointer flex items-center gap-1 shadow-xs flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[15px]">lock</span>
                <span>Admin Login</span>
              </button>
            </div>
          )}
        </div>

        {/* Direct Section Navigation */}
        <div className="mb-space-md">
          <span className="font-label-sm text-label-sm text-slate-cool uppercase font-semibold block mb-2">
            Directory Jump
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {[
              { id: 'home', label: 'Overview & Executive Profile', icon: 'dashboard' },
              { id: 'experience', label: 'Tenure, Education & Credentials', icon: 'workspace_premium' },
              { id: 'skills', label: 'Competency Matrix & Case Studies', icon: 'psychology' },
              { id: 'projects', label: 'Executive Letter & Projects', icon: 'rocket_launch' },
              ...(isAdmin
                ? [{ id: 'admin', label: 'Career Portal CMS & Telemetry', icon: 'admin_panel_settings' }]
                : [{ id: 'login', label: 'Administrator Portal Login', icon: 'lock' }]),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'login') {
                    onOpenAdminLogin();
                    onClose();
                  } else {
                    navigateTo(tab.id as NavTab);
                  }
                }}
                className={`flex items-center justify-between p-2.5 rounded-lg transition-colors text-left cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-secondary">
                    {tab.icon}
                  </span>
                  <span className="font-body-sm text-body-sm">{tab.label}</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-cool">
                  chevron_right
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-space-sm border-t border-border-subtle flex flex-col gap-2">
          <span className="font-label-sm text-label-sm text-slate-cool uppercase font-semibold">
            Executive Actions
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                onDownloadCv('pdf');
                onClose();
              }}
              className="p-2 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors cursor-pointer text-xs"
              title="Download Resume as PDF"
            >
              <span className="material-symbols-outlined text-[16px] text-red-500">picture_as_pdf</span>
              <span>CV (.pdf)</span>
            </button>
            <button
              onClick={() => {
                onDownloadCv('docx');
                onClose();
              }}
              className="p-2 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors cursor-pointer text-xs"
              title="Download Resume as Word (.docx)"
            >
              <span className="material-symbols-outlined text-[16px] text-blue-600">article</span>
              <span>CV (.docx)</span>
            </button>
            <button
              onClick={() => {
                onOpenContact();
                onClose();
              }}
              className="p-2 rounded-lg bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1 hover:bg-secondary transition-colors cursor-pointer text-xs"
            >
              <span className="material-symbols-outlined text-[16px]">mail</span>
              <span>Inquiry</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-space-md pt-space-sm border-t border-border-subtle/50 text-center text-xs text-slate-cool">
          <span>{profile.fullName} • System Support Application Officer & DBA</span>
        </div>
      </div>
    </div>
  );
};
