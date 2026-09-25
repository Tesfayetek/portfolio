/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { processHeroImageFile, validateHeroImageFile } from '../utils/imageUtils';
import { contentService } from './contentService';
import { indexedDbService } from './indexedDbService';
import { authService } from './authService';

export interface StoredHeroImage {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  dataUrl: string;
  createdAt: number;
  active: boolean;
}

export interface HeroImagePreview {
  file: File;
  previewUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  aspectRatio: string;
  width?: number;
  height?: number;
}

const HERO_STORAGE_KEY = 'tt_hero_profile_image_store_v1';
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB maximum upload limit

/**
 * Storage manager dedicated exclusively to Hero Profile Images.
 * Guarantees that only Hero Profile Images are managed and deleted,
 * leaving all other portfolio files, projects, skills, and assets untouched.
 */
class HeroImageStorageService {
  /**
   * Asserts that an administrator is authenticated before performing mutations.
   */
  private assertAdminAuth(): void {
    if (!authService.isAuthenticated()) {
      throw new Error('Unauthorized. Administrator session required to manage the Hero Image.');
    }
  }

  /**
   * Retrieves all hero image records currently in persistent storage.
   */
  private getStoredImagesMap(): Record<string, StoredHeroImage> {
    try {
      const raw = localStorage.getItem(HERO_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading hero image storage map:', err);
    }
    return {};
  }

  /**
   * Saves the hero image storage map to localStorage with quota-resilient fallback.
   */
  private saveStoredImagesMap(map: Record<string, StoredHeroImage>): void {
    // Keep only the most recent/active records to minimize storage footprint
    const keys = Object.keys(map);
    if (keys.length > 2) {
      const sorted = keys.sort((a, b) => (map[b].createdAt || 0) - (map[a].createdAt || 0));
      sorted.slice(2).forEach((k) => delete map[k]);
    }

    try {
      localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(map));
    } catch (err) {
      console.warn('LocalStorage hero map write warning, keeping only active record:', err);
      try {
        // Prune down to strictly active record
        const activeOnly: Record<string, StoredHeroImage> = {};
        for (const [k, v] of Object.entries(map)) {
          if (v.active) {
            activeOnly[k] = v;
            break;
          }
        }
        localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(activeOnly));
      } catch {
        console.warn('LocalStorage quota reached for hero store; relying on IndexedDB & memory cache.');
      }
    }
  }

  /**
   * Retrieves the currently active hero image URL.
   * Public visitors have read-only access to this method without authentication.
   */
  public getActiveHeroImage(): string {
    const fromContent = contentService.getHeroImageUrl();
    if (fromContent) return fromContent;

    const map = this.getStoredImagesMap();
    for (const record of Object.values(map)) {
      if (record.active && record.dataUrl) {
        return record.dataUrl;
      }
    }
    return '';
  }

  /**
   * Validates file format and size before any upload or processing.
   * Supports: JPG, JPEG, PNG, WEBP (up to 10 MB).
   */
  public validateFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No image file was selected.' };
    }

    if (file.size <= 0) {
      return { valid: false, error: 'The selected image file is empty (0 bytes).' };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `File size (${sizeMb} MB) exceeds the 10 MB limit. Please select a smaller image.`,
      };
    }

    return validateHeroImageFile(file);
  }

  /**
   * Prepares a client-side preview of a selected image file without saving it to persistent storage.
   * Allows the Admin to preview the image, dimensions, and aspect ratio before confirming save.
   */
  public async prepareImagePreview(file: File): Promise<HeroImagePreview> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid image file.');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read selected image file.'));
      reader.onload = (e) => {
        const rawUrl = (e.target?.result as string) || '';
        const img = new Image();
        img.onload = () => {
          const width = img.naturalWidth || img.width;
          const height = img.naturalHeight || img.height;
          const ratio = (width / height).toFixed(2);
          resolve({
            file,
            previewUrl: rawUrl,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type || 'image/jpeg',
            aspectRatio: `${ratio} (${width} × ${height})`,
            width,
            height,
          });
        };
        img.onerror = () => {
          reject(new Error('Failed to decode image for preview. Ensure the file is not corrupted.'));
        };
        img.src = rawUrl;
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Uploads and optimizes a new Hero Profile Image into storage.
   * Does NOT touch or delete the existing active image.
   * Requires Admin Authentication.
   */
  public async uploadNewImageToStorage(file: File): Promise<StoredHeroImage> {
    this.assertAdminAuth();

    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid image file.');
    }

    // Process and optimize image (3:4 ratio, max 750 × 1000 px retina envelope)
    const processed = await processHeroImageFile(file);

    const recordId = `hero_img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const record: StoredHeroImage = {
      id: recordId,
      fileName: file.name,
      fileType: file.type || 'image/jpeg',
      fileSize: processed.fileSize || file.size,
      dataUrl: processed.dataUrl,
      createdAt: Date.now(),
      active: false,
    };

    const map = this.getStoredImagesMap();
    map[recordId] = record;
    this.saveStoredImagesMap(map);

    // Also persist high-capacity copy to IndexedDB
    try {
      await indexedDbService.setItem('active_hero_image', processed.dataUrl);
    } catch (err) {
      console.warn('IndexedDB hero persist warning:', err);
    }

    return record;
  }

  /**
   * Deletes a specific Hero Profile Image from storage by record ID or dataUrl.
   * Strictly operates only on the hero image storage bucket.
   * Requires Admin Authentication.
   */
  public deleteFromStorage(identifier: string): boolean {
    this.assertAdminAuth();
    if (!identifier) return false;

    const map = this.getStoredImagesMap();
    let foundKey: string | null = null;

    if (map[identifier]) {
      foundKey = identifier;
    } else {
      for (const [key, record] of Object.entries(map)) {
        if (record.dataUrl === identifier || record.id === identifier) {
          foundKey = key;
          break;
        }
      }
    }

    if (foundKey) {
      delete map[foundKey];
      this.saveStoredImagesMap(map);
      return true;
    }

    return false;
  }

  /**
   * Removes any stale or orphaned Hero Profile Images from storage,
   * ensuring that only the currently active Hero Profile Image remains.
   * Never touches any keys or assets outside HERO_STORAGE_KEY.
   */
  public cleanupOrphanedHeroImages(keepId?: string): number {
    this.assertAdminAuth();
    const map = this.getStoredImagesMap();
    let removedCount = 0;

    for (const [key, record] of Object.entries(map)) {
      if (keepId) {
        if (record.id !== keepId && record.dataUrl !== keepId) {
          delete map[key];
          removedCount++;
        }
      } else if (!record.active) {
        delete map[key];
        removedCount++;
      }
    }

    if (removedCount > 0) {
      this.saveStoredImagesMap(map);
    }

    return removedCount;
  }

  /**
   * Executes the strict safe replacement sequence:
   *
   * Admin uploads Hero Image
   *         ↓
   * Validate Image
   *         ↓
   * Save to Storage (New image stored first)
   *         ↓
   * Save Media Reference (Update database reference)
   *         ↓
   * Set as Active Hero Image
   *         ↓
   * Public Home Page reads Active Hero Image
   *         ↓
   * Delete Previous Image (Only after new image & DB reference are safe)
   */
  public async replaceHeroImageSafely(file: File): Promise<{
    success: boolean;
    newUrl: string;
    message: string;
  }> {
    this.assertAdminAuth();

    // 1. Identify previous image reference prior to any changes
    const previousImageRef = contentService.getHeroImageUrl();
    const mapBefore = this.getStoredImagesMap();
    let previousRecordId: string | null = null;

    for (const [key, record] of Object.entries(mapBefore)) {
      if (record.dataUrl === previousImageRef || record.active) {
        previousRecordId = key;
        break;
      }
    }

    // 2. Validate Image
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'Image validation failed.');
    }

    // 3. Upload New Image to Storage (Previous image remains untouched!)
    let newRecord: StoredHeroImage;
    try {
      newRecord = await this.uploadNewImageToStorage(file);
    } catch (uploadError) {
      // Upload Failure Protection: Keep existing image unchanged, do not delete anything
      const msg = uploadError instanceof Error ? uploadError.message : 'Upload failed.';
      throw new Error(`Upload failed: ${msg}. Current Hero Profile Image was preserved.`);
    }

    // 4. Update Database Reference & Set Active
    try {
      // Update Hero Profile Image reference in database to new image
      contentService.updateHeroImage(newRecord.dataUrl);

      // Mark new record as active in storage map
      const currentMap = this.getStoredImagesMap();
      if (currentMap[newRecord.id]) {
        currentMap[newRecord.id].active = true;
        this.saveStoredImagesMap(currentMap);
      }
    } catch (dbError) {
      // Database update failed!
      // Rollback: Delete the newly uploaded orphaned file from storage
      this.deleteFromStorage(newRecord.id);
      const msg = dbError instanceof Error ? dbError.message : 'Database error';
      throw new Error(`Database update failed: ${msg}. Cleaned up orphaned file; existing image kept active.`);
    }

    // 5. Delete Previous Image from Storage (Safe: DB and public home page now point to new image!)
    if (previousRecordId && previousRecordId !== newRecord.id) {
      try {
        this.deleteFromStorage(previousRecordId);
      } catch (e) {
        console.warn('Notice cleaning previous record:', e);
      }
    } else if (previousImageRef && previousImageRef !== newRecord.dataUrl) {
      try {
        this.deleteFromStorage(previousImageRef);
      } catch (e) {
        console.warn('Notice cleaning previous image ref:', e);
      }
    }

    // Clean up any remaining orphaned hero files to prevent multiple stored hero images
    this.cleanupOrphanedHeroImages(newRecord.id);

    return {
      success: true,
      newUrl: newRecord.dataUrl,
      message: 'Hero Profile Image saved to storage and set active on the public Home page.',
    };
  }

  /**
   * Safely removes the Hero Profile Image:
   * - Removes database reference.
   * - Deletes corresponding image from storage.
   * - Cleans up any orphaned hero images.
   * - Leaves public home page with no image (and no rectangular placeholder).
   */
  public async removeHeroImageSafely(): Promise<{ success: boolean; message: string }> {
    this.assertAdminAuth();
    const currentRef = contentService.getHeroImageUrl();

    // Remove database reference
    contentService.updateHeroImage('');

    // Delete corresponding image from storage
    if (currentRef) {
      try {
        this.deleteFromStorage(currentRef);
      } catch (e) {
        console.warn('Notice deleting currentRef:', e);
      }
    }

    // Clean all hero images from storage
    this.cleanupOrphanedHeroImages();

    try {
      await indexedDbService.removeItem('active_hero_image');
    } catch (err) {
      console.warn('IndexedDB hero removal warning:', err);
    }

    return {
      success: true,
      message: 'Hero Profile Image removed and deleted from storage.',
    };
  }
}

export const heroImageStorageService = new HeroImageStorageService();
