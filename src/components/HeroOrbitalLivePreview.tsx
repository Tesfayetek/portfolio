/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { HeroTechnologyIcon } from '../types';
import { TechSkillIcon } from './TechSkillIcon';
import {
  calculateOrbitalCoordinates,
  STANDARD_ORBITAL_POSITIONS,
  POSITION_ANGLES,
} from '../utils/orbitalPositionUtils';

interface HeroOrbitalLivePreviewProps {
  avatarUrl?: string;
  fullName?: string;
  icons: HeroTechnologyIcon[];
  activeEditingIcon?: HeroTechnologyIcon | null;
  onSelectIcon?: (icon: HeroTechnologyIcon) => void;
  showGuides?: boolean;
}

export const HeroOrbitalLivePreview: React.FC<HeroOrbitalLivePreviewProps> = ({
  avatarUrl = '',
  fullName = 'Hero Profile',
  icons,
  activeEditingIcon,
  onSelectIcon,
  showGuides = true,
}) => {
  const hasAvatar = Boolean(avatarUrl && avatarUrl.trim().length > 0);

  // Merge the active editing icon dynamically into the preview list if provided
  const displayIcons = useMemo(() => {
    const list = [...icons];
    if (activeEditingIcon) {
      const idx = list.findIndex((i) => i.id === activeEditingIcon.id);
      if (idx >= 0) {
        list[idx] = { ...activeEditingIcon };
      } else {
        list.push({ ...activeEditingIcon });
      }
    }
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  }, [icons, activeEditingIcon]);

  // Track position collision count for slight spread if multiple icons share position
  const positionOccurrences: Record<string, number> = {};

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-br from-[#040D1F] via-[#091E44] to-[#123974] p-5 sm:p-7 border border-blue-900/50 shadow-xl overflow-hidden select-none">
      {/* Background Decorative Tech Grid & Subtle Circuit Aura */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.15),transparent_70%)]" />

      {/* Header bar inside preview */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-blue-800/40 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-white tracking-wide uppercase text-[11px] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-sky-400">satellite_alt</span>
            Live Orbital Positioning Preview
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-sky-200/80">
          <span className="hidden sm:inline">Active Icons:</span>
          <strong className="text-white font-semibold">{displayIcons.filter((i) => i.enabled).length} Enabled</strong>
          {activeEditingIcon && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-medium text-[10px]">
              Editing: {activeEditingIcon.name || 'New Icon'}
            </span>
          )}
        </div>
      </div>

      {/* The Central Orbital Stage */}
      <div className="relative flex items-center justify-center w-full max-w-[420px] sm:max-w-[480px] md:max-w-[540px] aspect-square mx-auto my-2">
        {/* Subtle Orbital Ellipse Guide Ring */}
        {showGuides && (
          <div className="absolute inset-[6%] rounded-full border border-sky-400/25 pointer-events-none border-dashed animate-[spin_120s_linear_infinite]" />
        )}
        {showGuides && (
          <div className="absolute inset-[18%] rounded-full border border-sky-400/15 pointer-events-none" />
        )}

        {/* 8 Cardinal / Intermediate Compass Marks on the orbital ring */}
        {showGuides && (
          <div className="absolute inset-0 pointer-events-none">
            {STANDARD_ORBITAL_POSITIONS.map((pos) => {
              const angle = POSITION_ANGLES[pos];
              const rad = (angle * Math.PI) / 180;
              const leftPct = 50 + Math.sin(rad) * 47;
              const topPct = 50 - Math.cos(rad) * 47;
              return (
                <div
                  key={pos}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-[9px] font-mono text-sky-300/40 select-none"
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                >
                  {angle}°
                </div>
              );
            })}
          </div>
        )}

        {/* Center Hero Profile Image */}
        <div className="relative z-10 w-[140px] sm:w-[170px] md:w-[200px] aspect-[3/4] flex items-center justify-center pointer-events-none">
          {hasAvatar ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-full h-full object-contain filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
            />
          ) : (
            <div className="w-full h-full rounded-2xl border-2 border-dashed border-sky-400/30 flex flex-col items-center justify-center p-3 text-center bg-blue-950/40 text-sky-300">
              <span className="material-symbols-outlined text-[36px] text-sky-400/70 mb-1">
                account_circle
              </span>
              <span className="text-[11px] font-medium leading-tight text-white/90">
                Hero Image Center
              </span>
              <span className="text-[9px] text-sky-300/70 mt-0.5">Orbital Anchor</span>
            </div>
          )}
        </div>

        {/* Dynamic Orbital Technology Icons */}
        <div className="absolute inset-0 pointer-events-none">
          {displayIcons.map((icon, idx) => {
            const isEditing = activeEditingIcon?.id === icon.id;
            const posKey = icon.position === 'Custom' ? `c_${icon.customAngle || 0}` : icon.position;
            const occ = positionOccurrences[posKey] || 0;
            positionOccurrences[posKey] = occ + 1;

            const coords = calculateOrbitalCoordinates(
              icon.position,
              icon.customAngle,
              icon.customDistance ?? 100,
              occ
            );

            const displayLabel =
              icon.position === 'Custom'
                ? `${icon.name || 'Icon'} (${Math.round(coords.effectiveAngle)}°)`
                : `${icon.name || 'Icon'} (${icon.position})`;

            return (
              <div
                key={icon.id || idx}
                onClick={() => onSelectIcon?.(icon)}
                className={`absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20 ${
                  onSelectIcon ? 'cursor-pointer' : ''
                }`}
                style={{
                  left: `${coords.leftPct}%`,
                  top: `${coords.topPct}%`,
                }}
                title={`Click to edit: ${displayLabel} • ${coords.effectiveDistance}% distance`}
              >
                <div
                  className={`group relative flex flex-col items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-300 ${
                    isEditing
                      ? 'bg-amber-400 ring-4 ring-amber-400/40 shadow-[0_0_24px_rgba(251,191,36,0.8)] scale-115 z-30'
                      : icon.enabled
                      ? 'bg-white shadow-[0_4px_16px_rgba(3,42,86,0.35)] hover:scale-110 hover:shadow-[0_0_18px_rgba(56,189,248,0.6)]'
                      : 'bg-slate-300/80 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  {/* Icon Thumbnail */}
                  {icon.imageUrl && icon.imageUrl.trim().length > 0 ? (
                    <img
                      src={icon.imageUrl}
                      alt={icon.name}
                      className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                    />
                  ) : (
                    <TechSkillIcon
                      skillName={icon.name}
                      className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                    />
                  )}

                  {/* Icon Label Badge */}
                  <span
                    className={`absolute -bottom-4.5 whitespace-nowrap text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs border transition-all ${
                      isEditing
                        ? 'bg-amber-500 text-slate-950 border-amber-300 ring-1 ring-amber-400'
                        : 'bg-slate-900/90 text-white border-slate-700'
                    }`}
                  >
                    {icon.name || 'Untitled'}
                  </span>

                  {/* Position coordinates indicator */}
                  <span
                    className={`absolute -top-3.5 text-[8px] font-mono px-1 rounded transition-opacity ${
                      isEditing
                        ? 'opacity-100 bg-amber-400/90 text-slate-950 font-bold'
                        : 'opacity-0 group-hover:opacity-100 bg-sky-950 text-sky-300 border border-sky-500/30'
                    }`}
                  >
                    {Math.round(coords.effectiveAngle)}°
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Instructions / Legend */}
      <div className="relative z-10 mt-3 pt-2.5 border-t border-blue-800/40 flex flex-wrap items-center justify-between text-[11px] text-sky-200/70 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
            <span>Configured</span>
          </span>
          {activeEditingIcon && (
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Current Selection ({activeEditingIcon.position})</span>
            </span>
          )}
        </div>
        <span className="text-[10px] text-sky-300/60">
          Center: Hero Profile • 0°: Top (Apex) • 90°: Right • 180°: Bottom • 270°: Left
        </span>
      </div>
    </div>
  );
};
