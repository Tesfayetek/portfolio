import React, { useState } from 'react';
import { CaseStudy, SkillDomain } from '../types';
import { SKILL_DOMAINS, CASE_STUDIES, AWARDS } from '../data/portfolioData';

interface SkillsViewProps {
  onSelectCaseStudy: (caseStudy: CaseStudy) => void;
  onOpenContact: () => void;
  onDownloadCv: () => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({
  onSelectCaseStudy,
  onOpenContact,
  onDownloadCv,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'tech' | 'mgmt' | 'biz' | 'tools'>('all');

  const filteredDomains: SkillDomain[] =
    selectedFilter === 'all'
      ? SKILL_DOMAINS
      : SKILL_DOMAINS.filter((d) => d.id === selectedFilter);

  return (
    <div className="flex flex-col w-full pb-10 animate-in fade-in duration-300">
      <div className="px-gutter-sm pt-space-md flex flex-col gap-space-lg">
        {/* Executive Competency Dossier Header Card */}
        <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-border-subtle/50">
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-surface-container-high/40 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-space-sm relative z-10">
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary w-fit mb-2">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                  Strategic Dossier
                </span>
              </div>
              <h2 className="font-headline-xl-mobile text-headline-xl-mobile text-primary tracking-tight font-bold">
                Skills Matrix & Key Case Studies
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-[26px]">account_tree</span>
            </div>
          </div>
          <p className="font-body-md text-body-md text-slate-cool mt-3 relative z-10">
            Calibrated technical mastery across enterprise distributed backbones, large-scale organizational modernization, and high-impact fintech modernization.
          </p>

          {/* Competence Legend / Indicator Micro-Bar */}
          <div className="flex items-center gap-space-md pt-4 mt-4 border-none bg-surface-container-low/70 p-3 rounded-lg">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                Expert Cadre
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                Advanced Leadership
              </span>
            </div>
            <div className="ml-auto text-slate-cool flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span className="font-label-sm text-label-sm">Audited 2024</span>
            </div>
          </div>
        </div>

        {/* Section: Skills Architecture */}
        <div className="flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-5 rounded-full bg-primary" />
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                Competency Matrix
              </h3>
            </div>
            <span className="font-label-sm text-label-sm text-slate-cool">4 Core Domains</span>
          </div>

          {/* Category Filter Pills (Interactive Micro UX) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5" id="skill-filter-bar">
            {[
              { id: 'all', label: 'All Domains' },
              { id: 'tech', label: 'Technology' },
              { id: 'mgmt', label: 'Management' },
              { id: 'biz', label: 'Business Strategy' },
              { id: 'tools', label: 'Tools & Stack' },
            ].map((tab) => {
              const isActive = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`skill-tab px-3.5 py-1.5 rounded-full font-label-sm text-label-sm transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'font-semibold bg-primary text-on-primary shadow-xs'
                      : 'font-medium bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                  }`}
                  onClick={() => setSelectedFilter(tab.id as typeof selectedFilter)}
                  type="button"
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Domain Groups */}
          <div className="space-y-space-md">
            {filteredDomains.map((domain) => (
              <div
                key={domain.id}
                className="skill-group bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-border-subtle/50 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-primary">
                      {domain.icon}
                    </span>
                    <span className="font-label-lg text-label-lg text-primary font-bold">
                      {domain.title}
                    </span>
                  </div>
                  <span
                    className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold ${domain.tierClass}`}
                  >
                    {domain.tierBadge}
                  </span>
                </div>

                {domain.id === 'tools' ? (
                  /* 2-column grid for Tools */
                  <div className="grid grid-cols-2 gap-2">
                    {domain.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low"
                      >
                        <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                          {skill.name}
                        </span>
                        <span
                          className={`font-label-sm text-label-sm px-2 py-0.5 rounded ${
                            skill.level === 'Expert'
                              ? 'bg-primary text-on-primary'
                              : 'bg-secondary-container text-on-secondary-container'
                          }`}
                        >
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Flex wrap for other domains */
                  <div className="flex flex-wrap gap-2">
                    {domain.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors"
                      >
                        <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                          {skill.name}
                        </span>
                        <span
                          className={`font-label-sm text-label-sm px-1.5 py-0.5 rounded ${
                            skill.level === 'Expert'
                              ? 'bg-primary text-on-primary'
                              : 'bg-secondary-container text-on-secondary-container'
                          }`}
                        >
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section: Case Studies & Projects Grid */}
        <div className="flex flex-col gap-space-md pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-5 rounded-full bg-secondary" />
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                Featured Case Studies
              </h3>
            </div>
            <span className="font-label-sm text-label-sm text-slate-cool font-medium">
              3 Flagship Milestones
            </span>
          </div>

          {/* Project Cards */}
          <div className="space-y-space-md">
            {CASE_STUDIES.map((project) => (
              <div
                key={project.id}
                className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-xs border border-border-subtle/50 flex flex-col group hover:shadow-md transition-shadow"
              >
                <div className="relative h-44 w-full bg-surface-container overflow-hidden">
                  <img
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={project.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/35 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur text-primary font-label-sm text-label-sm font-bold shadow-xs">
                      {project.role}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-md bg-primary text-on-primary font-label-sm text-label-sm font-semibold">
                      {project.year}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="font-label-sm text-label-sm tracking-wide text-primary-fixed uppercase font-semibold">
                      {project.domain}
                    </span>
                    <h4 className="font-headline-sm text-headline-sm text-white font-bold leading-tight drop-shadow-xs mt-0.5">
                      {project.title}
                    </h4>
                  </div>
                </div>

                <div className="p-space-md flex flex-col gap-3">
                  <p className="font-body-sm text-body-sm text-slate-cool">
                    {project.summary}
                  </p>

                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.techTags.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div className={`flex items-center gap-1.5 ${project.kpiHighlight.colorClass}`}>
                      <span className="material-symbols-outlined text-[18px]">
                        {project.kpiHighlight.icon}
                      </span>
                      <span className="font-label-sm text-label-sm font-bold">
                        {project.kpiHighlight.text}
                      </span>
                    </div>
                    <button
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-secondary transition-all shadow-xs cursor-pointer active:scale-95"
                      onClick={() => onSelectCaseStudy(project)}
                      type="button"
                    >
                      <span>View Case Study</span>
                      <span className="material-symbols-outlined text-[16px]">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Executive Honors & Industry Accolades */}
        <div className="flex flex-col gap-space-sm pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-5 rounded-full bg-accent-bronze" />
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                Industry Recognition
              </h3>
            </div>
            <span className="font-label-sm text-label-sm text-slate-cool">Peer Endorsed</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {AWARDS.map((award) => (
              <div
                key={award.id}
                className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-border-subtle/50 flex items-start gap-3.5"
              >
                <div
                  className={`w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center shrink-0 ${award.colorClass}`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {award.icon}
                  </span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-label-sm text-label-sm font-bold uppercase ${award.colorClass}`}>
                      {award.conferrer}
                    </span>
                    <span className="font-label-sm text-label-sm text-slate-cool font-medium">
                      {award.year}
                    </span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-primary font-bold text-base leading-snug mt-0.5">
                    {award.title}
                  </h4>
                  <p className="font-body-sm text-body-sm text-slate-cool mt-1">
                    {award.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Call To Action Dock */}
        <div className="bg-primary text-on-primary rounded-xl p-space-lg shadow-md flex flex-col gap-4 mt-2 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-secondary-container/20 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px] text-primary-fixed">
                contact_mail
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-semibold">
                Direct Board Collaboration
              </span>
              <h4 className="font-headline-sm text-headline-sm text-white font-bold leading-tight">
                Engage with Tesfaye Teklu
              </h4>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-slate-dim relative z-10 leading-relaxed">
            Review comprehensive career metrics, verifiable references, and leadership dossiers, or schedule an executive advisory session.
          </p>
          <div className="flex flex-col gap-2.5 pt-1 relative z-10">
            <button
              className="w-full flex items-center justify-center gap-2 py-3 px-space-md rounded-lg bg-on-primary text-primary font-label-lg text-label-lg font-bold shadow-sm hover:bg-surface-container-low transition-colors cursor-pointer"
              onClick={onOpenContact}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>Schedule Executive Discussion</span>
            </button>
            <button
              className="w-full flex items-center justify-center gap-2 py-3 px-space-md rounded-lg bg-primary-container text-white font-label-lg text-label-lg font-semibold hover:bg-primary-container/80 transition-colors cursor-pointer"
              onClick={onDownloadCv}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">description</span>
              <span>View Official Curriculum Vitae</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
