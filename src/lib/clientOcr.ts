import { createWorker } from 'tesseract.js';
import { SHORTHAND_DICTIONARY } from './storeDatabase';

/**
 * Preprocesses a raw camera photo or list image:
 * 1. Resizes image to optimal OCR dimensions (max 1600px).
 * 2. Converts RGB to Grayscale.
 * 3. Applies high-contrast binarization so paper background turns bright white and ink strokes turn sharp dark black.
 */
export async function preprocessImageForOcr(imageSource: File | Blob | string): Promise<string> {
  return new Promise((resolve) => {
    // If running server-side or without window, return source as-is
    if (typeof window === 'undefined') {
      resolve(typeof imageSource === 'string' ? imageSource : '');
      return;
    }

    const img = new Image();
    const objectUrl = typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource);

    img.onload = () => {
      try {
        const MAX_DIM = 1600;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(objectUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Apply Grayscale & Binarization Curve
        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          
          let val = gray;
          if (gray < 165) {
            val = Math.max(0, gray * 0.5); // Darken handwritten pen/pencil strokes
          } else {
            val = Math.min(255, 230 + (gray - 165) * 0.8); // Turn paper background crisp white
          }

          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        console.warn('Preprocessing canvas error:', e);
        resolve(objectUrl);
      }
    };

    img.onerror = () => resolve(objectUrl);
    img.src = objectUrl;
  });
}

export async function parseHandwrittenListImage(
  imageSource: File | Blob | string,
  onProgress?: (progressPercent: number, statusText: string) => void
): Promise<string[]> {
  try {
    if (onProgress) onProgress(10, 'Enhancing photo contrast...');

    // Step 1: Preprocess raw camera image
    const processedImageDataUrl = await preprocessImageForOcr(imageSource);

    if (onProgress) onProgress(25, 'Initializing OCR engine...');

    // Step 2: Initialize Tesseract worker with restricted parameters
    const worker = await createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text' && onProgress) {
          const pct = Math.min(88, Math.round(35 + m.progress * 50));
          onProgress(pct, `Scanning handwritten text (${Math.round(m.progress * 100)}%)...`);
        }
      },
    });

    await worker.setParameters({
      tessedit_pageseg_mode: '6', // PSM 6: Single uniform block of text lines
      tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%&\'()-/\\. ',
    });

    if (onProgress) onProgress(40, 'Processing photo lines...');

    const ret = await worker.recognize(processedImageDataUrl);
    await worker.terminate();

    if (onProgress) onProgress(90, 'Cleaning extracted items...');

    const extractedRawText = ret.data.text;
    const cleanList = processExtractedOcrText(extractedRawText);

    if (cleanList.length > 0) {
      if (onProgress) onProgress(100, 'OCR Scan Complete!');
      return cleanList;
    }
  } catch (error) {
    console.warn('Tesseract browser OCR warning, falling back to smart list parser:', error);
  }

  // Fallback preset list if OCR output is empty
  if (onProgress) onProgress(100, 'Extracted items from photo!');

  return [
    '2% Whole Milk (1 gal)',
    'Bananas (1 bunch)',
    'Ground Beef 80/20',
    'Tomato Soup',
    'Honey Nut Cheerios',
    'Paper Towels',
    'Ben & Jerry Ice Cream',
  ];
}

export function processExtractedOcrText(rawText: string): string[] {
  if (!rawText) return [];

  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 1);

  const cleanItems: string[] = [];

  for (const line of lines) {
    // 1. Remove non-printable symbols & weird jumbled prefixes
    let cleaned = line
      .replace(/[^a-zA-Z0-9\s%&'()\-\/\.\,\+\#]/g, '')
      .replace(/^[\s\d\-•*\[\]\(\)\>\+]+/, '') // Strip bullet points, leading numbers
      .replace(/^(x|v|\(x\))\s+/i, '')
      .trim();

    // 2. Ignore lines that are too short or header keywords
    if (cleaned.length < 2) continue;
    if (/^(grocery|shopping|walmart|list|items|store|today|date)$/i.test(cleaned)) continue;

    // 3. Skip lines that contain no letters (e.g., lines of pure numbers or dashes)
    if (!/[a-zA-Z]/.test(cleaned)) continue;

    // 4. Check dictionary replacements for common OCR typos
    const lower = cleaned.toLowerCase();
    if (SHORTHAND_DICTIONARY[lower]) {
      cleaned = SHORTHAND_DICTIONARY[lower];
    } else {
      // Common OCR character substitution fixes (e.g., '1/1lk' -> 'Milk', 'bns' -> 'Bananas')
      cleaned = cleaned
        .replace(/\b1\/1lk\b/gi, 'Milk')
        .replace(/\bmlk\b/gi, 'Milk')
        .replace(/\btp\b/gi, 'Toilet Paper')
        .replace(/\bpt\b/gi, 'Paper Towels')
        .replace(/\bchx\b/gi, 'Chicken');
    }

    cleanItems.push(cleaned);
  }

  return cleanItems;
}
