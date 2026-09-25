import React from 'react';
import { CaseStudy } from '../types';

interface CaseStudyModalProps {
  caseStudy: CaseStudy | null;
  onClose: () => void;
  onContactClick: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  caseStudy,
  onClose,
  onContactClick
}) => {
  if (!caseStudy) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-deep/60 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-border-subtle max-h-[90vh] flex flex-col">
        {/* Hero banner */}
        {caseStudy.image && caseStudy.image.trim().length > 0 ? (
          <div className="relative h-48 w-full bg-surface-container flex-shrink-0">
            <img
              src={caseStudy.image}
              alt={caseStudy.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />
            
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur text-primary font-label-sm text-label-sm font-bold shadow-xs">
                {caseStudy.role}
              </span>
              <span className="px-2 py-1 rounded-md bg-primary text-on-primary font-label-sm text-label-sm font-semibold">
                {caseStudy.year}
              </span>
            </div>

            <div className="absolute bottom-3 left-4 right-4 text-white">
              <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-semibold">
                {caseStudy.domain}
              </span>
              <h3 className="font-headline-sm text-headline-sm text-white font-bold leading-tight drop-shadow-xs mt-0.5">
                {caseStudy.title}
              </h3>
            </div>
          </div>
        ) : (
          <div className="p-space-lg pb-space-sm border-b border-border-subtle flex-shrink-0 bg-surface-container-lowest">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary font-label-sm text-label-sm font-bold">
                  {caseStudy.role}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                  {caseStudy.year}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-surface-container text-slate-cool hover:text-primary flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
                {caseStudy.domain}
              </span>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold leading-tight mt-0.5">
                {caseStudy.title}
              </h3>
            </div>
          </div>
        )}

        {/* Content body */}
        <div className="p-space-lg overflow-y-auto no-scrollbar space-y-space-md flex-1">
          {/* Key Metric Badge */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
            <span className="font-label-sm text-label-sm text-slate-cool font-semibold uppercase">
              Core Verified Impact
            </span>
            <div className={`flex items-center gap-1.5 font-bold font-label-md ${caseStudy.kpiHighlight.colorClass}`}>
              <span className="material-symbols-outlined text-[18px]">
                {caseStudy.kpiHighlight.icon}
              </span>
              <span>{caseStudy.kpiHighlight.text}</span>
            </div>
          </div>

          {/* Executive Overview */}
          <div>
            <h4 className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider mb-1">
              Executive Briefing
            </h4>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed">
              {caseStudy.summary}
            </p>
          </div>

          {/* Strategic Impact Highlights */}
          {caseStudy.detailedImpact && (
            <div>
              <h4 className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider mb-2">
                Strategic Deliverables & Architecture
              </h4>
              <ul className="space-y-2">
                {caseStudy.detailedImpact.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-on-surface-variant font-body-sm">
                    <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5 flex-shrink-0">
                      check_circle
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technology & Frameworks */}
          <div>
            <h4 className="font-label-md text-label-md text-slate-cool font-semibold uppercase tracking-wider mb-2">
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {caseStudy.techTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-surface-container-high text-primary font-label-sm text-label-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-space-md bg-surface-container-low border-t border-border-subtle flex items-center justify-between gap-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-surface-container text-primary font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors"
          >
            Close Dossier
          </button>
          <button
            onClick={() => {
              onClose();
              onContactClick();
            }}
            className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-secondary transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">mail</span>
            <span>Discuss Initiative</span>
          </button>
        </div>
      </div>
    </div>
  );
};
