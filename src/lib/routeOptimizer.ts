import { MappedGroceryItem, WalmartZoneId } from './types';
import { WALMART_ZONES } from '@/sampleData/walmartStores';
import { classifyGroceryItem } from './storeDatabase';
import { CacheManager } from './cacheManager';

/**
 * Calculates a continuous spatial walking sequence sort key (1 to 1000)
 * ensuring items are visited in logical physical order along the floorplan trajectory:
 * Entrance -> Grocery Center Aisles (A1..A31 south to north) -> Dairy Wall -> Meat Wall -> Bakery & Deli -> Produce -> Frozen -> Registers.
 */
export function computeItemSpatialSortKey(
  zoneId: WalmartZoneId,
  aisleTag: string,
  aisleNumber: number
): number {
  const lowerAisle = aisleTag.toLowerCase();

  // 1. Center-Right Horizontal Grocery Aisles (A1 through A31)
  // Walk south to north: A1 (bottom) to A31 (top)
  if (lowerAisle.includes('aisle a') || lowerAisle.startsWith('a')) {
    if (aisleNumber >= 1 && aisleNumber <= 32) {
      return 100 + aisleNumber * 5;
    }
  }

  // 2. Dairy Wall (Top Back Perimeter Wall A33)
  if (zoneId === 'ZONE_4_DAIRY' || lowerAisle.includes('dairy') || lowerAisle.includes('a33')) {
    return 300;
  }

  // 3. Meat & Seafood (Right Perimeter Wall A34/A35)
  if (zoneId === 'ZONE_3_MEAT' || lowerAisle.includes('meat') || lowerAisle.includes('a34') || lowerAisle.includes('a35')) {
    return 400;
  }

  // 4. Fresh Bakery & Deli (AD1)
  if (lowerAisle.includes('deli') || lowerAisle.includes('ad1')) {
    return 500;
  }
  if (lowerAisle.includes('bakery')) {
    return 550;
  }

  // 5. Fresh Produce (Front Door Zone)
  if (zoneId === 'ZONE_5_PRODUCE_BAKERY' || lowerAisle.includes('produce')) {
    return 600;
  }

  // 6. Frozen Foods (Always Last Stop Before Registers!)
  if (zoneId === 'ZONE_6_FROZEN' || lowerAisle.includes('frozen')) {
    return 700 + aisleNumber;
  }

  // 7. General Merchandise Letter Aisles
  if (lowerAisle.startsWith('g')) return 50;  // Health & Beauty near front
  if (lowerAisle.startsWith('b') || lowerAisle.startsWith('c') || lowerAisle.startsWith('d')) return 60; // Fashion
  if (lowerAisle.startsWith('e')) return 70;  // Baby
  if (lowerAisle.startsWith('h')) return 80;  // Home & Kitchen
  if (lowerAisle.startsWith('i')) return 90;  // Toys & Sports
  if (lowerAisle.startsWith('j')) return 310; // Pets & Crafts near Dairy
  if (lowerAisle.startsWith('k')) return 320; // Electronics
  if (lowerAisle.startsWith('l') || lowerAisle.startsWith('x')) return 330; // Hardware/Auto
  if (lowerAisle.startsWith('y')) return 40;  // Garden

  // Default fallback
  return 200 + aisleNumber;
}

export function mapAndOptimizeGroceryRoute(
  rawItemStrings: string[],
  storeId: string
): MappedGroceryItem[] {
  const mappedItems: MappedGroceryItem[] = rawItemStrings
    .map((str) => str.trim())
    .filter((str) => str.length > 0)
    .map((rawText, idx) => {
      const { cleanName, category, zoneId, aisleTag, aisleNumber } = classifyGroceryItem(rawText);

      // Check if user has saved a custom aisle override for this store
      const cachedOverride = CacheManager.getCustomAisle(storeId, cleanName);
      const finalAisleTag = cachedOverride ? cachedOverride.aisleTag : aisleTag;
      const finalAisleNumber = cachedOverride ? cachedOverride.aisleNumber : aisleNumber;

      const sortKey = computeItemSpatialSortKey(zoneId, finalAisleTag, finalAisleNumber);

      return {
        id: `item-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        originalText: rawText,
        cleanName,
        category,
        zoneId,
        aisleTag: finalAisleTag,
        aisleNumber: finalAisleNumber,
        sortKey,
        completed: false,
        isCustomLocation: !!cachedOverride,
      };
    });

  // Sort items sequentially by calculated spatial sortKey
  return mappedItems.sort((a, b) => a.sortKey - b.sortKey);
}

export function groupItemsByZone(items: MappedGroceryItem[]): Record<WalmartZoneId, MappedGroceryItem[]> {
  const grouped: Record<WalmartZoneId, MappedGroceryItem[]> = {
    ZONE_1_HOUSEHOLD: [],
    ZONE_2_PANTRY_DRY: [],
    ZONE_3_MEAT: [],
    ZONE_4_DAIRY: [],
    ZONE_5_PRODUCE_BAKERY: [],
    ZONE_6_FROZEN: [],
    ZONE_7_FRONT: [],
  };

  items.forEach((item) => {
    if (grouped[item.zoneId]) {
      grouped[item.zoneId].push(item);
    } else {
      grouped.ZONE_2_PANTRY_DRY.push(item);
    }
  });

  return grouped;
}
