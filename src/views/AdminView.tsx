import React, { useState } from 'react';
import { ProfileData, NavTab } from '../types';
import { ASSETS, AUDIT_STREAM } from '../data/portfolioData';

interface AdminViewProps {
  profile: ProfileData;
  onUpdateProfile: (updated: ProfileData) => void;
  setActiveTab: (tab: NavTab) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  profile,
  onUpdateProfile,
  setActiveTab,
}) => {
  const [activeCmsTab, setActiveCmsTab] = useState<'profile' | 'experience' | 'credentials' | 'documents'>('profile');
  const [formProfile, setFormProfile] = useState<ProfileData>(profile);
  const [saveToast, setSaveToast] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRole, setNewRole] = useState({ title: '', company: '', period: '2024 – PRESENT' });

  const [experienceLedger, setExperienceLedger] = useState([
    {
      id: 'led_1',
      role: 'System Support Application Officer',
      company: 'Ethiopian Reinsurance S.C.',
      period: 'July 2025 – Present',
      status: 'Active',
      desc: 'Provide day-to-day technical and functional support for business applications, manage user accounts & permissions, receive and analyze incidents, and resolve recurring issues.',
    },
    {
      id: 'led_2',
      role: 'Network and Hardware Administrator',
      company: 'Urban Revenue Reform Project Office',
      period: 'July 2018 – July 2025',
      status: 'Archived',
      desc: 'Oversee IT systems and network operations, implement and maintain hardware/software solutions, and troubleshoot technical issues.',
    },
    {
      id: 'led_3',
      role: 'Database Administrator',
      company: 'Federal Urban Land and Land-Related Property Registry Agency',
      period: 'July 2017 – June 2018',
      status: 'Archived',
      desc: 'Managed Oracle database systems critical to national land management, ensured data security & integrity, and executed backup/recovery strategies.',
    },
    {
      id: 'led_4',
      role: 'IT Expert',
      company: 'Ethiopian Fruit and Vegetable Market S.C.',
      period: 'July 2014 – July 2017',
      status: 'Archived',
      desc: 'Spearheaded IT infrastructure projects, provided staff technical support and training, and maintained secure data management.',
    },
    {
      id: 'led_5',
      role: 'Database Administrator',
      company: 'Radiation Protection Authority',
      period: 'August 2013 – July 2014',
      status: 'Archived',
      desc: 'Designed and managed Oracle databases, implemented database security measures, and developed decision-support reports.',
    },
  ]);

  const handleSaveProfile = () => {
    onUpdateProfile(formProfile);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleAddExperience = () => {
    if (!newRole.title) return;
    setExperienceLedger((prev) => [
      {
        id: `led_${Date.now()}`,
        role: newRole.title,
        company: newRole.company || 'Enterprise Solutions',
        period: newRole.period,
        status: 'Active',
        desc: 'Orchestrating multi-region cloud systems architecture and operational transformation.',
      },
      ...prev,
    ]);
    setShowAddModal(false);
    setNewRole({ title: '', company: '', period: '2024 – PRESENT' });
  };

  const handleDeleteLedger = (id: string) => {
    setExperienceLedger((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col w-full pb-10 animate-in fade-in duration-300">
      <div className="px-gutter-sm pt-space-md space-y-space-lg">
        {/* Top Executive Admin Header & Firebase/Database Status Banner */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-border-subtle/50 space-y-space-sm">
          <div className="flex items-center justify-between gap-space-sm">
            <div className="min-w-0">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block font-semibold">
                Console Overview
              </span>
              <h1 className="font-headline-sm text-headline-sm text-primary font-bold truncate">
                Executive Career Portal & CMS
              </h1>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-primary flex-shrink-0 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-label-sm text-label-sm font-medium">Connected</span>
            </div>
          </div>

          {/* Identity Strip */}
          <div className="flex items-center justify-between pt-2 border-t-0 bg-surface-container-low/60 rounded-lg p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-primary-container">
                <img
                  alt="Tesfaye Teklu Profile"
                  className="w-full h-full object-cover"
                  src={ASSETS.adminPortrait}
                />
              </div>
              <div className="min-w-0 flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                  {profile.fullName}
                </span>
                <span className="font-label-sm text-label-sm text-slate-cool truncate">
                  Chief Technology Officer & VP Eng
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-cool font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high">
              <span className="material-symbols-outlined text-[15px] text-accent-bronze">
                database
              </span>
              <span>prod-east</span>
            </div>
          </div>
        </div>

        {/* 1. Quick Executive Metrics (Bento Matrix) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-slate-cool">
              Database Telemetry
            </span>
            <span className="font-label-sm text-label-sm text-secondary font-medium">
              Firestore v11.4 Active
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-border-subtle/50 flex flex-col">
              <div className="flex items-center justify-between text-slate-cool mb-1">
                <span className="font-label-sm text-label-sm">Exp. Records</span>
                <span className="material-symbols-outlined text-[18px] text-primary">
                  work_history
                </span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                {experienceLedger.length + 4}
              </span>
              <span className="font-label-sm text-label-sm text-secondary mt-0.5 font-medium">
                +1 pending
              </span>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-border-subtle/50 flex flex-col">
              <div className="flex items-center justify-between text-slate-cool mb-1">
                <span className="font-label-sm text-label-sm">Degrees</span>
                <span className="material-symbols-outlined text-[18px] text-primary">school</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">4</span>
              <span className="font-label-sm text-label-sm text-slate-cool mt-0.5">Verified</span>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-border-subtle/50 flex flex-col">
              <div className="flex items-center justify-between text-slate-cool mb-1">
                <span className="font-label-sm text-label-sm">Certs</span>
                <span className="material-symbols-outlined text-[18px] text-accent-bronze">
                  verified
                </span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">18</span>
              <span className="font-label-sm text-label-sm text-slate-cool mt-0.5">2 expiring</span>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-border-subtle/50 flex flex-col">
              <div className="flex items-center justify-between text-slate-cool mb-1">
                <span className="font-label-sm text-label-sm">Skills</span>
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  psychology
                </span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">32</span>
              <span className="font-label-sm text-label-sm text-slate-cool mt-0.5">4 Domains</span>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-border-subtle/50 flex flex-col">
              <div className="flex items-center justify-between text-slate-cool mb-1">
                <span className="font-label-sm text-label-sm">Projects</span>
                <span className="material-symbols-outlined text-[18px] text-primary">
                  rocket_launch
                </span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">12</span>
              <span className="font-label-sm text-label-sm text-secondary mt-0.5">
                8 Case studies
              </span>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-border-subtle/50 flex flex-col">
              <div className="flex items-center justify-between text-slate-cool mb-1">
                <span className="font-label-sm text-label-sm">Letters</span>
                <span className="material-symbols-outlined text-[18px] text-accent-bronze">
                  auto_awesome
                </span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">15</span>
              <span className="font-label-sm text-label-sm text-accent-bronze mt-0.5 font-medium">
                AI Synthesized
              </span>
            </div>
          </div>
        </div>

        {/* 2. Executive Dispatch Actions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-slate-cool">
              Executive Dispatch Actions
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-xs hover:bg-secondary active:scale-95 transition-all cursor-pointer"
              onClick={() => {
                setActiveCmsTab('experience');
                setShowAddModal(true);
              }}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Add Experience</span>
            </button>
            <button
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md font-semibold shadow-xs hover:bg-surface-container active:scale-95 transition-all cursor-pointer border border-border-subtle/50"
              onClick={() => setActiveCmsTab('credentials')}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-accent-bronze">
                workspace_premium
              </span>
              <span>Add Certification</span>
            </button>
            <button
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md font-semibold shadow-xs hover:bg-surface-container active:scale-95 transition-all cursor-pointer border border-border-subtle/50"
              onClick={() => setActiveTab('skills')}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">
                folder_open
              </span>
              <span>New Project</span>
            </button>
            <button
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-tertiary-container text-on-tertiary-container font-label-md text-label-md font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
              onClick={() => setActiveTab('projects')}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Generate Letter</span>
            </button>
          </div>
        </div>

        {/* 3. Portfolio CMS Sections Drawer / Tabs */}
        <div className="space-y-space-md">
          {/* Section Tab Bar */}
          <div className="flex items-center justify-between px-1">
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-slate-cool">
              Live CMS Modules
            </span>
          </div>

          <div className="flex gap-1.5 p-1 bg-surface-container rounded-xl overflow-x-auto no-scrollbar">
            {[
              { id: 'profile', label: 'Profile', icon: 'person_outline' },
              { id: 'experience', label: 'Experience', icon: 'business_center' },
              { id: 'credentials', label: 'Credentials', icon: 'badge' },
              { id: 'documents', label: 'Documents', icon: 'description' },
            ].map((tab) => {
              const isActive = activeCmsTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`cms-tab-btn flex items-center gap-1.5 px-3 py-2 rounded-lg font-label-sm text-label-sm font-semibold transition-all flex-shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-slate-cool hover:text-primary'
                  }`}
                  onClick={() => setActiveCmsTab(tab.id as typeof activeCmsTab)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content 1: Profile Identity Management */}
          {activeCmsTab === 'profile' && (
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-border-subtle/50 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Profile Identity
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm">
                  Live Sync
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-label-sm text-label-sm text-slate-cool font-medium mb-1">
                    Executive Full Name
                  </label>
                  <input
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary transition-all border border-transparent focus:border-secondary"
                    onChange={(e) =>
                      setFormProfile({ ...formProfile, fullName: e.target.value })
                    }
                    type="text"
                    value={formProfile.fullName}
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm text-slate-cool font-medium mb-1">
                    Executive Title & Rank
                  </label>
                  <input
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary transition-all border border-transparent focus:border-secondary"
                    onChange={(e) =>
                      setFormProfile({
                        ...formProfile,
                        executiveTitleRank: e.target.value,
                      })
                    }
                    type="text"
                    value={formProfile.executiveTitleRank}
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm text-slate-cool font-medium mb-1">
                    Executive Bio / Board Abstract
                  </label>
                  <textarea
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary transition-all resize-none border border-transparent focus:border-secondary"
                    onChange={(e) =>
                      setFormProfile({
                        ...formProfile,
                        boardAbstract: e.target.value,
                      })
                    }
                    rows={3}
                    value={formProfile.boardAbstract}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-label-sm text-label-sm text-slate-cool font-medium mb-1">
                      Executive Email
                    </label>
                    <input
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest transition-all border border-transparent focus:border-secondary"
                      onChange={(e) =>
                        setFormProfile({ ...formProfile, email: e.target.value })
                      }
                      type="email"
                      value={formProfile.email}
                    />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-slate-cool font-medium mb-1">
                      LinkedIn Profile
                    </label>
                    <input
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest transition-all border border-transparent focus:border-secondary"
                      onChange={(e) =>
                        setFormProfile({ ...formProfile, linkedIn: e.target.value })
                      }
                      type="text"
                      value={formProfile.linkedIn}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-cool font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    {saveToast ? 'check_circle' : 'check'}
                  </span>
                  {saveToast ? 'Changes updated successfully!' : 'Auto-saved 3m ago'}
                </span>
                <button
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-secondary active:scale-95 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  onClick={handleSaveProfile}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab Content 2: Experience Management */}
          {activeCmsTab === 'experience' && (
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-border-subtle/50 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Experience Ledger
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-slate-cool font-label-sm text-label-sm">
                    {experienceLedger.length} Total Items
                  </span>
                  <button
                    className="px-2.5 py-1 rounded-md bg-primary text-on-primary text-xs font-semibold cursor-pointer hover:bg-secondary"
                    onClick={() => setShowAddModal(true)}
                  >
                    + Add Role
                  </button>
                </div>
              </div>

              {/* Add Role Inline Form */}
              {showAddModal && (
                <div className="p-3 rounded-lg bg-surface-container border border-border-subtle space-y-2">
                  <span className="font-label-sm text-label-sm text-primary font-bold">
                    Quick Record Entry
                  </span>
                  <input
                    className="w-full px-3 py-2 rounded bg-white text-sm"
                    placeholder="Role Title (e.g. Chief Technology Officer)"
                    value={newRole.title}
                    onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
                  />
                  <input
                    className="w-full px-3 py-2 rounded bg-white text-sm"
                    placeholder="Organization (e.g. Nexus Global)"
                    value={newRole.company}
                    onChange={(e) => setNewRole({ ...newRole, company: e.target.value })}
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      className="px-3 py-1 rounded text-sm text-slate-cool"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-primary text-white text-sm font-semibold"
                      onClick={handleAddExperience}
                    >
                      Save Role
                    </button>
                  </div>
                </div>
              )}

              {/* Records List */}
              {experienceLedger.map((record) => (
                <div
                  key={record.id}
                  className="p-3 rounded-lg bg-surface-container-low space-y-2 border border-border-subtle/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-label-lg text-label-lg text-primary font-bold">
                        {record.role}
                      </h3>
                      <span className="font-label-sm text-label-sm text-slate-cool">
                        {record.company} • {record.period}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                        record.status === 'Active'
                          ? 'bg-secondary/15 text-secondary'
                          : 'bg-surface-container text-slate-cool'
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                    {record.desc}
                  </p>
                  <div className="flex items-center justify-end gap-1 pt-1">
                    <button
                      className="px-2.5 py-1.5 rounded-lg bg-surface-container-highest text-primary font-label-sm text-label-sm font-medium hover:bg-surface-container flex items-center gap-1 cursor-pointer"
                      onClick={() => setActiveTab('experience')}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                      Preview
                    </button>
                    <button
                      className="p-1.5 rounded-lg bg-error-container text-on-error-container hover:opacity-80 cursor-pointer"
                      onClick={() => handleDeleteLedger(record.id)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content 3: Certifications & Credentials Management */}
          {activeCmsTab === 'credentials' && (
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-border-subtle/50 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Verified Credentials
                </h2>
                <button
                  className="text-secondary font-label-sm text-label-sm font-semibold flex items-center gap-0.5 cursor-pointer hover:underline"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  <span>New Cert</span>
                </button>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low space-y-2 border border-border-subtle/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded bg-tertiary-fixed text-tertiary flex-shrink-0">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-label-md font-bold text-primary">
                        AWS Certified Solutions Architect
                      </h4>
                      <span className="font-label-sm text-label-sm text-slate-cool">
                        Amazon Web Services • Expires Nov 2026
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-surface-container text-secondary">
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 font-label-sm text-label-sm">
                  <a
                    className="text-secondary font-medium flex items-center gap-1 hover:underline"
                    href="https://aws.amazon.com/verification"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="material-symbols-outlined text-[14px]">link</span> Verify on Credly
                  </a>
                  <span className="text-slate-cool">cert_id_9921_aws.pdf</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low space-y-2 border border-border-subtle/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded bg-secondary-fixed text-primary flex-shrink-0">
                      <span className="material-symbols-outlined text-[18px]">security</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-label-md font-bold text-primary">
                        CISSP Security Professional
                      </h4>
                      <span className="font-label-sm text-label-sm text-slate-cool">
                        (ISC)² • ID #823011 • Active
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-surface-container text-secondary">
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 font-label-sm text-label-sm">
                  <a
                    className="text-secondary font-medium flex items-center gap-1 hover:underline"
                    href="https://www.isc2.org/credentials"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="material-symbols-outlined text-[14px]">link</span> ISC2 Registry
                  </a>
                  <span className="text-slate-cool">cissp_official_seal.pdf</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 4: Document Management */}
          {activeCmsTab === 'documents' && (
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-border-subtle/50 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Curriculum Vitae Vault
                </h2>
                <span className="text-slate-cool font-label-sm text-label-sm">
                  3 Historic Builds
                </span>
              </div>

              {/* Current Active Version Highlight */}
              <div className="p-3 rounded-xl bg-surface-container-low space-y-2.5 border border-border-subtle/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary text-on-primary flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-label-md text-label-md text-primary font-bold truncate">
                          Current CV v4.2.pdf
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-secondary text-on-secondary">
                          Primary
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm text-slate-cool">
                        2.4 MB • Generated Today at 09:14 AM
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="flex-1 py-2 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1 hover:bg-secondary transition-all cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Download</span>
                  </button>
                  <button
                    className="px-3 py-2 rounded-lg bg-surface-container-highest text-primary font-label-sm text-label-sm font-medium hover:bg-surface-container flex items-center gap-1 transition-all cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">share</span>
                    <span>Share Link</span>
                  </button>
                </div>
              </div>

              {/* Prior Versions Archive */}
              <div className="space-y-1.5 pt-1">
                <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-slate-cool block">
                  Historical Archives
                </span>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-slate-cool">
                      draft
                    </span>
                    <div>
                      <span className="font-label-sm text-label-sm font-medium text-on-surface block">
                        Executive CV v4.1.pdf
                      </span>
                      <span className="text-[11px] text-slate-cool">Archived Oct 2024</span>
                    </div>
                  </div>
                  <button
                    className="p-1 rounded text-primary hover:bg-surface-container cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">cloud_download</span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-slate-cool">
                      draft
                    </span>
                    <div>
                      <span className="font-label-sm text-label-sm font-medium text-on-surface block">
                        Executive CV v4.0.pdf
                      </span>
                      <span className="text-[11px] text-slate-cool">Archived Aug 2024</span>
                    </div>
                  </div>
                  <button
                    className="p-1 rounded text-primary hover:bg-surface-container cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">cloud_download</span>
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="pt-2">
                <label className="w-full flex flex-col items-center justify-center p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer text-center border-dashed border-2 border-border-subtle">
                  <span className="material-symbols-outlined text-[24px] text-secondary mb-1">
                    cloud_upload
                  </span>
                  <span className="font-label-md text-label-md font-semibold text-primary">
                    Upload new CV version
                  </span>
                  <span className="font-label-sm text-label-sm text-slate-cool mt-0.5">
                    PDF or DOCX up to 10MB
                  </span>
                  <input className="hidden" type="file" />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* 4. Recent Updates Activity Stream */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-slate-cool">
              Audit Activity Stream
            </span>
            <span className="font-label-sm text-label-sm text-slate-cool">Real-time Feed</span>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-border-subtle/50 space-y-3">
            {AUDIT_STREAM.map((item, idx) => (
              <React.Fragment key={item.id}>
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full bg-surface-container ${item.colorClass} flex items-center justify-center flex-shrink-0 mt-0.5`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-body-sm text-body-sm text-on-surface">
                      {item.title}
                    </p>
                    <span className="font-label-sm text-label-sm text-slate-cool block mt-0.5">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
                {idx < AUDIT_STREAM.length - 1 && (
                  <div className="h-px bg-surface-container-low w-full" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Quick Preview Toast / Modal Indicator Floating Component */}
        <div className="p-3 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-md flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="material-symbols-outlined text-inverse-primary text-[20px] flex-shrink-0">
              offline_bolt
            </span>
            <div className="min-w-0">
              <span className="font-label-sm text-label-sm font-semibold block truncate">
                Live Preview Server Running
              </span>
              <span className="text-[11px] text-slate-cool truncate block">
                localhost:3000/public/view
              </span>
            </div>
          </div>
          <button
            className="px-3 py-1.5 rounded bg-inverse-primary text-on-primary-fixed font-label-sm text-label-sm font-bold flex-shrink-0 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            onClick={() => setActiveTab('home')}
            type="button"
          >
            Inspect
          </button>
        </div>
      </div>
    </div>
  );
};
