/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { compressImageFile } from '../utils/imageUtils';
import { indexedDbService } from './indexedDbService';

const MAX_ICON_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB maximum limit
const MIN_ICON_DIMENSION = 64; // Minimum 64 × 64 pixels

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
];

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];

export class HeroIconStorageService {
  /**
   * Validate icon image file format, file size (<= 2MB), and dimensions (>= 64×64 px)
   * Displays clear, descriptive validation error messages if requirements are not met.
   */
  public async validateIconFile(
    file: File
  ): Promise<{ valid: boolean; error?: string; width?: number; height?: number }> {
    if (!file) {
      return { valid: false, error: 'No image file was selected. Please choose an image to upload.' };
    }

    if (file.size <= 0) {
      return { valid: false, error: 'The selected file is empty (0 bytes).' };
    }

    // 1. File type validation (PNG recommended; JPG, JPEG, WebP, SVG supported)
    const type = (file.type || '').toLowerCase();
    const name = file.name.toLowerCase();

    const matchesMime = ALLOWED_MIME_TYPES.includes(type);
    const matchesExt = ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));

    if (!matchesMime && !matchesExt) {
      const detectedExt = name.includes('.') ? `.${name.split('.').pop()}` : (file.type || 'unknown format');
      return {
        valid: false,
        error: `Unsupported file format (${detectedExt}). Supported formats are PNG (recommended), JPG, JPEG, and WebP.`,
      };
    }

    // 2. File size validation (Maximum 2 MB)
    if (file.size > MAX_ICON_IMAGE_SIZE_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(2);
      return {
        valid: false,
        error: `File size (${mb} MB) exceeds the maximum allowed limit of 2 MB. Please select an image under 2 MB.`,
      };
    }

    // 3. Image dimension validation (Minimum 64 × 64 pixels)
    // SVGs do not strictly require raster dimensions check if vector
    const isSvg = file.type === 'image/svg+xml' || name.endsWith('.svg');
    if (!isSvg) {
      try {
        const dimensions = await new Promise<{ width: number; height: number }>(
          (resolve, reject) => {
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);
            img.onload = () => {
              URL.revokeObjectURL(objectUrl);
              resolve({
                width: img.naturalWidth || img.width,
                height: img.naturalHeight || img.height,
              });
            };
            img.onerror = () => {
              URL.revokeObjectURL(objectUrl);
              reject(new Error('Unable to read image dimensions.'));
            };
            img.src = objectUrl;
          }
        );

        if (
          dimensions.width < MIN_ICON_DIMENSION ||
          dimensions.height < MIN_ICON_DIMENSION
        ) {
          return {
            valid: false,
            error: `Image dimensions (${dimensions.width} × ${dimensions.height} px) are below the minimum required size of ${MIN_ICON_DIMENSION} × ${MIN_ICON_DIMENSION} pixels. Recommended size is 128 × 128 pixels.`,
            width: dimensions.width,
            height: dimensions.height,
          };
        }

        return { valid: true, width: dimensions.width, height: dimensions.height };
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? `Unable to decode image file: ${err.message}`
            : 'Unable to inspect image dimensions. Please select a valid PNG, JPG, JPEG, or WebP image.';
        return { valid: false, error: msg };
      }
    }

    return { valid: true };
  }

  /**
   * Reads, optimizes and stores a technology icon image in IndexedDB media storage.
   * Compresses raster images to a crisp 256×256 envelope preserving transparency,
   * while keeping SVGs vector-based.
   */
  public async uploadIconImage(
    file: File,
    iconId: string
  ): Promise<{ dataUrl: string; storageKey: string; width?: number; height?: number }> {
    const validation = await this.validateIconFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid icon image file.');
    }

    let dataUrl: string;
    if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
      dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string) || '');
        reader.onerror = () => reject(new Error('Failed to read SVG file.'));
        reader.readAsDataURL(file);
      });
    } else {
      dataUrl = await compressImageFile(file, 256, 256, 0.9);
    }

    const storageKey = `hero_tech_icon_${iconId}_${Date.now()}`;

    // Store in high-capacity IndexedDB
    try {
      await indexedDbService.setItem(storageKey, dataUrl);
    } catch (err) {
      console.warn('Failed to store hero icon in IndexedDB:', err);
    }

    return { dataUrl, storageKey, width: validation.width, height: validation.height };
  }

  /**
   * Removes an icon from IndexedDB storage when replaced or deleted.
   */
  public async deleteIconImage(storageKey?: string): Promise<void> {
    if (!storageKey) return;
    try {
      await indexedDbService.removeItem(storageKey);
    } catch (err) {
      console.warn(`Failed to remove hero icon image (${storageKey}) from storage:`, err);
    }
  }
}

export const heroIconStorageService = new HeroIconStorageService();
