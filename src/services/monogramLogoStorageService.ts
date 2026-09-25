/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { contentService } from './contentService';
import { compressImageFile } from '../utils/imageUtils';
import { indexedDbService } from './indexedDbService';

const LOGO_STORAGE_KEY = 'tt_monogram_logo_store_v1';
const MAX_LOGO_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB maximum upload limit for logos

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/svg+xml',
  'image/webp',
  'image/jpeg',
  'image/jpg',
];

const ALLOWED_EXTENSIONS = ['.png', '.svg', '.webp', '.jpg', '.jpeg'];

export class MonogramLogoStorageService {
  /**
   * Validate logo file type and size
   */
  public validateLogoFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No logo file was selected.' };
    }

    if (file.size <= 0) {
      return { valid: false, error: 'The selected file is empty (0 bytes).' };
    }

    if (file.size > MAX_LOGO_SIZE_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `File size (${mb} MB) exceeds the 10 MB limit for monogram logos.`,
      };
    }

    const type = (file.type || '').toLowerCase();
    const name = file.name.toLowerCase();

    const matchesMime = ALLOWED_MIME_TYPES.some((m) => type === m);
    const matchesExt = ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));

    if (!matchesMime && !matchesExt) {
      return {
        valid: false,
        error: `Unsupported format (${file.type || 'unknown'}). Please select a PNG, SVG, WEBP, or JPG image.`,
      };
    }

    return { valid: true };
  }

  /**
   * Read and optimize file as data URL.
   * Compresses raster images to a crisp 256×256 envelope (~15KB)
   * while keeping SVGs intact.
   */
  private async readAndOptimizeLogo(file: File): Promise<string> {
    if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string) || '');
        reader.onerror = () => reject(new Error('Failed to read SVG file.'));
        reader.readAsDataURL(file);
      });
    }

    return compressImageFile(file, 256, 256, 0.85);
  }

  /**
   * Upload, persist, and activate a new monogram logo.
   * Updates storage and database reference simultaneously.
   */
  public async uploadLogo(file: File): Promise<{ success: boolean; dataUrl: string; message: string }> {
    const validation = this.validateLogoFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid logo file.');
    }

    const dataUrl = await this.readAndOptimizeLogo(file);

    // Persist to IndexedDB
    try {
      await indexedDbService.setItem('active_monogram_logo', dataUrl);
    } catch (err) {
      console.warn('IndexedDB logo persist warning:', err);
    }

    // Persist to localStorage if quota permits
    try {
      localStorage.setItem(LOGO_STORAGE_KEY, JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        dataUrl,
        uploadedAt: Date.now(),
      }));
    } catch (err) {
      console.warn('LocalStorage logo write warning (stored in IndexedDB):', err);
    }

    // Update database reference
    contentService.updateMonogramLogo(dataUrl);

    return {
      success: true,
      dataUrl,
      message: 'Monogram logo uploaded and saved to persistent media storage.',
    };
  }

  /**
   * Remove monogram logo from database and persistent storage.
   */
  public async removeLogo(): Promise<{ success: boolean; message: string }> {
    try {
      localStorage.removeItem(LOGO_STORAGE_KEY);
      await indexedDbService.removeItem('active_monogram_logo');
    } catch (err) {
      console.warn('Failed to remove logo from storage:', err);
    }

    contentService.updateMonogramLogo('');

    return {
      success: true,
      message: 'Monogram logo removed. Website will display clean typography without fallback URL.',
    };
  }
}

export const monogramLogoStorageService = new MonogramLogoStorageService();
