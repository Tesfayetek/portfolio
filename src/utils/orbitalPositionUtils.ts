/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HeroIconPosition, HeroTechnologyIcon } from '../types';

export type StandardOrbitalPosition =
  | 'Top'
  | 'Top Right'
  | 'Right'
  | 'Bottom Right'
  | 'Bottom'
  | 'Bottom Left'
  | 'Left'
  | 'Top Left';

export const STANDARD_ORBITAL_POSITIONS: StandardOrbitalPosition[] = [
  'Top',
  'Top Right',
  'Right',
  'Bottom Right',
  'Bottom',
  'Bottom Left',
  'Left',
  'Top Left',
];

/**
 * Standard angles in degrees (0° = 12 o'clock / Top, clockwise)
 */
export const POSITION_ANGLES: Record<StandardOrbitalPosition, number> = {
  Top: 0,
  'Top Right': 45,
  Right: 90,
  'Bottom Right': 135,
  Bottom: 180,
  'Bottom Left': 225,
  Left: 270,
  'Top Left': 315,
};

export const POSITION_DESCRIPTIONS: Record<StandardOrbitalPosition, string> = {
  Top: '12 o’clock (Apex)',
  'Top Right': '1:30 o’clock',
  Right: '3:00 o’clock (East)',
  'Bottom Right': '4:30 o’clock',
  Bottom: '6:00 o’clock (Base)',
  'Bottom Left': '7:30 o’clock',
  Left: '9:00 o’clock (West)',
  'Top Left': '10:30 o’clock',
};

/**
 * Returns the effective orbital angle (0-360°) for any position or custom configuration
 */
export function getEffectiveOrbitalAngle(
  position: HeroIconPosition,
  customAngle?: number
): number {
  if (position === 'Custom' && typeof customAngle === 'number') {
    return ((customAngle % 360) + 360) % 360;
  }
  if (position in POSITION_ANGLES) {
    return POSITION_ANGLES[position as StandardOrbitalPosition];
  }
  return 0;
}

/**
 * Returns the closest standard preset position for a given angle
 */
export function getClosestPresetForAngle(angle: number): StandardOrbitalPosition {
  const normalized = ((angle % 360) + 360) % 360;
  let closest: StandardOrbitalPosition = 'Top';
  let minDiff = 360;

  for (const pos of STANDARD_ORBITAL_POSITIONS) {
    const target = POSITION_ANGLES[pos];
    const diff = Math.min(
      Math.abs(normalized - target),
      360 - Math.abs(normalized - target)
    );
    if (diff < minDiff) {
      minDiff = diff;
      closest = pos;
    }
  }

  return closest;
}

/**
 * Computes exact responsive percentages (leftPct, topPct) centered around the Hero Image.
 * - Center is at 50%, 50%
 * - Standard horizontal orbital radius: 42%
 * - Standard vertical orbital radius: 43%
 * - Custom distance multiplier: 50% - 150% (100% default)
 * - Prevents overlap with central hero portrait and clipping outside outer boundaries
 */
export function calculateOrbitalCoordinates(
  position: HeroIconPosition,
  customAngle?: number,
  customDistance = 100,
  occurrenceIndex = 0
): {
  leftPct: number;
  topPct: number;
  effectiveAngle: number;
  effectiveDistance: number;
} {
  const baseAngle = getEffectiveOrbitalAngle(position, customAngle);

  // If multiple icons share the same standard angle without custom angle, gently fan them out
  const angleSpread =
    occurrenceIndex > 0
      ? occurrenceIndex % 2 === 1
        ? occurrenceIndex * 6.5
        : -occurrenceIndex * 6.5
      : 0;

  const effectiveAngle = ((baseAngle + angleSpread) % 360 + 360) % 360;

  // Distance range clamped safely between 55% and 145%
  const effectiveDistance = Math.max(55, Math.min(145, customDistance || 100));
  const distMultiplier = effectiveDistance / 100;

  // Base radii in percentages of the container
  const radiusX = 42 * distMultiplier;
  const radiusY = 43 * distMultiplier;

  // Convert 0°=Top clockwise to standard trigonometric radians (where 0 rad is (0, -1))
  const rad = (effectiveAngle * Math.PI) / 180;
  const dx = Math.sin(rad) * radiusX;
  const dy = -Math.cos(rad) * radiusY;

  // Clamp percentages to guarantee icons never get clipped outside the container
  const leftPct = Math.max(5, Math.min(95, Math.round((50 + dx) * 10) / 10));
  const topPct = Math.max(5, Math.min(95, Math.round((50 + dy) * 10) / 10));

  return {
    leftPct,
    topPct,
    effectiveAngle,
    effectiveDistance,
  };
}

/**
 * Helper to calculate coordinates directly for a HeroTechnologyIcon record
 */
export function getCoordinatesForHeroIcon(
  icon: Partial<HeroTechnologyIcon>,
  occurrenceIndex = 0
): { leftPct: number; topPct: number; effectiveAngle: number; effectiveDistance: number } {
  return calculateOrbitalCoordinates(
    icon.position || 'Top',
    icon.customAngle,
    icon.customDistance ?? 100,
    occurrenceIndex
  );
}
