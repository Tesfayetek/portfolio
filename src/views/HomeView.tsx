import React, { useMemo, useState } from 'react';
import {
  ProfileData,
  MetricBenchmark,
  NavTab,
  SiteSettings,
  MediaAssetsState,
  SkillDomain,
  HeroTechnologyIcon,
} from '../types';
import { HeroOrbitalSkills } from '../components/HeroOrbitalSkills';
import { heroImageStorageService } from '../services/heroImageStorageService';

interface HomeViewProps {
  profile: ProfileData;
  benchmarks: MetricBenchmark;
  siteSettings?: SiteSettings;
  mediaAssets?: MediaAssetsState;
  skillDomains?: SkillDomain[];
  heroTechnologyIcons?: HeroTechnologyIcon[];
  onOpenContact: () => void;
  onDownloadCv: (format?: 'pdf' | 'docx') => void;
  toastMessage: string | null;
  setActiveTab: (tab: NavTab) => void;
  onNavigateToCredentials: () => void;
  onOpenAdminLogin?: () => void;
  isAdmin?: boolean;
  onToast?: (msg: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  benchmarks,
  siteSettings,
  mediaAssets,
  skillDomains,
  heroTechnologyIcons,
  onOpenContact,
  onDownloadCv,
  toastMessage,
  setActiveTab,
  onNavigateToCredentials,
  onOpenAdminLogin,
  isAdmin = false,
  onToast,
}) => {
  const [showCvDropdown, setShowCvDropdown] = useState(false);

  // Extract skills dynamically from published portfolio data, synchronized with Admin Dashboard
  const portfolioSkills = useMemo(() => {
    if (!skillDomains || skillDomains.length === 0) {
      return ['Oracle', 'MySQL', 'JavaScript', 'HTML', 'Linux', 'Git', 'ASP.NET', 'Windows Server'];
    }

    const collected: string[] = [];
    const seen = new Set<string>();

    for (const domain of skillDomains) {
      if (domain.published === false) continue;
      for (const skill of domain.skills) {
        const cleanName = skill.name.trim();
        if (cleanName && !seen.has(cleanName.toLowerCase())) {
          seen.add(cleanName.toLowerCase());
          collected.push(cleanName);
        }
      }
    }

    return collected.length > 0
      ? collected
      : ['Oracle', 'MySQL', 'JavaScript', 'HTML', 'Linux', 'Git', 'ASP.NET', 'Windows Server'];
  }, [skillDomains]);

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-300 px-margin-sm py-space-xs sm:py-space-sm">
      {/* Full Continuous Dark Navy-to-Royal-Blue Technology Canvas */}
      <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#040D1F] via-[#091E44] via-30% via-[#0A2352] via-65% to-[#051329] shadow-2xl border border-blue-800/40 text-white">
        {/* Continuous Full-Page Ambient Lighting Accents */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 14% 8%, rgba(37,99,235,0.25) 0%, transparent 45%),
              radial-gradient(circle at 86% 18%, rgba(56,189,248,0.2) 0%, transparent 50%),
              radial-gradient(circle at 18% 45%, rgba(29,78,216,0.18) 0%, transparent 45%),
              radial-gradient(circle at 82% 65%, rgba(37,99,235,0.22) 0%, transparent 50%),
              radial-gradient(circle at 50% 90%, rgba(56,189,248,0.16) 0%, transparent 45%)
            `,
          }}
        />

        {/* Continuous Subtle Technology/Circuit Pattern Extending Across Entire Home Page */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.08] overflow-hidden"
        >
            <svg
              className="w-full h-full"
              height="100%"
              width="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Circuit Network Micro Pattern */}
                <pattern
                  height="72"
                  id="tech-circuit-network"
                  patternUnits="userSpaceOnUse"
                  width="72"
                >
                  {/* Subtle Grid Coordinate Guides */}
                  <path
                    d="M 72 0 L 0 0 0 72"
                    fill="none"
                    stroke="#93C5FD"
                    strokeDasharray="2 6"
                    strokeOpacity="0.35"
                    strokeWidth="0.75"
                  />
                  {/* Diagonal & Orthogonal Interconnected Circuit Traces */}
                  <path
                    d="M 0 36 L 24 36 L 36 48 L 56 48"
                    fill="none"
                    stroke="#60A5FA"
                    strokeOpacity="0.7"
                    strokeWidth="1"
                  />
                  <path
                    d="M 36 0 L 36 16 L 48 28 L 72 28"
                    fill="none"
                    stroke="#93C5FD"
                    strokeOpacity="0.6"
                    strokeWidth="0.8"
                  />
                  <path
                    d="M 12 72 L 12 56 L 24 44"
                    fill="none"
                    stroke="#38BDF8"
                    strokeOpacity="0.5"
                    strokeWidth="0.8"
                  />
                  {/* Terminal Connection Node Circles */}
                  <circle cx="56" cy="48" fill="#93C5FD" fillOpacity="0.9" r="2" />
                  <circle
                    cx="56"
                    cy="48"
                    fill="none"
                    r="4.5"
                    stroke="#60A5FA"
                    strokeOpacity="0.5"
                    strokeWidth="0.75"
                  />
                  <circle cx="36" cy="16" fill="#60A5FA" fillOpacity="0.8" r="1.75" />
                  <circle cx="72" cy="28" fill="#93C5FD" fillOpacity="0.8" r="1.5" />
                  <circle cx="12" cy="56" fill="#38BDF8" fillOpacity="0.75" r="1.5" />
                  {/* Small Junction Dots */}
                  <circle cx="0" cy="0" fill="#93C5FD" fillOpacity="0.7" r="1.75" />
                  <circle cx="72" cy="0" fill="#93C5FD" fillOpacity="0.7" r="1.75" />
                  <circle cx="0" cy="72" fill="#93C5FD" fillOpacity="0.7" r="1.75" />
                  <circle cx="72" cy="72" fill="#93C5FD" fillOpacity="0.7" r="1.75" />
                  <circle cx="20" cy="18" fill="#60A5FA" fillOpacity="0.6" r="1.2" />
                  <circle cx="52" cy="62" fill="#38BDF8" fillOpacity="0.6" r="1.2" />
                </pattern>
              </defs>
              <rect fill="url(#tech-circuit-network)" height="100%" width="100%" />
            </svg>
          </div>

          {/* Slightly More Visible Circuit Elements Near Outer Edges */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-[0.11] overflow-hidden"
          >
            <svg
              className="w-full h-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 1000 600"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Top-Left Outer Edge Circuitry & Data Bus Traces */}
              <g stroke="#93C5FD" strokeWidth="1.2">
                <path d="M 0 50 L 90 50 L 130 90 L 220 90" />
                <path d="M 0 75 L 75 75 L 110 110 L 170 110" />
                <path d="M 50 0 L 50 40 L 80 70 L 80 150" />
                <circle cx="220" cy="90" fill="#93C5FD" r="3" />
                <circle cx="170" cy="110" fill="#60A5FA" r="2.5" />
                <circle cx="80" cy="150" fill="#38BDF8" r="2.5" />
                <circle cx="130" cy="90" fill="#60A5FA" r="1.5" />
                {/* Tech Accent Circles */}
                <circle cx="110" cy="30" r="12" stroke="#60A5FA" strokeDasharray="3 3" strokeWidth="0.8" />
                <circle cx="110" cy="30" fill="#93C5FD" r="2" />
              </g>

              {/* Bottom-Left Outer Edge Data Traces */}
              <g stroke="#60A5FA" strokeWidth="1.2">
                <path d="M 0 520 L 110 520 L 150 480 L 250 480" />
                <path d="M 40 600 L 40 550 L 80 510 L 140 510" />
                <circle cx="250" cy="480" fill="#93C5FD" r="3" />
                <circle cx="140" cy="510" fill="#60A5FA" r="2.5" />
                <circle cx="60" cy="570" r="8" stroke="#38BDF8" strokeWidth="0.75" />
              </g>

              {/* Top-Right Outer Edge Circuit Tracks */}
              <g stroke="#93C5FD" strokeWidth="1.2">
                <path d="M 1000 60 L 910 60 L 870 100 L 800 100" />
                <path d="M 960 0 L 960 45 L 920 85 L 920 140" />
                <circle cx="800" cy="100" fill="#93C5FD" r="3" />
                <circle cx="920" cy="140" fill="#60A5FA" r="2.5" />
                <circle cx="890" cy="35" r="10" stroke="#60A5FA" strokeDasharray="2 3" strokeWidth="0.75" />
                <circle cx="890" cy="35" fill="#38BDF8" r="1.5" />
              </g>

              {/* Bottom-Right Outer Edge Traces */}
              <g stroke="#60A5FA" strokeWidth="1.2">
                <path d="M 1000 540 L 920 540 L 880 500 L 810 500" />
                <path d="M 950 600 L 950 560 L 910 520 L 870 520" />
                <circle cx="810" cy="500" fill="#93C5FD" r="3" />
                <circle cx="870" cy="520" fill="#38BDF8" r="2.5" />
              </g>
            </svg>
          </div>

          {/* Modern Professional Technology Hero Section Content */}
          <section
            className="relative z-10 w-full px-5 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10 lg:py-12"
            data-collection="profile"
            data-document="tesfaye-teklu"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Introduction, Name, Title, Summary, CTAs */}
              <div className="md:col-span-7 lg:col-span-6 flex flex-col items-center text-center md:items-start md:text-left order-2 md:order-1">
                {/* Introduction Kicker */}
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <span className="font-label-md text-xs sm:text-sm font-bold uppercase tracking-widest text-sky-400">
                    Hello, I'm
                  </span>
                  <span className="w-8 h-[2px] bg-sky-400/50 rounded-full" />
                  <span className="font-label-sm text-[11px] font-semibold text-blue-100 uppercase tracking-wider bg-blue-950/70 border border-blue-400/30 px-2.5 py-0.5 rounded-full shadow-xs">
                    {siteSettings?.statusAvailability || profile.credentialTitle || 'IT Professional'}
                  </span>
                </div>

                {/* Large Name */}
                <h1
                  className="font-headline-xl text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-2.5 drop-shadow-sm"
                  data-field="full-name"
                >
                  {profile.fullName || 'Tesfaye Teklu Feyissa'}
                </h1>

                {/* Professional Title */}
                <h2
                  className="text-base sm:text-lg lg:text-xl font-bold text-sky-300 tracking-tight mb-3.5"
                  data-field="credential-title"
                >
                  {siteSettings?.heroTagline || profile.tagline || 'IT Professional | Database Administrator | Web Developer'}
                </h2>

                {/* Professional Summary from Portfolio */}
                <p
                  className="font-body-md text-blue-100/90 text-sm sm:text-base leading-relaxed mb-6 max-w-xl"
                  data-field="tagline"
                >
                  {profile.bio1 || 'Dedicated IT professional with over a decade of experience in database administration, IT systems management, application support, networking, and web development.'}
                </p>

                {/* Action Buttons (CTAs) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-6">
                  {/* CV Download with Format Selector */}
                  <div className="w-full sm:w-auto relative">
                    <div className="flex rounded-xl shadow-md overflow-hidden border border-blue-300/30 bg-white">
                      <button
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-label-lg text-label-lg py-2.5 px-4 hover:bg-slate-100 transition-all active:scale-[0.98] cursor-pointer font-semibold"
                        data-action="download-cv-pdf"
                        id="download-cv-btn"
                        onClick={() => onDownloadCv('pdf')}
                        type="button"
                        title="Download formatted PDF resume"
                      >
                        <span className="material-symbols-outlined text-[19px] text-red-600">
                          picture_as_pdf
                        </span>
                        <span>Download CV (.pdf)</span>
                      </button>
                      <button
                        className="inline-flex items-center justify-center px-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer border-l border-slate-200"
                        onClick={() => setShowCvDropdown((prev) => !prev)}
                        type="button"
                        title="Select download format (DOCX or PDF)"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showCvDropdown ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>
                    </div>

                    {showCvDropdown && (
                      <div className="absolute top-full left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-1.5 animate-in fade-in slide-in-from-top-1 text-left text-slate-900">
                        <div className="text-[11px] font-semibold text-slate-500 uppercase px-2.5 py-1">
                          Download Format
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCvDropdown(false);
                            onDownloadCv('pdf');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px] text-red-500">picture_as_pdf</span>
                          <div className="flex flex-col">
                            <span>Adobe PDF (.pdf)</span>
                            <span className="text-[10px] text-slate-500 font-normal">Print-ready official document</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCvDropdown(false);
                            onDownloadCv('docx');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px] text-blue-600">article</span>
                          <div className="flex flex-col">
                            <span>Microsoft Word (.docx)</span>
                            <span className="text-[10px] text-slate-500 font-normal">Fully editable executive format</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Contact CTA */}
                  <button
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-label-lg text-label-lg py-2.5 px-5 rounded-xl shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-all active:scale-[0.98] cursor-pointer font-semibold border border-blue-400/30"
                    data-action="open-contact-modal"
                    id="contact-btn"
                    onClick={onOpenContact}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                    <span>{siteSettings?.ctaContactButtonText || 'Contact Me'}</span>
                  </button>
                </div>

                {/* Toast Feedback */}
                {toastMessage && (
                  <div
                    className="text-center py-2 px-3 bg-blue-950/80 border border-blue-400/40 text-blue-100 rounded-lg font-label-sm text-label-sm shadow-sm transition-all animate-in fade-in mb-4"
                    id="toast-feedback"
                  >
                    {toastMessage}
                  </div>
                )}

                {/* Professional Social Links Row */}
                <div className="flex items-center gap-space-sm">
                  <a
                    aria-label="Tesfaye Teklu LinkedIn Profile"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-sky-300 border border-white/15 shadow-sm transition-colors flex items-center justify-center cursor-pointer"
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
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-sky-300 border border-white/15 shadow-sm transition-colors flex items-center justify-center cursor-pointer"
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
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-sky-300 border border-white/15 shadow-sm transition-colors flex items-center justify-center cursor-pointer"
                    data-channel="email"
                    href={`mailto:${profile.email}`}
                  >
                    <span className="material-symbols-outlined text-[19px]">mail</span>
                  </a>
                  <a
                    aria-label="Official Website Tesfaye Teklu"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-sky-300 border border-white/15 shadow-sm transition-colors flex items-center justify-center cursor-pointer"
                    data-channel="website"
                    href={profile.website}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="material-symbols-outlined text-[19px]">public</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Portrait Surrounded by Orbiting Tech Skill Icons */}
              <div className="md:col-span-5 lg:col-span-6 flex items-center justify-center order-1 md:order-2 py-2 sm:py-4">
                <HeroOrbitalSkills
                  avatarUrl={(mediaAssets?.avatar || profile.avatarUrl || heroImageStorageService.getActiveHeroImage() || '').trim()}
                  fullName={profile.fullName || 'Tesfaye Teklu Feyissa'}
                  skills={portfolioSkills}
                  heroTechnologyIcons={heroTechnologyIcons}
                />
              </div>
            </div>
          </section>

          {/* Executive Quick Statistics Cards Grid (2x2) Seamlessly Flowing within Canvas */}
          <section
            aria-label="Executive Track Record"
            className="relative z-10 px-5 sm:px-8 md:px-10 py-4 sm:py-6"
            data-collection="metrics"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-label-sm text-xs sm:text-sm text-sky-400 uppercase tracking-widest font-bold">
                Leadership Benchmarks
              </span>
              <span className="inline-flex items-center gap-1.5 font-label-sm text-xs text-sky-300 font-semibold bg-blue-950/60 border border-blue-400/25 px-2.5 py-0.5 rounded-full shadow-xs">
                <span className="material-symbols-outlined text-[15px] text-emerald-400">check_circle</span> Verified
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Stat Card 1 */}
              <div
                className="bg-[#09224E]/60 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-lg border border-blue-400/20 hover:border-blue-400/40 hover:bg-[#0C2A60]/75 transition-all flex flex-col justify-between group"
                data-metric="experience"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-950/80 border border-blue-400/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[19px]">history_toggle_off</span>
                  </span>
                  <span className="bg-blue-900/60 text-sky-200 border border-blue-400/25 px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-semibold">
                    Tenure
                  </span>
                </div>
                <div>
                  <div
                    className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-white font-extrabold tracking-tight drop-shadow-xs"
                    data-field="experience-years"
                  >
                    {benchmarks.years}
                  </div>
                  <p className="font-label-md text-xs sm:text-sm text-blue-200/80 leading-snug mt-1">
                    Years of Leadership Experience
                  </p>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div
                className="bg-[#09224E]/60 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-lg border border-blue-400/20 hover:border-blue-400/40 hover:bg-[#0C2A60]/75 transition-all flex flex-col justify-between group"
                data-metric="certifications"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-950/80 border border-blue-400/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[19px]">verified_user</span>
                  </span>
                  <span className="bg-blue-900/60 text-sky-200 border border-blue-400/25 px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-semibold">
                    Global
                  </span>
                </div>
                <div>
                  <div
                    className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-white font-extrabold tracking-tight drop-shadow-xs"
                    data-field="certifications-count"
                  >
                    {benchmarks.certifications}
                  </div>
                  <p className="font-label-md text-xs sm:text-sm text-blue-200/80 leading-snug mt-1">
                    Global Certifications Attained
                  </p>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div
                className="bg-[#09224E]/60 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-lg border border-blue-400/20 hover:border-blue-400/40 hover:bg-[#0C2A60]/75 transition-all flex flex-col justify-between group"
                data-metric="projects"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-950/80 border border-blue-400/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[19px]">rocket_launch</span>
                  </span>
                  <span className="bg-blue-900/60 text-sky-200 border border-blue-400/25 px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-semibold">
                    Scope
                  </span>
                </div>
                <div>
                  <div
                    className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-white font-extrabold tracking-tight drop-shadow-xs"
                    data-field="projects-delivered"
                  >
                    {benchmarks.projects}
                  </div>
                  <p className="font-label-md text-xs sm:text-sm text-blue-200/80 leading-snug mt-1">
                    Enterprise Projects Delivered
                  </p>
                </div>
              </div>

              {/* Stat Card 4 */}
              <div
                className="bg-[#09224E]/60 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-lg border border-blue-400/20 hover:border-blue-400/40 hover:bg-[#0C2A60]/75 transition-all flex flex-col justify-between group"
                data-metric="expertise"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-950/80 border border-blue-400/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[19px]">hub</span>
                  </span>
                  <span className="bg-blue-900/60 text-sky-200 border border-blue-400/25 px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-semibold">
                    Pillars
                  </span>
                </div>
                <div>
                  <div
                    className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-white font-extrabold tracking-tight drop-shadow-xs"
                    data-field="pillars-count"
                  >
                    {benchmarks.pillars}
                  </div>
                  <p className="font-label-md text-xs sm:text-sm text-blue-200/80 leading-snug mt-1">
                    Core Practice Areas of Expertise
                  </p>
                </div>
              </div>
            </div>
          </section>

        {/* Executive Biography & Career Focus Section Seamlessly Integrated into Canvas */}
        <section
          className="relative z-10 px-5 sm:px-8 md:px-10 py-6 sm:py-8"
          data-collection="profile"
          data-field="biography"
        >
          <div className="bg-[#09224E]/50 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-blue-400/20 shadow-[0_8px_32px_rgba(2,12,32,0.35)] space-y-6">
            {/* Section Tag & Title */}
            <div className="flex items-center gap-space-xs mb-space-sm">
              <span className="material-symbols-outlined text-sky-400 text-[22px]">
                person_pin
              </span>
              <h2 className="font-headline-sm text-lg sm:text-xl text-white font-bold tracking-tight">
                Executive Profile
              </h2>
            </div>

            {/* Narrative Summary */}
            <div
              className="font-body-md text-sm sm:text-base leading-relaxed space-y-3"
              data-field="narrative"
            >
              <p className="text-blue-100/90">{profile.bio1}</p>
              <p className="text-blue-200/75">{profile.bio2}</p>
            </div>

            {/* Core Career Focus Pills */}
            <div className="pt-2">
              <h3 className="font-label-sm text-xs text-sky-300 uppercase tracking-widest font-semibold mb-2.5">
                Core Technical Competencies
              </h3>
              <div className="flex flex-wrap gap-2" data-field="career-tags">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/75 text-sky-100 font-semibold text-xs border border-blue-400/30 shadow-xs hover:border-blue-400/50 hover:bg-blue-900/60 transition-colors">
                  <span className="material-symbols-outlined text-[15px] text-sky-400">
                    dns
                  </span>
                  Oracle & MySQL Databases
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/75 text-sky-100 font-semibold text-xs border border-blue-400/30 shadow-xs hover:border-blue-400/50 hover:bg-blue-900/60 transition-colors">
                  <span className="material-symbols-outlined text-[15px] text-sky-400">
                    hub
                  </span>
                  Cisco Networking & Security
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/75 text-sky-100 font-semibold text-xs border border-blue-400/30 shadow-xs hover:border-blue-400/50 hover:bg-blue-900/60 transition-colors">
                  <span className="material-symbols-outlined text-[15px] text-sky-400">
                    code
                  </span>
                  Web Development (ASP.NET & JS)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/75 text-sky-100 font-semibold text-xs border border-blue-400/30 shadow-xs hover:border-blue-400/50 hover:bg-blue-900/60 transition-colors">
                  <span className="material-symbols-outlined text-[15px] text-sky-400">
                    computer
                  </span>
                  Windows Server & Linux
                </span>
              </div>
            </div>

            {/* Architectural Highlight Card Inside Bio */}
            <div className="bg-[#06183B]/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center justify-between border border-blue-400/25 shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-full bg-blue-900/80 border border-blue-400/30 flex items-center justify-center text-sky-300 flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-xs sm:text-sm font-semibold text-white truncate">
                    Academic & Professional Foundation
                  </span>
                  <span className="font-label-sm text-xs text-blue-200/80 truncate">
                    B.Sc. in IT (AAU) • Oracle 11g DBA • Cisco CCNA
                  </span>
                </div>
              </div>
              <span className="font-label-sm text-xs font-bold text-sky-400 uppercase tracking-widest bg-sky-400/10 px-2.5 py-1 rounded-full border border-sky-400/30 flex-shrink-0">
                Certified
              </span>
            </div>

            {/* Direct Discovery Navigation Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-blue-950/90 to-blue-900/80 hover:from-blue-900/90 hover:to-blue-800/80 border border-blue-400/25 text-white font-semibold text-xs sm:text-sm transition-all shadow-md group cursor-pointer text-left"
                data-path="executive-experience"
                onClick={() => setActiveTab('experience')}
                type="button"
              >
                <span className="truncate">Experience Timeline</span>
                <span className="material-symbols-outlined text-[18px] text-sky-400 group-hover:translate-x-1 transition-transform flex-shrink-0">
                  arrow_forward
                </span>
              </button>
              <button
                className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-blue-950/90 to-blue-900/80 hover:from-blue-900/90 hover:to-blue-800/80 border border-blue-400/25 text-white font-semibold text-xs sm:text-sm transition-all shadow-md group cursor-pointer text-left"
                data-path="competency-matrix"
                onClick={onNavigateToCredentials}
                type="button"
              >
                <span className="truncate">View Certifications</span>
                <span className="material-symbols-outlined text-[18px] text-amber-400 group-hover:translate-x-1 transition-transform flex-shrink-0">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Unobtrusive Public Portfolio Footer Seamlessly Integrated */}
        <footer className="relative z-10 px-5 sm:px-8 md:px-10 pt-6 pb-8 border-t border-blue-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-200/70">
          <span>
            © {new Date().getFullYear()} {siteSettings?.footerCopyright || `${profile.fullName} • ${siteSettings?.footerText || 'System Support & Database Administration'}`}
          </span>
          <button
            type="button"
            onClick={onOpenAdminLogin || (() => setActiveTab('login'))}
            id="footer-admin-login-link"
            className="inline-flex items-center gap-1.5 text-blue-300/80 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-blue-900/40 border border-transparent hover:border-blue-700/40"
            title="Administrator Login"
          >
            <span className="material-symbols-outlined text-[14px] text-sky-400">lock</span>
            <span>Admin Login</span>
          </button>
        </footer>
      </div>
    </div>
  );
};
