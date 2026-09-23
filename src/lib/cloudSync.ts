/**
 * Cross-Device Cloud Sync Utility for AislePilot
 * Enables typing grocery lists on PC/Mac and loading them on mobile phones instantly
 */

export interface CloudSyncPayload {
  version: string;
  items: string[];
  storeId?: string;
  profileName?: string;
  createdAt: number;
}

const SYNC_CODE_STORAGE_KEY = 'aislepilot_latest_sync_code';

/**
 * Uploads a shopping list to the cloud and returns a unique 9-character sync code
 */
export async function uploadListToCloud(
  items: string[],
  storeId?: string,
  profileName?: string
): Promise<{ code: string; shareUrl: string }> {
  if (!items || items.length === 0) {
    throw new Error('Shopping list cannot be empty');
  }

  const payload: CloudSyncPayload = {
    version: '1.0',
    items,
    storeId: storeId || 'walmart_anna_6300',
    profileName: profileName || 'Shopping List',
    createdAt: Date.now(),
  };

  const params = new URLSearchParams();
  params.append('content', JSON.stringify(payload));
  params.append('expiry_days', '7');
  params.append('syntax', 'json');

  const response = await fetch('https://dpaste.com/api/v2/', {
    method: 'POST',
    body: params,
  });

  if (!response.ok) {
    throw new Error(`Cloud sync upload failed: HTTP ${response.status}`);
  }

  const rawUrl = await response.text();
  const dpasteUrl = rawUrl.trim();
  
  // Extract unique code from https://dpaste.com/G3HU92GHW -> G3HU92GHW
  const code = dpasteUrl.split('/').filter(Boolean).pop() || '';

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SYNC_CODE_STORAGE_KEY, code);
    } catch (e) {
      console.warn('Could not save sync code to localStorage', e);
    }
  }

  const shareUrl = getShareableUrl(code);

  return { code, shareUrl };
}

/**
 * Downloads a shopping list from the cloud using a 9-character sync code or URL
 */
export async function downloadListFromCloud(codeOrUrl: string): Promise<CloudSyncPayload> {
  let cleanCode = codeOrUrl.trim();

  // If full URL was pasted, extract code
  if (cleanCode.includes('/#sync=')) {
    cleanCode = cleanCode.split('/#sync=').pop() || '';
  } else if (cleanCode.includes('dpaste.com/')) {
    cleanCode = cleanCode.split('dpaste.com/').pop()?.replace('.txt', '').split('/')[0] || '';
  }

  cleanCode = cleanCode.replace(/[^a-zA-Z0-9]/g, '');

  if (!cleanCode) {
    throw new Error('Invalid cloud sync code');
  }

  const rawUrl = `https://dpaste.com/${cleanCode}.txt`;

  const response = await fetch(rawUrl);

  if (!response.ok) {
    throw new Error(`Sync code "${cleanCode}" not found or expired.`);
  }

  const data = await response.json();

  if (!data || !Array.isArray(data.items)) {
    throw new Error('Downloaded data does not contain a valid grocery list');
  }

  return data as CloudSyncPayload;
}

/**
 * Gets the shareable website URL with embedded sync code
 */
export function getShareableUrl(code: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://dzor777.github.io/aislepilot-';
  return `${origin}#sync=${code.trim()}`;
}

/**
 * Generates a high-contrast QR code image URL for scanning PC screen with phone camera
 */
export function getQrCodeImageUrl(shareUrl: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareUrl)}`;
}

/**
 * Reads the latest locally saved sync code
 */
export function getSavedSyncCode(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(SYNC_CODE_STORAGE_KEY) || '';
  } catch (e) {
    return '';
  }
}
