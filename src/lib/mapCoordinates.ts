import { MappedGroceryItem, WalmartZoneId } from './types';

export interface Point2D {
  x: number; // percentage 0 to 100
  y: number; // percentage 0 to 100
}

export const STORE_ENTRANCE_POINT: Point2D = { x: 10, y: 92 }; // GM Entrance
export const STORE_CHECKOUT_POINT: Point2D = { x: 48, y: 90 }; // Registers

export function getItemCoordinates(item: MappedGroceryItem): Point2D {
  const lowerAisle = item.aisleTag.toLowerCase();

  // Zone 1: Household, Baby, Toys, Pets
  if (item.zoneId === 'ZONE_1_HOUSEHOLD') {
    if (lowerAisle.includes('h2') || lowerAisle.includes('baby')) return { x: 25, y: 76 };
    if (lowerAisle.includes('e4') || lowerAisle.includes('toy')) return { x: 16, y: 80 };
    if (lowerAisle.includes('i3') || lowerAisle.includes('pet')) return { x: 16, y: 45 };
    if (item.aisleNumber >= 30) return { x: 22, y: 62 }; // Detergent / Personal Care
    if (item.aisleNumber >= 28) return { x: 22, y: 68 }; // Paper Goods
    return { x: 22, y: 72 }; // Cleaning
  }

  // Zone 2: Heavy Dry Pantry (Aisles A1 - A25)
  if (item.zoneId === 'ZONE_2_PANTRY_DRY') {
    const num = item.aisleNumber;
    if (num <= 5) return { x: 35, y: 55 }; // Aisles A1-A5: Canned / Pasta
    if (num <= 10) return { x: 45, y: 55 }; // Aisles A6-A10: Spices / Oils
    if (num <= 15) return { x: 55, y: 55 }; // Aisles A11-A15: Breakfast / Coffee
    if (num <= 20) return { x: 65, y: 55 }; // Aisles A16-A20: Snacks / Chips
    return { x: 75, y: 55 }; // Aisles A21-A25: Soda / Water / Juices
  }

  // Zone 3: Meat & Seafood
  if (item.zoneId === 'ZONE_3_MEAT') {
    return { x: 88, y: 22 };
  }

  // Zone 4: Dairy Wall
  if (item.zoneId === 'ZONE_4_DAIRY') {
    return { x: 86, y: 44 };
  }

  // Zone 5: Produce & Bakery (Door Zone)
  if (item.zoneId === 'ZONE_5_PRODUCE_BAKERY') {
    if (lowerAisle.includes('bakery') || lowerAisle.includes('a5')) return { x: 85, y: 82 };
    return { x: 82, y: 70 }; // Produce
  }

  // Zone 6: Frozen Foods & Ice Cream
  if (item.zoneId === 'ZONE_6_FROZEN') {
    return { x: 62, y: 30 };
  }

  // Zone 7: Front End / Checkout
  return { x: 48, y: 88 };
}

export function generateSvgPathD(points: Point2D[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    // Create a smooth rounded corner path line
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    d += ` Q ${midX} ${prev.y}, ${curr.x} ${curr.y}`;
  }

  return d;
}
