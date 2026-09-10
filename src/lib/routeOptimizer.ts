import { MappedGroceryItem, WalmartZoneId } from './types';
import { WALMART_ZONES } from '@/sampleData/walmartStores';
import { classifyGroceryItem } from './storeDatabase';
import { CacheManager } from './cacheManager';

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

      const zoneWeight = WALMART_ZONES[zoneId]?.sortWeight || 2;
      const sortKey = zoneWeight * 1000 + finalAisleNumber;

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

  // Sort items sequentially by calculated sortKey (Heavy Goods -> Center Aisles -> Meat -> Dairy -> Produce/Bakery -> Frozen -> Checkout)
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
