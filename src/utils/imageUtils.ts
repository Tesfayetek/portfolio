/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProcessedHeroImage {
  dataUrl: string;
  width: number;
  height: number;
  ratio: string;
  fileSize: number;
}

// Supported formats: JPG, JPEG, PNG, WEBP, SVG
const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Validates that the uploaded file is a supported image format.
 */
export function validateHeroImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const fileName = file.name.toLowerCase();
  const hasValidExtension = SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
  const hasValidMime =
    SUPPORTED_MIME_TYPES.includes(file.type.toLowerCase()) || file.type.startsWith('image/');

  if (!hasValidExtension && !hasValidMime) {
    return {
      valid: false,
      error: 'Unsupported image format. Please upload a JPG, JPEG, PNG, or WEBP file.',
    };
  }

  // 15MB raw file size safeguard
  if (file.size > 15 * 1024 * 1024) {
    return {
      valid: false,
      error: 'File size exceeds 15 MB limit. Please select a smaller image.',
    };
  }

  return { valid: true };
}

/**
 * General purpose canvas-based image compressor.
 * Downscales images to fit within maxWidth × maxHeight and compresses with WebP / JPEG
 * to ensure client-side storage quotas are never exceeded.
 */
export function compressImageFile(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    // SVGs do not need canvas raster compression
    if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = () => reject(new Error('Failed to read SVG file.'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) {
        reject(new Error('Empty image data received.'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          let resultUrl: string;
          try {
            resultUrl = canvas.toDataURL('image/webp', quality);
            if (!resultUrl.startsWith('data:image/webp')) {
              resultUrl = canvas.toDataURL('image/jpeg', quality);
            }
          } catch {
            resultUrl = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(resultUrl || rawDataUrl);
        } catch {
          resolve(rawDataUrl);
        }
      };

      img.onerror = () => {
        reject(new Error('Could not decode image for compression.'));
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Reads and optimizes an uploaded image for the Hero Section.
 * Prepares crisp 3:4 aspect ratio portrait, scaling to retina envelope (max 750 × 1000 px)
 * with efficient WebP/JPEG compression (~60KB) to preserve storage quotas and visuals.
 */
export function processHeroImageFile(file: File): Promise<ProcessedHeroImage> {
  return new Promise((resolve, reject) => {
    const validation = validateHeroImageFile(file);
    if (!validation.valid) {
      reject(new Error(validation.error || 'Invalid image file.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      reject(new Error('Failed to read the selected image file.'));
    };

    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) {
        reject(new Error('Empty image data received.'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        const originalWidth = img.naturalWidth || img.width;
        const originalHeight = img.naturalHeight || img.height;
        const ratio = (originalWidth / originalHeight).toFixed(2);

        // Maximum retina envelope for 3:4 portrait (750 × 1000 px provides razor-sharp display)
        const MAX_WIDTH = 750;
        const MAX_HEIGHT = 1000;

        let targetWidth = originalWidth;
        let targetHeight = originalHeight;

        // Proportional scale down if larger than maximum target
        if (targetWidth > MAX_WIDTH || targetHeight > MAX_HEIGHT) {
          const widthRatio = MAX_WIDTH / targetWidth;
          const heightRatio = MAX_HEIGHT / targetHeight;
          const scale = Math.min(widthRatio, heightRatio);
          targetWidth = Math.round(targetWidth * scale);
          targetHeight = Math.round(targetHeight * scale);
        }

        // Render onto canvas for optimization and instant persistence
        try {
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve({
              dataUrl: rawDataUrl,
              width: originalWidth,
              height: originalHeight,
              ratio,
              fileSize: file.size,
            });
            return;
          }

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Try exporting to WebP first, fall back to JPEG (quality 0.82)
          let optimizedDataUrl: string;
          try {
            optimizedDataUrl = canvas.toDataURL('image/webp', 0.82);
            if (!optimizedDataUrl.startsWith('data:image/webp')) {
              optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
            }
          } catch {
            optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          }

          const finalDataUrl = optimizedDataUrl || rawDataUrl;
          const estSize = Math.round(finalDataUrl.length * 0.75);

          resolve({
            dataUrl: finalDataUrl,
            width: targetWidth,
            height: targetHeight,
            ratio,
            fileSize: estSize,
          });
        } catch {
          resolve({
            dataUrl: rawDataUrl,
            width: originalWidth,
            height: originalHeight,
            ratio,
            fileSize: file.size,
          });
        }
      };

      img.onerror = () => {
        reject(new Error('Could not decode image. Please ensure the file is not corrupted.'));
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}
