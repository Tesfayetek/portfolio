import React from 'react';
import { ProfileData, MetricBenchmark, NavTab } from '../types';
import { ASSETS } from '../data/portfolioData';

interface HomeViewProps {
  profile: ProfileData;
  benchmarks: MetricBenchmark;
  onOpenContact: () => void;
  onDownloadCv: () => void;
  toastMessage: string | null;
  setActiveTab: (tab: NavTab) => void;
  onNavigateToCredentials: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  benchmarks,
  onOpenContact,
  onDownloadCv,
  toastMessage,
  setActiveTab,
  onNavigateToCredentials,
}) => {
  return (
    <div className="flex flex-col w-full animate-in fade-in duration-300">
      {/* Subtle Top Decorative Aura & Geometric Tech Grid Watermark Backdrop */}
      <div className="relative w-full overflow-hidden px-margin-sm pt-space-md pb-space-lg">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.035] overflow-hidden"
        >
          <svg
            className="w-full h-full"
            height="100%"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                height="32"
                id="exec-grid-pattern"
                patternUnits="userSpaceOnUse"
                width="32"
              >
                <path
                  className="text-primary"
                  d="M 32 0 L 0 0 0 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <circle
                  className="text-secondary"
                  cx="32"
                  cy="0"
                  fill="currentColor"
                  r="1.5"
                />
              </pattern>
            </defs>
            <rect fill="url(#exec-grid-pattern)" height="100%" width="100%" />
          </svg>
        </div>

        {/* Executive Hero Section */}
        <section
          className="relative flex flex-col items-center text-center"
          data-collection="profile"
          data-document="tesfaye-teklu"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-space-xs bg-surface-container-high px-3 py-1 rounded-full shadow-xs mb-space-md">
            <span className="w-2 h-2 rounded-full bg-accent-bronze animate-pulse" />
            <span
              className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold"
              data-field="credential-title"
            >
              {profile.credentialTitle}
            </span>
          </div>

          {/* Executive Headshot with Subtle Glowing Accent */}
          <div className="relative mb-space-md group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-secondary-container via-primary-fixed to-accent-bronze opacity-60 blur-md transition-all duration-500 group-hover:opacity-90" />
            <div className="relative w-28 h-28 rounded-full overflow-hidden bg-surface-container-highest shadow-xl p-1">
              <img
                alt="Tesfaye Teklu Headshot"
                className="w-full h-full object-cover rounded-full"
                data-field="avatar-url"
                src={ASSETS.avatar}
              />
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[14px]">verified</span>
            </div>
          </div>

          {/* Executive Title & Subheading */}
          <h1
            className="font-headline-xl-mobile text-headline-xl-mobile text-primary font-bold tracking-tight uppercase mb-space-xs"
            data-field="full-name"
          >
            {profile.fullName}
          </h1>
          <p
            className="font-body-md text-body-md text-slate-cool max-w-sm mb-space-lg leading-relaxed"
            data-field="tagline"
          >
            {profile.tagline}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col w-full gap-space-xs mb-space-lg">
            <div className="flex items-center gap-space-xs w-full">
              <button
                className="flex-1 inline-flex items-center justify-center gap-space-xs bg-surface-container text-primary font-label-lg text-label-lg py-3 px-4 rounded-lg shadow-xs hover:bg-surface-container-high transition-all active:scale-[0.98] cursor-pointer"
                data-action="download-cv"
                id="download-cv-btn"
                onClick={onDownloadCv}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  download
                </span>
                <span>Download CV (PDF)</span>
              </button>
              <button
                className="flex-1 inline-flex items-center justify-center gap-space-xs bg-primary-container text-on-primary font-label-lg text-label-lg py-3 px-4 rounded-lg shadow-md hover:bg-secondary transition-all active:scale-[0.98] cursor-pointer"
                data-action="open-contact-modal"
                id="contact-btn"
                onClick={onOpenContact}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">mail</span>
                <span>Contact Me</span>
              </button>
            </div>

            {/* Live notification banner */}
            {toastMessage && (
              <div
                className="text-center py-2 px-3 bg-secondary-container text-on-secondary rounded-lg font-label-sm text-label-sm shadow-xs transition-all animate-in fade-in"
                id="toast-feedback"
              >
                {toastMessage}
              </div>
            )}
          </div>

          {/* Professional Social Links Row */}
          <div className="flex items-center justify-center gap-space-sm mb-space-sm">
            <a
              aria-label="Tesfaye Teklu LinkedIn Profile"
              className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-slate-deep hover:bg-surface-container-high hover:text-secondary shadow-xs transition-colors"
              data-channel="linkedin"
              href={`https://${profile.linkedIn}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.8a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
              </svg>
            </a>
            <a
              aria-label="Tesfaye Teklu GitHub Repository"
              className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-slate-deep hover:bg-surface-container-high hover:text-secondary shadow-xs transition-colors"
              data-channel="github"
              href={`https://${profile.github}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
              </svg>
            </a>
            <a
              aria-label="Direct Email Tesfaye Teklu"
              className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-slate-deep hover:bg-surface-container-high hover:text-secondary shadow-xs transition-colors"
              data-channel="email"
              href={`mailto:${profile.email}`}
            >
              <span className="material-symbols-outlined text-[19px]">mail</span>
            </a>
            <a
              aria-label="Official Website Tesfaye Teklu"
              className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-slate-deep hover:bg-surface-container-high hover:text-secondary shadow-xs transition-colors"
              data-channel="website"
              href={profile.website}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[19px]">public</span>
            </a>
          </div>
        </section>
      </div>

      {/* Executive Quick Statistics Cards Grid (2x2) */}
      <section
        aria-label="Executive Track Record"
        className="px-margin-sm mb-space-lg"
        data-collection="metrics"
      >
        <div className="flex items-center justify-between mb-space-xs">
          <span className="font-label-sm text-label-sm text-slate-cool uppercase tracking-wider font-semibold">
            Leadership Benchmarks
          </span>
          <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-medium">
            <span className="material-symbols-outlined text-[14px]">sync</span> Verified
          </span>
        </div>
        <div className="grid grid-cols-2 gap-space-xs">
          {/* Stat Card 1 */}
          <div
            className="bg-surface-container-lowest p-space-sm rounded-xl shadow-xs flex flex-col justify-between border border-border-subtle/50"
            data-metric="experience"
          >
            <div className="flex items-center justify-between mb-space-xs">
              <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[18px]">history_toggle_off</span>
              </span>
              <span className="bg-surface-container-high px-2 py-0.5 rounded-full font-label-sm text-label-sm text-primary font-semibold">
                Tenure
              </span>
            </div>
            <div>
              <div
                className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight"
                data-field="experience-years"
              >
                {benchmarks.years}
              </div>
              <p className="font-label-md text-label-md text-slate-cool leading-tight mt-0.5">
                Years of Leadership Experience
              </p>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div
            className="bg-surface-container-lowest p-space-sm rounded-xl shadow-xs flex flex-col justify-between border border-border-subtle/50"
            data-metric="certifications"
          >
            <div className="flex items-center justify-between mb-space-xs">
              <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-accent-bronze">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </span>
              <span className="bg-surface-container-high px-2 py-0.5 rounded-full font-label-sm text-label-sm text-primary font-semibold">
                Global
              </span>
            </div>
            <div>
              <div
                className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight"
                data-field="certifications-count"
              >
                {benchmarks.certifications}
              </div>
              <p className="font-label-md text-label-md text-slate-cool leading-tight mt-0.5">
                Global Certifications Attained
              </p>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div
            className="bg-surface-container-lowest p-space-sm rounded-xl shadow-xs flex flex-col justify-between border border-border-subtle/50"
            data-metric="projects"
          >
            <div className="flex items-center justify-between mb-space-xs">
              <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              </span>
              <span className="bg-surface-container-high px-2 py-0.5 rounded-full font-label-sm text-label-sm text-primary font-semibold">
                Scope
              </span>
            </div>
            <div>
              <div
                className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight"
                data-field="projects-delivered"
              >
                {benchmarks.projects}
              </div>
              <p className="font-label-md text-label-md text-slate-cool leading-tight mt-0.5">
                Enterprise Projects Delivered
              </p>
            </div>
          </div>

          {/* Stat Card 4 */}
          <div
            className="bg-surface-container-lowest p-space-sm rounded-xl shadow-xs flex flex-col justify-between border border-border-subtle/50"
            data-metric="expertise"
          >
            <div className="flex items-center justify-between mb-space-xs">
              <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-accent-bronze">
                <span className="material-symbols-outlined text-[18px]">hub</span>
              </span>
              <span className="bg-surface-container-high px-2 py-0.5 rounded-full font-label-sm text-label-sm text-primary font-semibold">
                Pillars
              </span>
            </div>
            <div>
              <div
                className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight"
                data-field="pillars-count"
              >
                {benchmarks.pillars}
              </div>
              <p className="font-label-md text-label-md text-slate-cool leading-tight mt-0.5">
                Core Practice Areas of Expertise
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Biography & Career Focus Section */}
      <section
        className="px-margin-sm mb-space-lg"
        data-collection="profile"
        data-field="biography"
      >
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-border-subtle/50">
          {/* Section Tag & Title */}
          <div className="flex items-center gap-space-xs mb-space-sm">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              person_pin
            </span>
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
              Executive Profile
            </h2>
          </div>

          {/* Narrative Summary */}
          <div
            className="font-body-md text-body-md text-on-surface leading-relaxed space-y-space-sm mb-space-md"
            data-field="narrative"
          >
            <p>{profile.bio1}</p>
            <p className="text-slate-cool">{profile.bio2}</p>
          </div>

          {/* Core Career Focus Pills */}
          <div className="mb-space-md">
            <h3 className="font-label-sm text-label-sm text-slate-cool uppercase tracking-wider font-semibold mb-space-xs">
              Core Strategic Disciplines
            </h3>
            <div className="flex flex-wrap gap-1.5" data-field="career-tags">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[14px] text-secondary">
                  transform
                </span>
                Digital Transformation
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[14px] text-secondary">
                  account_tree
                </span>
                Enterprise Architecture
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[14px] text-secondary">
                  shield_with_heart
                </span>
                Strategic IT Governance
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[14px] text-secondary">
                  payments
                </span>
                FinTech & Business Systems
              </span>
            </div>
          </div>

          {/* Architectural Highlight Card Inside Bio */}
          <div className="bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between mb-space-md shadow-xs">
            <div className="flex items-center gap-space-xs min-w-0">
              <span className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm font-semibold text-primary truncate">
                  Enterprise Readiness
                </span>
                <span className="font-label-sm text-label-sm text-slate-cool truncate">
                  TOGAF & Cloud Architecture Aligned
                </span>
              </div>
            </div>
            <span className="font-label-sm text-label-sm font-bold text-secondary uppercase tracking-wider flex-shrink-0">
              Active
            </span>
          </div>

          {/* Direct Discovery Navigation Links */}
          <div className="grid grid-cols-2 gap-space-xs pt-space-xs">
            <button
              className="flex items-center justify-between p-3 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm font-semibold hover:bg-surface-container-high transition-colors cursor-pointer text-left"
              data-path="executive-experience"
              onClick={() => setActiveTab('experience')}
              type="button"
            >
              <span className="truncate">Experience Timeline</span>
              <span className="material-symbols-outlined text-[18px] text-secondary flex-shrink-0">
                arrow_forward
              </span>
            </button>
            <button
              className="flex items-center justify-between p-3 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm font-semibold hover:bg-surface-container-high transition-colors cursor-pointer text-left"
              data-path="competency-matrix"
              onClick={onNavigateToCredentials}
              type="button"
            >
              <span className="truncate">View Certifications</span>
              <span className="material-symbols-outlined text-[18px] text-accent-bronze flex-shrink-0">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
