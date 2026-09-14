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

  // --- 1. ACTIVE TRIP PERSISTENCE ---
  public static saveActiveTripState(state: {
    items: MappedGroceryItem[];
    storeId: string;
    step: 'input' | 'review' | 'route';
    startTime: number;
  }): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        'aislepilot_active_trip_state',
        JSON.stringify({ ...state, lastUpdated: Date.now() })
      );
    } catch (e) {
      console.warn('Error saving active trip state', e);
    }
  }

  public static getActiveTripState(): {
    items: MappedGroceryItem[];
    storeId: string;
    step: 'input' | 'review' | 'route';
    startTime: number;
  } | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('aislepilot_active_trip_state');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading active trip state', e);
      return null;
    }
  }

  public static clearActiveTripState(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('aislepilot_active_trip_state');
    } catch (e) {
      console.warn('Error clearing active trip state', e);
    }
  }

  // --- 2. SAVED LIST TEMPLATES ---
  public static getSavedTemplates(): import('./types').SavedListTemplate[] {
    const presets: import('./types').SavedListTemplate[] = [
      {
        id: 'preset-sunday-staples',
        title: 'Sunday Family Staples',
        description: 'Milk, eggs, bread, chicken, apples, paper towels',
        emoji: '🍞',
        items: ['Gallon Whole Milk', 'Large Grade A Eggs', 'White Bread', 'Boneless Chicken Breast', 'Gala Apples', 'Paper Towels 6-pack', 'Tide Laundry Pods'],
        createdAt: Date.now(),
        isPreset: true,
      },
      {
        id: 'preset-bbq-cookout',
        title: 'BBQ Cookout',
        description: 'Ground beef, hot dogs, buns, charcoal, chips, soda',
        emoji: '🍔',
        items: ['Ground Beef 80/20', 'Beef Hot Dogs', 'Hamburger Buns', 'Kingsford Charcoal', 'Lay\'s Potato Chips', 'Coca-Cola 12-pack', 'Ketchup & Mustard'],
        createdAt: Date.now(),
        isPreset: true,
      },
      {
        id: 'preset-baking-run',
        title: 'Baking & Desserts',
        description: 'Flour, sugar, butter, chocolate chips, vanilla extract',
        emoji: '🍪',
        items: ['All-Purpose Flour 5lb', 'Granulated White Sugar', 'Unsalted Butter 4-pack', 'Nestle Toll House Chocolate Chips', 'Pure Vanilla Extract'],
        createdAt: Date.now(),
        isPreset: true,
      },
      {
        id: 'preset-taco-night',
        title: 'Taco Tuesday',
        description: 'Taco shells, ground beef, shredded cheese, salsa, sour cream',
        emoji: '🌮',
        items: ['Ground Beef 80/20', 'Old El Paso Taco Shells', 'Shredded Mexican Cheese', 'Pace Medium Salsa', 'Daisy Sour Cream', 'Avocados'],
        createdAt: Date.now(),
        isPreset: true,
      },
    ];

    if (typeof window === 'undefined') return presets;
    try {
      const raw = localStorage.getItem('aislepilot_saved_templates');
      if (!raw) return presets;
      const custom: import('./types').SavedListTemplate[] = JSON.parse(raw);
      return [...presets, ...custom];
    } catch (e) {
      console.warn('Error reading saved templates', e);
      return presets;
    }
  }

  public static saveCustomTemplate(title: string, description: string, emoji: string, items: string[]): import('./types').SavedListTemplate {
    const newTemplate: import('./types').SavedListTemplate = {
      id: `template-${Date.now()}`,
      title,
      description,
      emoji: emoji || '📋',
      items,
      createdAt: Date.now(),
      isPreset: false,
    };

    if (typeof window !== 'undefined') {
      try {
        const existing = this.getSavedTemplates().filter((t) => !t.isPreset);
        localStorage.setItem('aislepilot_saved_templates', JSON.stringify([newTemplate, ...existing]));
      } catch (e) {
        console.warn('Error saving custom template', e);
      }
    }
    return newTemplate;
  }

  public static deleteCustomTemplate(id: string): void {
    if (typeof window === 'undefined') return;
    try {
      const existing = this.getSavedTemplates().filter((t) => !t.isPreset && t.id !== id);
      localStorage.setItem('aislepilot_saved_templates', JSON.stringify(existing));
    } catch (e) {
      console.warn('Error deleting custom template', e);
    }
  }

  // --- 3. COMPLETED TRIP HISTORY & ANALYTICS ---
  public static getCompletedTripHistory(): import('./types').CompletedTripRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('aislepilot_trip_history');
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading trip history', e);
      return [];
    }
  }

  public static recordCompletedTrip(trip: {
    storeName: string;
    storeId: string;
    itemCount: number;
    completedItemCount: number;
    durationSeconds: number;
    savedFeet: number;
    items: { cleanName: string; aisleTag: string; completed: boolean }[];
  }): import('./types').CompletedTripRecord {
    const record: import('./types').CompletedTripRecord = {
      id: `trip-${Date.now()}`,
      date: Date.now(),
      ...trip,
    };

    if (typeof window !== 'undefined') {
      try {
        const history = this.getCompletedTripHistory();
        localStorage.setItem('aislepilot_trip_history', JSON.stringify([record, ...history]));
      } catch (e) {
        console.warn('Error saving trip history', e);
      }
    }
    return record;
  }

  // --- 4. FAMILY USER PROFILES ---
  public static DEFAULT_FAMILY_PROFILES: import('./types').FamilyUserProfile[] = [
    { id: 'profile-mom', name: 'Mom (Family Lead)', role: 'Mom', avatarColor: 'bg-rose-500', initials: 'M' },
    { id: 'profile-dad', name: 'Dad', role: 'Dad', avatarColor: 'bg-blue-600', initials: 'D' },
    { id: 'profile-alex', name: 'Alex', role: 'Kid', avatarColor: 'bg-emerald-500', initials: 'A' },
    { id: 'profile-roommate', name: 'Household Guest', role: 'Roommate', avatarColor: 'bg-amber-500', initials: 'H' },
  ];

  public static getActiveUserProfile(): import('./types').FamilyUserProfile {
    if (typeof window === 'undefined') return this.DEFAULT_FAMILY_PROFILES[0];
    try {
      const raw = localStorage.getItem('aislepilot_active_user_profile');
      if (!raw) return this.DEFAULT_FAMILY_PROFILES[0];
      return JSON.parse(raw);
    } catch (e) {
      return this.DEFAULT_FAMILY_PROFILES[0];
    }
  }

  public static setActiveUserProfile(profile: import('./types').FamilyUserProfile): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('aislepilot_active_user_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('Error saving user profile', e);
    }
  }
}

