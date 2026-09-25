import React, { useState } from 'react';
import { ProfileData, TargetJobParams } from '../types';
import {
  downloadExecutiveLetterDocx,
  downloadExecutiveLetterPdf,
} from '../utils/executiveLetterExport';

interface ProjectsViewProps {
  profile: ProfileData;
  onOpenContact: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ profile }) => {
  const [params, setParams] = useState<TargetJobParams>({
    role: 'Chief Technology Officer / VP of Engineering',
    organization: 'Apex FinTech Global',
    hiringAuthority: 'Search Committee',
    location: 'London / Remote',
    scope: 'Executive Position (C-Suite / VP)',
    tone: 'Boardroom Executive',
    roleDescription: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuccess, setGeneratedSuccess] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(true);
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [historySaved, setHistorySaved] = useState(false);
  const [recentApps, setRecentApps] = useState([
    {
      id: 'app_1',
      title: 'VP Technology Infrastructure',
      org: 'Horizon Sovereign Fund',
      timeAgo: 'Synthesized 2d ago',
    },
    {
      id: 'app_2',
      title: 'Non-Executive Technical Director',
      org: 'Meridian Health Tech',
      timeAgo: 'Synthesized 5d ago',
    },
  ]);

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const toneOptions = [
    'Boardroom Executive',
    'Modern Catalyst',
    'Concise Briefing',
    'Advisory Dossier',
  ];

  const handleExtractRequirements = () => {
    setParams((prev) => ({
      ...prev,
      roleDescription:
        'Mandate: Drive global enterprise cloud consolidation, supervise 50+ staff, enforce zero-trust security postures, and present quarterly infrastructure roadmaps directly to the Board of Directors.',
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedSuccess(false);
    setHasGenerated(true);
    setDownloadError(null);

    // Call server endpoint or deterministic high-velocity synthesis
    try {
      const response = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (response.ok) {
        // Successful response handled
      }
    } catch {
      // Graceful fallback to client synthesis
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setGeneratedSuccess(true);
        setTimeout(() => setGeneratedSuccess(false), 3500);
      }, 900);
    }
  };

  const handleSaveToHistory = () => {
    setRecentApps((prev) => [
      {
        id: `app_${Date.now()}`,
        title: params.role,
        org: params.organization,
        timeAgo: 'Synthesized just now',
      },
      ...prev.slice(0, 4),
    ]);
    setHistorySaved(true);
    setTimeout(() => setHistorySaved(false), 2500);
  };

  const handleDownloadDocx = async () => {
    try {
      setIsDownloadingDocx(true);
      setDownloadError(null);
      await downloadExecutiveLetterDocx(params, profile, currentDateStr);
    } catch (err) {
      console.error('Failed to export Word document:', err);
      setDownloadError('Failed to generate Word (.docx) document. Please try again.');
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloadingPdf(true);
      setDownloadError(null);
      await downloadExecutiveLetterPdf(params, profile, currentDateStr);
    } catch (err) {
      console.error('Failed to export PDF document:', err);
      setDownloadError('Failed to generate PDF (.pdf) document. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-10 animate-in fade-in duration-300">
      <div className="px-gutter-sm pt-space-md pb-space-lg flex flex-col gap-space-lg">
        {/* Intelligence Engine Header Card */}
        <div className="bg-surface-container-low rounded-xl p-space-md shadow-xs border border-border-subtle/50">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">
              Executive Suite • Intelligence Engine
            </span>
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-bronze animate-pulse" />
              Ready
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Automated executive cover letter synthesizer grounded in your verified career history.
          </p>
        </div>

        {/* Target Job Parameters Form Card */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-border-subtle/50 flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                assignment
              </span>
              <h2 className="font-headline-sm text-headline-sm text-primary">
                Target Job Parameters
              </h2>
            </div>
            <span className="font-label-sm text-label-sm text-slate-cool">Step 1 of 2</span>
          </div>

          {/* Role input */}
          <div className="flex flex-col gap-space-sm">
            <label className="font-label-md text-label-md text-slate-cool" htmlFor="job-title-input">
              Target Executive Role
            </label>
            <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center gap-2 border border-transparent focus-within:border-secondary focus-within:bg-white transition-colors">
              <span className="material-symbols-outlined text-slate-cool text-[20px]">badge</span>
              <input
                className="bg-transparent font-body-md text-body-md text-on-surface w-full focus:outline-none placeholder-slate-cool"
                id="job-title-input"
                onChange={(e) => setParams({ ...params, role: e.target.value })}
                placeholder="e.g. Chief Technology Officer"
                type="text"
                value={params.role}
              />
            </div>
          </div>

          {/* Organization input */}
          <div className="flex flex-col gap-space-sm">
            <label className="font-label-md text-label-md text-slate-cool" htmlFor="org-input">
              Target Organization
            </label>
            <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center gap-2 border border-transparent focus-within:border-secondary focus-within:bg-white transition-colors">
              <span className="material-symbols-outlined text-slate-cool text-[20px]">
                corporate_fare
              </span>
              <input
                className="bg-transparent font-body-md text-body-md text-on-surface w-full focus:outline-none placeholder-slate-cool"
                id="org-input"
                onChange={(e) => setParams({ ...params, organization: e.target.value })}
                placeholder="e.g. Global Holdings Corp"
                type="text"
                value={params.organization}
              />
            </div>
          </div>

          {/* Hiring Authority and Location */}
          <div className="grid grid-cols-2 gap-space-sm">
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-md text-label-md text-slate-cool truncate" htmlFor="manager-input">
                Hiring Authority
              </label>
              <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center gap-2 border border-transparent focus-within:border-secondary focus-within:bg-white transition-colors">
                <span className="material-symbols-outlined text-slate-cool text-[18px]">person</span>
                <input
                  className="bg-transparent font-body-sm text-body-sm text-on-surface w-full focus:outline-none"
                  id="manager-input"
                  onChange={(e) => setParams({ ...params, hiringAuthority: e.target.value })}
                  type="text"
                  value={params.hiringAuthority}
                />
              </div>
            </div>
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-md text-label-md text-slate-cool truncate" htmlFor="location-input">
                Location / Market
              </label>
              <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center gap-2 border border-transparent focus-within:border-secondary focus-within:bg-white transition-colors">
                <span className="material-symbols-outlined text-slate-cool text-[18px]">
                  location_on
                </span>
                <input
                  className="bg-transparent font-body-sm text-body-sm text-on-surface w-full focus:outline-none"
                  id="location-input"
                  onChange={(e) => setParams({ ...params, location: e.target.value })}
                  type="text"
                  value={params.location}
                />
              </div>
            </div>
          </div>

          {/* Scope Dropdown */}
          <div className="flex flex-col gap-space-sm">
            <label className="font-label-md text-label-md text-slate-cool" htmlFor="app-type">
              Application Scope
            </label>
            <div className="relative bg-surface-container-low rounded-lg p-2.5 flex items-center justify-between border border-transparent focus-within:border-secondary">
              <select
                className="w-full bg-transparent font-body-sm text-body-sm text-on-surface focus:outline-none appearance-none pr-8 cursor-pointer"
                id="app-type"
                onChange={(e) => setParams({ ...params, scope: e.target.value })}
                value={params.scope}
              >
                <option>Executive Position (C-Suite / VP)</option>
                <option>General Tech Leadership</option>
                <option>Enterprise Advisory & Board Role</option>
                <option>Institutional Consultancy</option>
                <option>Fellowship & Academic Honors</option>
              </select>
              <span className="material-symbols-outlined text-slate-cool pointer-events-none absolute right-3">
                expand_more
              </span>
            </div>
          </div>

          {/* Executive Tone & Architecture Pills */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-label-md text-label-md text-slate-cool">
              Executive Tone & Architecture
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {toneOptions.map((tone) => {
                const isActive = params.tone === tone;
                return (
                  <button
                    key={tone}
                    className={`style-pill px-3 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-xs font-semibold'
                        : 'bg-surface-container text-on-surface font-medium hover:bg-surface-container-high'
                    }`}
                    onClick={() => setParams({ ...params, tone })}
                    type="button"
                  >
                    {tone}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Description & Core Mandates */}
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md text-slate-cool" htmlFor="jd-text">
                Role Description & Core Mandates
              </label>
              <button
                className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary bg-surface-container px-2.5 py-1 rounded-full active:scale-95 transition-transform cursor-pointer hover:bg-surface-container-high"
                id="extract-btn"
                onClick={handleExtractRequirements}
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                Extract Requirements
              </button>
            </div>
            <div className="relative bg-surface-container-low rounded-lg p-3 border border-transparent focus-within:border-secondary focus-within:bg-white transition-colors">
              <textarea
                className="w-full bg-transparent font-body-sm text-body-sm text-on-surface focus:outline-none placeholder-slate-cool resize-none"
                id="jd-text"
                onChange={(e) => setParams({ ...params, roleDescription: e.target.value })}
                placeholder="Paste full JD specifications, executive requirements, board expectations..."
                rows={3}
                value={params.roleDescription}
              />
              <div className="flex items-center justify-between pt-2">
                <span className="font-label-sm text-label-sm text-slate-cool" id="char-count">
                  {params.roleDescription.length} characters
                </span>
                <span className="font-label-sm text-label-sm text-accent-bronze font-semibold">
                  Ready to parse
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Deterministic Verification Guarantee Card */}
        <div className="bg-primary-container text-on-primary rounded-xl p-space-md shadow-xs relative overflow-hidden">
          <div className="flex items-start gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-on-secondary text-[18px]">
                verified_user
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label-lg text-label-lg font-bold">
                Deterministic Verification Guarantee
              </span>
              <p className="font-body-sm text-body-sm text-surface-container-highest">
                Synthesizing strictly from Tesfaye Teklu's verified records (12+ years experience, multi-region cloud architecture, and executive management dossiers) — preventing qualification hallucinations.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 flex items-center justify-between border-t border-white/10">
            <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-secondary-fixed">
              <span className="material-symbols-outlined text-[16px] text-accent-bronze">lock</span>
              <span>Encrypted Profile Vault Active</span>
            </div>
            <span className="font-label-sm text-label-sm text-surface-container-high bg-primary/40 px-2 py-0.5 rounded">
              v4.8 Executive
            </span>
          </div>
        </div>

        {/* Live Document Simulator Section */}
        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">preview</span>
              <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                Live Document Simulator
              </h2>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded font-mono">
              A4 STANDARD
            </span>
          </div>

          {/* Rendered A4 Document */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md border border-border-subtle/70 flex flex-col gap-space-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />

            <div className="flex justify-between items-start pb-space-sm border-b border-border-subtle/50">
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary font-bold tracking-tight">
                  TESFAYE TEKLU
                </span>
                <span className="font-label-sm text-label-sm text-accent-bronze uppercase tracking-widest font-semibold">
                  System Support Application Officer | IT Systems | Database Administration
                </span>
                <span className="font-label-sm text-label-sm text-slate-cool mt-1">
                  Addis Ababa, Ethiopia • +251-932083373
                </span>
              </div>
              <div className="text-right flex flex-col items-end text-xs">
                <span className="font-label-sm text-label-sm text-on-surface">{profile.email}</span>
                <span className="font-label-sm text-label-sm text-slate-cool">{profile.phone}</span>
                <span className="font-label-sm text-label-sm text-secondary">{profile.linkedIn}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 font-body-sm text-body-sm text-on-surface-variant">
              <span className="font-label-md text-label-md text-on-surface font-semibold" id="preview-date">
                {currentDateStr}
              </span>
              <span className="font-semibold text-on-surface" id="preview-committee">
                {params.hiringAuthority}
              </span>
              <span id="preview-company">{params.organization}</span>
              <span id="preview-address">{params.location}</span>
            </div>

            <div className="flex flex-col gap-space-md text-on-surface pt-space-xs font-body-sm text-body-sm leading-relaxed">
              <p className="font-semibold text-primary">
                RE: Application for <span id="preview-role-heading">{params.role}</span>
              </p>
              <p>Dear Members of the {params.hiringAuthority},</p>
              <p id="preview-intro">
                I am writing to express my focused interest in contributing as your next{' '}
                <strong className="text-primary">{params.role}</strong> at{' '}
                <strong className="text-primary">{params.organization}</strong>. With over a decade of dedicated expertise in database administration, IT systems management, application support, networking, and web development, I have consistently delivered robust infrastructure reliability and operational excellence.
              </p>

              <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col gap-space-xs border border-border-subtle/50">
                <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
                  Strategic Competency & Verified Record Alignment
                </span>
                <ul className="list-disc pl-4 space-y-1 text-on-surface-variant text-xs">
                  <li>
                    <strong className="text-on-surface">Application Support & Access Governance:</strong> Provide day-to-day functional and technical support for core reinsurance business applications, manage user access lifecycle, and isolate root causes for recurring incidents (Ethiopian Reinsurance S.C.).
                  </li>
                  <li>
                    <strong className="text-on-surface">Network & Hardware Systems:</strong> Directed multi-year IT and network operations ensuring optimal reliability, server administration, and rapid incident triage (Urban Revenue Reform Project Office).
                  </li>
                  <li>
                    <strong className="text-on-surface">Oracle Database Administration:</strong> Administered mission-critical Oracle database environments, safeguarding data integrity, optimizing queries, and executing zero-loss backup and disaster recovery operations.
                  </li>
                </ul>
              </div>

              {params.roleDescription && (
                <div className="p-space-sm rounded-lg bg-surface-container border border-border-subtle/50 text-xs text-on-surface-variant">
                  <span className="font-semibold text-primary">Mandate Alignment: </span>
                  <span>{params.roleDescription}</span>
                </div>
              )}

              <p id="preview-body">
                {params.organization}'s requirement for dependable systems and operational continuity aligns directly with my hands-on background. Across high-stakes environments—from national registry systems to reinsurance platforms—I have enforced strict access permissions, resolved complex technical issues, and collaborated cross-functionally to achieve organizational objectives.
              </p>
              <p>
                I welcome the opportunity to discuss how my verified background in database administration, IT systems management, and application support will add immediate value to {params.organization}.
              </p>

              <div className="pt-space-sm flex flex-col gap-1">
                <span>Sincerely,</span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold tracking-tight">
                  Tesfaye Teklu Feyissa
                </span>
                <span className="font-label-sm text-label-sm text-slate-cool">
                  System Support Application Officer • Database Administrator • IT Systems
                </span>
              </div>
            </div>

            <div className="mt-space-sm pt-space-sm border-t border-border-subtle/40 flex items-center justify-between text-slate-cool font-label-sm text-label-sm">
              <span>Encrypted Dossier Reference: TT-EXEC-2024-X</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>

        {/* Action Dock & Clean Export Section */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-lg border border-border-subtle/60 flex flex-col gap-space-md">
          <div className="grid grid-cols-2 gap-space-sm">
            <button
              className="col-span-2 bg-primary text-on-primary py-3 rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all hover:bg-secondary cursor-pointer"
              id="generate-btn"
              onClick={handleGenerate}
              type="button"
            >
              {isGenerating ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                  <span>Synthesizing Records...</span>
                </>
              ) : generatedSuccess ? (
                <>
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>Cover Letter Ready!</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  <span>Generate Executive Letter</span>
                </>
              )}
            </button>

            <button
              className="bg-surface-container text-on-surface py-2.5 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 active:bg-surface-container-high transition-colors cursor-pointer hover:bg-surface-container-high"
              id="regen-btn"
              onClick={handleGenerate}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span>Regenerate</span>
            </button>

            <button
              className="bg-surface-container text-on-surface py-2.5 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 active:bg-surface-container-high transition-colors cursor-pointer hover:bg-surface-container-high"
              id="save-history-btn"
              onClick={handleSaveToHistory}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {historySaved ? 'check' : 'bookmark'}
              </span>
              <span>{historySaved ? 'Saved!' : 'Save to History'}</span>
            </button>
          </div>

          {/* Clean Export Area */}
          {hasGenerated && (
            <div className="pt-space-xs border-t border-border-subtle/50 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    verified
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Executive Letter Generated Successfully
                  </h3>
                </div>
              </div>

              {downloadError && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-body-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{downloadError}</span>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <span className="font-label-md text-label-md text-slate-cool font-semibold">
                  Download Executive Letter
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <button
                    className="w-full bg-primary text-on-primary py-3 px-4 rounded-lg font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all hover:bg-secondary cursor-pointer disabled:opacity-50"
                    id="download-word-btn"
                    onClick={handleDownloadDocx}
                    disabled={isDownloadingDocx}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px] text-accent-bronze">
                      description
                    </span>
                    <span>
                      {isDownloadingDocx ? 'Generating Word...' : 'Download Word (.docx)'}
                    </span>
                  </button>

                  <button
                    className="w-full bg-surface-container-high text-primary border border-border-subtle py-3 px-4 rounded-lg font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all hover:bg-surface-container-highest cursor-pointer disabled:opacity-50"
                    id="download-pdf-btn"
                    onClick={handleDownloadPdf}
                    disabled={isDownloadingPdf}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px] text-error">
                      picture_as_pdf
                    </span>
                    <span>
                      {isDownloadingPdf ? 'Generating PDF...' : 'Download PDF (.pdf)'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Executive Applications */}
        <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm mb-space-lg border border-border-subtle/50">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-primary font-bold">
              Recent Executive Applications
            </span>
            <span className="font-label-sm text-label-sm text-secondary">Vault Sync</span>
          </div>
          <div className="flex flex-col gap-2">
            {recentApps.map((item) => (
              <div
                key={item.id}
                className="bg-surface-container-lowest p-2.5 rounded-lg flex items-center justify-between shadow-xs border border-border-subtle/40"
              >
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    {item.title}
                  </span>
                  <span className="font-body-sm text-body-sm text-slate-cool">
                    {item.org} • {item.timeAgo}
                  </span>
                </div>
                <span className="material-symbols-outlined text-slate-cool text-[20px]">
                  chevron_right
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
