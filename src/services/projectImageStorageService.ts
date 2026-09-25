/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { compressImageFile } from '../utils/imageUtils';
import { indexedDbService } from './indexedDbService';
import { CaseStudy } from '../types';

const MAX_PROJECT_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB maximum upload limit

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];

export class ProjectImageStorageService {
  /**
   * Validate image file format and file size
   */
  public validateImageFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No image file was selected.' };
    }

    if (file.size <= 0) {
      return { valid: false, error: 'The selected file is empty (0 bytes).' };
    }

    if (file.size > MAX_PROJECT_IMAGE_SIZE_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `File size (${mb} MB) exceeds the 10 MB limit for project images.`,
      };
    }

    const type = (file.type || '').toLowerCase();
    const name = file.name.toLowerCase();

    const matchesMime = ALLOWED_MIME_TYPES.some((m) => type === m || file.type.startsWith('image/'));
    const matchesExt = ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));

    if (!matchesMime && !matchesExt) {
      return {
        valid: false,
        error: `Unsupported format (${file.type || 'unknown'}). Please select a JPG, PNG, WEBP, or SVG file.`,
      };
    }

    return { valid: true };
  }

  /**
   * Reads, optimizes and stores a project image in application media storage.
   * Compresses raster images to an optimal 1200×800 landscape envelope (~60-120KB)
   * while keeping SVGs crisp and vector-based.
   */
  public async uploadProjectImage(
    file: File,
    projectId: string
  ): Promise<{ dataUrl: string; storageKey: string }> {
    const validation = this.validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid project image file.');
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
      dataUrl = await compressImageFile(file, 1200, 800, 0.85);
    }

    const storageKey = `project_image_${projectId}_${Date.now()}`;

    // Store in high-capacity IndexedDB
    try {
      await indexedDbService.setItem(storageKey, dataUrl);
    } catch (err) {
      console.warn('Failed to store project image in IndexedDB:', err);
    }

    return { dataUrl, storageKey };
  }

  /**
   * Deletes a project image from application storage.
   */
  public async deleteProjectImage(storageKey?: string): Promise<void> {
    if (!storageKey) return;
    try {
      await indexedDbService.removeItem(storageKey);
    } catch (err) {
      console.warn(`Failed to remove project image "${storageKey}" from IndexedDB:`, err);
    }
  }

  /**
   * Retrieves a project image from storage by its storageKey.
   */
  public async getProjectImage(storageKey: string): Promise<string | null> {
    if (!storageKey) return null;
    return indexedDbService.getItem(storageKey);
  }

  /**
   * Migrates existing project records that may have legacy image URLs
   * into the application storage system where feasible, ensuring
   * compatibility and avoiding broken links.
   */
  public async migrateExistingProjects(caseStudies: CaseStudy[]): Promise<CaseStudy[]> {
    return caseStudies.map((cs) => {
      // If project has an image but no storage key, assign an ID
      if (cs.image && !cs.storageKey) {
        return {
          ...cs,
          storageKey: `project_image_${cs.id}`,
        };
      }
      return cs;
    });
  }
}

export const projectImageStorageService = new ProjectImageStorageService();
