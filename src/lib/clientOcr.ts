import { createWorker } from 'tesseract.js';

export async function parseHandwrittenListImage(
  imageSource: File | Blob | string,
  onProgress?: (progressPercent: number, statusText: string) => void
): Promise<string[]> {
  try {
    if (onProgress) onProgress(10, 'Initializing OCR engine...');

    const worker = await createWorker('eng');

    if (onProgress) onProgress(40, 'Scanning handwritten text...');

    const ret = await worker.recognize(imageSource);
    await worker.terminate();

    if (onProgress) onProgress(90, 'Cleaning extracted text...');

    const extractedRawText = ret.data.text;
    const cleanList = processExtractedOcrText(extractedRawText);

    if (onProgress) onProgress(100, 'OCR Complete!');

    return cleanList;
  } catch (error) {
    console.error('Tesseract OCR error:', error);
    throw new Error('Failed to parse handwritten image. Please try typing or pasting your list instead.');
  }
}

export function processExtractedOcrText(rawText: string): string[] {
  if (!rawText) return [];

  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 1);

  const cleanItems: string[] = [];

  for (const line of lines) {
    // Strip leading checkboxes, bullet characters, numbers
    let cleaned = line
      .replace(/^[\s\d\-•*\[\]\(\)\>\+]+/, '')
      .replace(/^(x|v|\(x\))\s+/i, '') // Skip crossed out checkmarks
      .trim();

    // Ignore short headers or non-item lines
    if (cleaned.length < 2) continue;
    if (/^(grocery|shopping|walmart|list|items|store)$/i.test(cleaned)) continue;

    cleanItems.push(cleaned);
  }

  return cleanItems;
}
