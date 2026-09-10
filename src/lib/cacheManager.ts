import { MappedGroceryItem } from './types';

const LOCAL_CACHE_KEY_PREFIX = 'aislepilot_custom_aisles_';

export interface CachedAisleMapping {
  storeId: string;
  normalizedItemName: string;
  aisleTag: string;
  aisleNumber: number;
  lastUpdated: number;
}

export class CacheManager {
  private static normalizeKey(name: string): string {
    return name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  }

  public static getCustomAisle(storeId: string, itemName: string): { aisleTag: string; aisleNumber: number } | null {
    if (typeof window === 'undefined') return null;
    try {
      const key = `${LOCAL_CACHE_KEY_PREFIX}${storeId}`;
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const data: Record<string, CachedAisleMapping> = JSON.parse(raw);
      const normalizedItem = this.normalizeKey(itemName);
      if (data[normalizedItem]) {
        return {
          aisleTag: data[normalizedItem].aisleTag,
          aisleNumber: data[normalizedItem].aisleNumber,
        };
      }
    } catch (e) {
      console.warn('Error reading from localStorage cache', e);
    }
    return null;
  }

  public static saveCustomAisle(storeId: string, itemName: string, aisleTag: string, aisleNumber: number): void {
    if (typeof window === 'undefined') return;
    try {
      const key = `${LOCAL_CACHE_KEY_PREFIX}${storeId}`;
      const raw = localStorage.getItem(key) || '{}';
      const data: Record<string, CachedAisleMapping> = JSON.parse(raw);
      const normalizedItem = this.normalizeKey(itemName);

      data[normalizedItem] = {
        storeId,
        normalizedItemName: normalizedItem,
        aisleTag,
        aisleNumber,
        lastUpdated: Date.now(),
      };

      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Error writing to localStorage cache', e);
    }
  }

  public static applyCachedOverrides(storeId: string, items: MappedGroceryItem[]): MappedGroceryItem[] {
    return items.map((item) => {
      const cached = this.getCustomAisle(storeId, item.cleanName);
      if (cached) {
        return {
          ...item,
          aisleTag: cached.aisleTag,
          aisleNumber: cached.aisleNumber,
          isCustomLocation: true,
        };
      }
      return item;
    });
  }
}
