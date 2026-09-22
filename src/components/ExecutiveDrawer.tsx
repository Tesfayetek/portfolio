import React from 'react';
import { NavTab, ProfileData } from '../types';
import { ASSETS } from '../data/portfolioData';

interface ExecutiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  profile: ProfileData;
  onDownloadCv: () => void;
  onOpenContact: () => void;
}

export const ExecutiveDrawer: React.FC<ExecutiveDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  isAdmin,
  setIsAdmin,
  profile,
  onDownloadCv,
  onOpenContact
}) => {
  if (!isOpen) return null;

  const navigateTo = (tab: NavTab) => {
    setActiveTab(tab);
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
            <img src={ASSETS.logo} alt="TT Logo" className="h-8 w-auto object-contain" />
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

        {/* View Mode Toggle */}
        <div className="bg-surface-container-low p-space-sm rounded-xl mb-space-md">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm text-slate-cool uppercase font-semibold">
              Interface Mode
            </span>
            <span className="font-label-sm text-label-sm font-semibold text-secondary">
              {isAdmin ? 'Console CMS Mode' : 'Public Executive View'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-surface-container-high p-1 rounded-lg">
            <button
              onClick={() => setIsAdmin(false)}
              className={`py-2 rounded-md font-label-sm text-label-sm font-semibold transition-all ${
                !isAdmin
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Public Dossier
            </button>
            <button
              onClick={() => {
                setIsAdmin(true);
                setActiveTab('admin');
                onClose();
              }}
              className={`py-2 rounded-md font-label-sm text-label-sm font-semibold transition-all ${
                isAdmin
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Admin CMS
            </button>
          </div>
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
              { id: 'projects', label: 'AI Intelligence & Cover Letter', icon: 'rocket_launch' },
              { id: 'admin', label: 'Career Portal CMS & Telemetry', icon: 'admin_panel_settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigateTo(tab.id as NavTab)}
                className={`flex items-center justify-between p-2.5 rounded-lg transition-colors text-left ${
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
        <div className="grid grid-cols-2 gap-2 mb-space-md">
          <button
            onClick={() => {
              onDownloadCv();
              onClose();
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm font-semibold hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">
              download
            </span>
            <span>Download CV</span>
          </button>
          <button
            onClick={() => {
              onOpenContact();
              onClose();
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold hover:bg-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              mail
            </span>
            <span>Direct Inquiry</span>
          </button>
        </div>

        {/* Contact Info Footer */}
        <div className="pt-space-sm border-t border-border-subtle flex items-center justify-between text-slate-cool font-label-sm text-label-sm">
          <span>{profile.location}</span>
          <span className="text-secondary font-mono">v4.8 Verified</span>
        </div>
      </div>
    </div>
  );
};
