import React, { useState } from 'react';
import { TechSkillIcon } from './TechSkillIcon';
import { HeroTechnologyIcon, HeroIconPosition } from '../types';
import { calculateOrbitalCoordinates } from '../utils/orbitalPositionUtils';

interface HeroOrbitalSkillsProps {
  avatarUrl?: string;
  fullName: string;
  skills?: string[];
  heroTechnologyIcons?: HeroTechnologyIcon[];
}

export const HeroOrbitalSkills: React.FC<HeroOrbitalSkillsProps> = ({
  avatarUrl = '',
  fullName,
  skills = [],
  heroTechnologyIcons,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Determine active avatar and image presence
  const activeAvatar = (avatarUrl || '').trim();
  const hasImage = activeAvatar.length > 0;

  // Use configured hero technology icons if provided; otherwise fallback to skills list
  const activeIcons = React.useMemo<HeroTechnologyIcon[]>(() => {
    if (heroTechnologyIcons && heroTechnologyIcons.length > 0) {
      return heroTechnologyIcons
        .filter((icon) => icon.enabled)
        .sort((a, b) => a.displayOrder - b.displayOrder);
    }

    // Default fallback when icons are not yet configured
    const defaultPositions: HeroIconPosition[] = [
      'Top',
      'Top Right',
      'Right',
      'Bottom Right',
      'Bottom',
      'Bottom Left',
      'Left',
      'Top Left',
    ];

    return skills.slice(0, 8).map((skillName, index) => ({
      id: `default_${index}`,
      name: skillName,
      imageUrl: '',
      position: defaultPositions[index % defaultPositions.length],
      customAngle: undefined,
      customDistance: 100,
      displayOrder: index + 1,
      enabled: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));
  }, [heroTechnologyIcons, skills]);

  // Track position collision count for slight spread if multiple icons share position
  const positionOccurrences: Record<string, number> = {};

  return (
    <>
      <div
        aria-label="Profile portrait with orbiting technical skills"
        className="relative flex items-center justify-center w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[560px] xl:max-w-[620px] py-6 sm:py-8 md:py-12 mx-auto select-none min-h-[320px] sm:min-h-[380px] md:min-h-[460px]"
      >
        {/* Orbiting Technology Skill Icons */}
        <div className="absolute inset-0 pointer-events-none">
          {activeIcons.map((icon, index) => {
            const posKey = icon.position === 'Custom' ? `custom_${icon.customAngle || 0}` : icon.position;
            const occ = positionOccurrences[posKey] || 0;
            positionOccurrences[posKey] = occ + 1;

            const coords = calculateOrbitalCoordinates(
              icon.position,
              icon.customAngle,
              icon.customDistance ?? 100,
              occ
            );

            // Staggered animation delay for continuous, gentle floating motion
            const delaySeconds = -((index * 2.2) % 16);

            const positionDisplay =
              icon.position === 'Custom'
                ? `Custom (${Math.round(coords.effectiveAngle)}°, ${coords.effectiveDistance}%)`
                : icon.position;

            return (
              <div
                key={icon.id || `${icon.name}-${index}`}
                className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 animate-orbital-swing z-20"
                style={{
                  left: `${coords.leftPct}%`,
                  top: `${coords.topPct}%`,
                  animationDelay: `${delaySeconds}s`,
                }}
              >
                <div
                  className="group relative flex flex-col items-center justify-center w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full bg-surface-container-lowest/95 backdrop-blur-md border border-secondary/35 shadow-[0_4px_16px_rgba(3,42,86,0.18)] hover:shadow-[0_6px_24px_rgba(29,78,216,0.4)] hover:border-secondary transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
                  title={`${icon.name} • ${positionDisplay}`}
                >
                  {/* Tech Logo or Uploaded Image */}
                  {icon.imageUrl && icon.imageUrl.trim().length > 0 ? (
                    <img
                      alt={icon.name}
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 object-contain transition-transform group-hover:scale-105"
                      src={icon.imageUrl}
                    />
                  ) : (
                    <TechSkillIcon
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 object-contain transition-transform group-hover:scale-105"
                      skillName={icon.name}
                    />
                  )}

                  {/* Skill Name Label */}
                  <span className="absolute -bottom-4 sm:-bottom-5 opacity-90 group-hover:opacity-100 text-[8px] sm:text-[9px] md:text-[10px] font-semibold text-primary px-1.5 py-0.5 rounded-full bg-surface-container-high/95 backdrop-blur border border-border-subtle/70 shadow-xs whitespace-nowrap pointer-events-none transition-all scale-95 group-hover:scale-100 max-w-[90px] sm:max-w-[120px] truncate text-center">
                    {icon.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Uploaded Hero Image - Appears directly in the hero section without a placeholder frame, card, or border */}
        {hasImage && (
          <div className="relative z-10 w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] xl:w-[360px] aspect-[3/4] max-w-[600px] max-h-[800px] flex items-center justify-center">
            <img
              alt={`${fullName} Executive Portrait`}
              className="w-full h-full object-contain select-none transition-transform duration-500 hover:scale-[1.02] cursor-pointer"
              src={activeAvatar}
              onClick={() => setIsPreviewOpen(true)}
              title="Click to view full portrait"
              style={{
                aspectRatio: '3/4',
                maxWidth: '600px',
                maxHeight: '800px',
              }}
            />
          </div>
        )}
      </div>

      {/* Lightbox Full-Size Portrait Modal (600 × 800 px Preview) */}
      {isPreviewOpen && hasImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="relative max-w-[600px] w-full max-h-[90vh] bg-surface-container-lowest rounded-3xl p-4 sm:p-6 shadow-2xl border border-border-subtle flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-border-subtle">
              <div>
                <h3 className="text-sm font-bold text-primary">{fullName}</h3>
                <span className="text-xs text-secondary font-medium">
                  Hero Profile Image (3:4 Aspect Ratio • Max 600 × 800 px)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-slate-cool hover:text-primary transition-colors cursor-pointer"
                aria-label="Close Preview"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="w-full max-w-[500px] aspect-[3/4] max-h-[700px] rounded-2xl overflow-hidden bg-surface-container-low border border-border-subtle flex items-center justify-center p-1">
              <img
                src={activeAvatar}
                alt={fullName}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
