export type WalmartZoneId =
  | 'ZONE_1_HOUSEHOLD'      // Household, Cleaning, Paper Goods
  | 'ZONE_2_PANTRY_DRY'     // Dry Center Aisles (A1 - A25: Canned, Pasta, Spices, Cereal, Snacks, Beverage)
  | 'ZONE_3_MEAT'           // Fresh Meat, Poultry, Seafood
  | 'ZONE_4_DAIRY'          // Dairy, Milk, Eggs, Cheese, Yogurt
  | 'ZONE_5_PRODUCE_BAKERY' // Produce, Fresh Fruit, Greens, Bakery, Bread (Delicate & Door-Adjacent)
  | 'ZONE_6_FROZEN'         // Frozen Foods, Pizza, Meals, Ice Cream (Always Last!)
  | 'ZONE_7_FRONT';         // Front End, Registers, Checkout

export interface ZoneDefinition {
  id: WalmartZoneId;
  name: string;
  shortName: string;
  iconName: string;
  color: string;
  badgeBg: string;
  description: string;
  sortWeight: number; // 1 to 7 sequence order
}

export interface MappedGroceryItem {
  id: string;
  originalText: string;
  cleanName: string;
  category: string;
  zoneId: WalmartZoneId;
  aisleTag: string;        // e.g. "Aisle A4", "Produce", "Aisle A30", "Dairy Wall"
  aisleNumber: number;     // e.g. 4 for A4, 99 for non-numbered perimeter
  section?: string;        // e.g. "Section B2" or "Freezer Case 4"
  sortKey: number;         // Topological sort key: zoneId weight * 1000 + aisleNumber
  completed: boolean;
  isCustomLocation?: boolean;
  quantity?: string;
  notes?: string;
}

export interface WalmartStoreProfile {
  id: string;
  storeNumber: string;
  name: string;
  city: string;
  state: string;
  zipCode: string;
  type: 'Supercenter' | 'Neighborhood Market';
  entranceType: 'GM & Grocery' | 'Grocery Main' | 'General Merchandise';
  aisleOverrides?: Record<string, string>; // normalized item name -> custom aisle
}

export interface SampleListPreset {
  id: string;
  title: string;
  description: string;
  badgeText: string;
  imageUrl?: string;
  items: string[];
}

export interface ShoppingTripSummary {
  totalItems: number;
  completedItems: number;
  startTime: number;
  endTime?: number;
  savedDistanceMeters: number;
  savedMinutes: number;
}

export interface FamilyUserProfile {
  id: string;
  name: string;
  role: 'Mom' | 'Dad' | 'Kid' | 'Roommate' | 'Custom';
  avatarColor: string;
  initials: string;
}

export interface SavedListTemplate {
  id: string;
  title: string;
  description: string;
  emoji: string;
  items: string[];
  createdAt: number;
  isPreset?: boolean;
}

export interface CompletedTripRecord {
  id: string;
  storeName: string;
  storeId: string;
  date: number; // timestamp
  itemCount: number;
  completedItemCount: number;
  durationSeconds: number;
  savedFeet: number;
  items: { cleanName: string; aisleTag: string; completed: boolean }[];
}

export interface ActiveTripState {
  items: MappedGroceryItem[];
  storeId: string;
  step: 'input' | 'review' | 'route';
  startTime: number;
  lastUpdated: number;
}

