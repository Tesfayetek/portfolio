import React, { useState } from 'react';
import {
  ExperienceRecord,
  EducationRecord,
  CertificationRecord,
  MetricBenchmark,
} from '../types';
import {
  INITIAL_EXPERIENCE,
  INITIAL_EDUCATION,
  INITIAL_CERTIFICATIONS,
} from '../data/portfolioData';

interface ExperienceViewProps {
  benchmarks: MetricBenchmark;
  initialTab?: 'experience' | 'education' | 'certifications';
  experience?: ExperienceRecord[];
  education?: EducationRecord[];
  certifications?: CertificationRecord[];
}

export const ExperienceView: React.FC<ExperienceViewProps> = ({
  benchmarks,
  initialTab = 'experience',
  experience,
  education,
  certifications,
}) => {
  const activeExperience = (experience || INITIAL_EXPERIENCE).filter((e) => e.published !== false);
  const activeEducation = (education || INITIAL_EDUCATION).filter((e) => e.published !== false);
  const activeCertifications = (certifications || INITIAL_CERTIFICATIONS).filter((c) => c.published !== false);

  const [selectedTrack, setSelectedTrack] = useState<'experience' | 'education' | 'certifications'>(
    initialTab
  );
  const [expandedDeliverables, setExpandedDeliverables] = useState<Record<string, boolean>>({
    exp_01: true,
    exp_02: true,
    exp_03: true,
    exp_04: true,
    exp_05: true,
  });

  const toggleDeliverables = (id: string) => {
    setExpandedDeliverables((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAllDeliverables = () => {
    const allExpanded = Object.values(expandedDeliverables).every(Boolean);
    const updated: Record<string, boolean> = {};
    activeExperience.forEach((item) => {
      updated[item.id] = !allExpanded;
    });
    setExpandedDeliverables(updated);
  };

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-300">
      {/* Executive Overview Snapshot Header */}
      <section className="px-margin-sm pt-space-md pb-space-sm flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-accent-bronze font-bold tracking-widest uppercase">
            Executive Career Record
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Active Leadership Dossier
          </span>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs border border-border-subtle/50 flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-slate-cool">Executive Tenor</span>
            <span className="font-label-md text-label-md text-primary font-semibold">
              {benchmarks.years} Enterprise Delivery
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-xl-mobile text-headline-xl-mobile text-primary font-bold tracking-tight">
              {benchmarks.governedValue}
            </span>
            <span className="font-body-sm text-body-sm text-slate-cool">
              Cumulative Transformation Value Governed
            </span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-secondary h-full rounded-full transition-all duration-700" style={{ width: '88%' }} />
          </div>
        </div>
      </section>

      {/* Interactive Segmented Controller */}
      <section className="sticky top-16 z-40 bg-surface/95 backdrop-blur-md px-margin-sm py-space-xs">
        <div
          aria-label="Career Dimensions"
          className="p-1 rounded-xl bg-surface-container-high flex items-center justify-between"
          role="tablist"
        >
          <button
            aria-selected={selectedTrack === 'experience'}
            className={`flex-1 py-2 text-center rounded-lg font-label-md text-label-md font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedTrack === 'experience'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            onClick={() => setSelectedTrack('experience')}
            role="tab"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">business_center</span>
            <span>Experience</span>
          </button>
          <button
            aria-selected={selectedTrack === 'education'}
            className={`flex-1 py-2 text-center rounded-lg font-label-md text-label-md font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedTrack === 'education'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            onClick={() => setSelectedTrack('education')}
            role="tab"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">school</span>
            <span>Education</span>
          </button>
          <button
            aria-selected={selectedTrack === 'certifications'}
            className={`flex-1 py-2 text-center rounded-lg font-label-md text-label-md font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedTrack === 'certifications'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            onClick={() => setSelectedTrack('certifications')}
            role="tab"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Credentials</span>
          </button>
        </div>
      </section>

      {/* TAB PANELS */}
      <div className="px-margin-sm pt-space-sm pb-space-xl flex flex-col">
        {/* 1. EXPERIENCE TIMELINE */}
        {selectedTrack === 'experience' && (
          <div className="flex flex-col gap-space-lg animate-in fade-in" id="panel-experience">
            <div className="flex items-center justify-between px-1">
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                Professional Experience
              </span>
              <button
                className="text-xs font-semibold px-2.5 py-1 rounded-md bg-surface-container-high text-primary hover:bg-surface-container transition-colors cursor-pointer inline-flex items-center gap-1"
                onClick={toggleAllDeliverables}
                type="button"
              >
                <span className="material-symbols-outlined text-[15px] text-secondary">
                  {Object.values(expandedDeliverables).every(Boolean) ? 'unfold_less' : 'unfold_more'}
                </span>
                <span>
                  {Object.values(expandedDeliverables).every(Boolean) ? 'Collapse All' : 'Expand All'}
                </span>
              </button>
            </div>

            <div className="relative pl-6 flex flex-col gap-space-lg">
              {/* Structural Timeline Rule */}
              <div className="absolute left-2.5 top-3 bottom-4 w-0.5 bg-surface-container-highest" />

              {activeExperience.map((item) => (
                <article
                  key={item.id}
                  className="relative flex flex-col gap-space-sm"
                  data-doc-id={item.id}
                >
                  {/* Timeline bullet dot */}
                  <div
                    className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full flex items-center justify-center shadow-xs ${
                      item.active ? 'bg-primary' : 'bg-surface-container-highest'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.active ? 'bg-secondary-fixed' : 'bg-slate-cool'
                      }`}
                    />
                  </div>

                  <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs border border-border-subtle/50 flex flex-col gap-space-sm">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold tracking-wide ${
                            item.active
                              ? 'bg-secondary/10 text-secondary'
                              : 'bg-surface-container text-slate-deep'
                          }`}
                        >
                          {item.period}
                        </span>
                        <span className="flex items-center text-slate-cool font-label-sm text-label-sm gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            location_on
                          </span>
                          {item.location}
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-primary font-bold mt-1">
                        {item.role}
                      </h3>
                      <p className="font-label-md text-label-md text-accent-bronze font-semibold">
                        {item.company}
                      </p>
                    </div>

                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      {item.summary}
                    </p>


                    {/* Deliverables toggle */}
                    {item.deliverables && item.deliverables.length > 0 && (
                      <div>
                        <button
                          className="w-full mt-1 py-2 px-3 rounded-lg bg-surface-container-high text-primary hover:bg-surface-container flex items-center justify-between transition-colors cursor-pointer"
                          onClick={() => toggleDeliverables(item.id)}
                          type="button"
                        >
                          <span className="font-label-sm text-label-sm font-semibold flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-accent-bronze">
                              task_alt
                            </span>
                            Key Responsibilities & Deliverables ({item.deliverables.length})
                          </span>
                          <span
                            className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                              expandedDeliverables[item.id] ? 'rotate-180' : ''
                            }`}
                          >
                            expand_more
                          </span>
                        </button>

                        {expandedDeliverables[item.id] && (
                          <div className="flex flex-col gap-2 pt-2 border-t-0 animate-in fade-in">
                            {item.deliverables.map((deliv, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 p-2 rounded-lg bg-surface-container-lowest border border-border-subtle/40"
                              >
                                <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5 flex-shrink-0">
                                  check_circle
                                </span>
                                <span className="font-body-sm text-body-sm text-on-surface">
                                  {deliv}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* 2. EDUCATION SECTION */}
        {selectedTrack === 'education' && (
          <div className="flex flex-col gap-space-md animate-in fade-in" id="panel-education">
            <div className="flex items-center justify-between mb-1">
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                Academic Foundation
              </span>
              <span className="font-label-sm text-label-sm text-slate-cool uppercase">
                Accredited Degrees
              </span>
            </div>

            {activeEducation.map((edu) => (
              <div
                key={edu.id}
                className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs border border-border-subtle/50 flex flex-col gap-space-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined text-[24px]">account_balance</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-bold">
                    {edu.degree}
                  </span>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-headline-sm text-headline-sm text-primary font-bold">
                    {edu.field}
                  </h4>
                  <span className="font-label-md text-label-md text-slate-cool mt-0.5">
                    {edu.institution}
                  </span>
                  <span className="font-label-sm text-label-sm text-accent-bronze font-semibold mt-1">
                    {edu.honors}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-slate-cool font-medium">
                    Academic & Technical Curriculum
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface">
                    {edu.researchFocus}
                  </p>
                </div>
              </div>
            ))}

            {/* Academic Board Notice */}
            <div className="p-space-md rounded-xl bg-surface-container-high flex items-center gap-space-sm border border-border-subtle/50">
              <span className="material-symbols-outlined text-primary text-[28px] flex-shrink-0">
                verified_user
              </span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md font-semibold text-primary">
                  Official Academic Records Registered
                </span>
                <span className="font-label-sm text-label-sm text-slate-cool">
                  Original transcripts & diplomas validated under global apostille verification protocols.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. CERTIFICATIONS SECTION */}
        {selectedTrack === 'certifications' && (
          <div className="flex flex-col gap-space-md animate-in fade-in" id="panel-certifications">
            <div className="flex items-center justify-between mb-1">
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                Professional Credentials
              </span>
              <span className="font-label-sm text-label-sm text-secondary font-bold">
                {activeCertifications.length} Verified Active
              </span>
            </div>

            <div className="flex flex-col gap-space-sm">
              {activeCertifications.map((cert) => (
                <article
                  key={cert.id}
                  className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs border border-border-subtle/50 flex flex-col gap-space-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-space-xs">
                      <div className="w-9 h-9 rounded-lg bg-surface-container-high text-primary flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[20px]">
                          {cert.icon}
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h4 className="font-headline-sm text-headline-sm text-primary font-bold truncate">
                          {cert.title}
                        </h4>
                        <span className="font-label-sm text-label-sm text-accent-bronze font-semibold">
                          {cert.level}
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-semibold">
                      {cert.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-slate-cool">
                        Credential Identifier
                      </span>
                      <span className="font-label-md text-label-md text-on-surface font-semibold font-mono">
                        {cert.credentialId}
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-label-sm text-label-sm text-slate-cool">
                        Valid Period
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface">
                        {cert.period}
                      </span>
                    </div>
                  </div>

                  <a
                    className="mt-1 py-2 px-3 rounded-lg bg-surface-container-high text-primary hover:bg-surface-container flex items-center justify-center gap-1.5 font-label-sm text-label-sm font-semibold transition-colors"
                    href={cert.verifyUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Verify {cert.title}</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
