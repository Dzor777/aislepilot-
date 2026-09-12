import { MappedGroceryItem, WalmartZoneId } from './types';

export interface Point2D {
  x: number; // percentage 0 to 100 on canvas
  y: number; // percentage 0 to 100 on canvas
}

export const STORE_ENTRANCE_POINT: Point2D = { x: 88, y: 92 }; // Grocery Entrance (Anna, TX)
export const STORE_CHECKOUT_POINT: Point2D = { x: 50, y: 88 }; // Registers Z1 - Z43

export function getItemCoordinates(item: MappedGroceryItem): Point2D {
  const lowerAisle = item.aisleTag.toLowerCase();
  const num = item.aisleNumber;

  // 1. Specific Department Codes & Overrides
  if (lowerAisle.includes('deli') || lowerAisle.includes('ad1')) {
    return { x: 68, y: 82 };
  }
  if (lowerAisle.includes('bakery')) {
    return { x: 92, y: 72 };
  }
  if (lowerAisle.includes('produce')) {
    return { x: 82, y: 76 };
  }
  if (lowerAisle.includes('dairy') || lowerAisle.includes('a33')) {
    return { x: 74, y: 11 };
  }
  if (lowerAisle.includes('meat') || lowerAisle.includes('a34') || lowerAisle.includes('a35')) {
    return { x: 92, y: 44 };
  }

  // 2. Center-Right Horizontal Grocery Aisles (A1 through A31)
  if (lowerAisle.startsWith('aisle a') || lowerAisle.startsWith('a')) {
    if (num >= 31) return { x: 74, y: 19 }; // A31 Cleaning
    if (num >= 29) return { x: 74, y: 23 }; // A29 Cleaning
    if (num >= 27) return { x: 74, y: 27 }; // A27 Household Paper
    if (num >= 25) return { x: 74, y: 31 }; // A25 Household / Snacks
    if (num >= 23) return { x: 74, y: 35 }; // A23 Snacks & Bev
    if (num >= 21) return { x: 74, y: 39 }; // A21 Snacks
    if (num >= 19) return { x: 74, y: 43 }; // A19 Grocery
    if (num >= 17) return { x: 74, y: 47 }; // A17 Grocery
    if (num >= 15) return { x: 74, y: 51 }; // A15 Grocery
    if (num >= 13) return { x: 74, y: 55 }; // A13 Grocery
    if (num >= 11) return { x: 74, y: 59 }; // A11 Grocery
    if (num >= 9)  return { x: 74, y: 63 }; // A9 Alcohol / Bev
    if (num >= 7)  return { x: 74, y: 67 }; // A7 Alcohol / Bev
    if (num >= 5)  return { x: 74, y: 71 }; // A5 Pantry / Food
    if (num >= 3)  return { x: 74, y: 75 }; // A3 Frozen
    if (num >= 1)  return { x: 74, y: 79 }; // A1 Frozen
  }

  // 3. General Merchandise Letter Aisles
  // Health & Beauty (G1–G37)
  if (lowerAisle.startsWith('g')) {
    return { x: 30, y: 82 };
  }
  // Apparel & Shoes (B/C/D/E)
  if (lowerAisle.startsWith('b') || lowerAisle.startsWith('c') || lowerAisle.startsWith('d')) {
    return { x: 32, y: 64 };
  }
  // Baby (E1–E15)
  if (lowerAisle.startsWith('e')) {
    return { x: 44, y: 48 };
  }
  // Home, Kitchen, Bedding, Bath, Laundry (H1–H53)
  if (lowerAisle.startsWith('h')) {
    if (num >= 37) return { x: 34, y: 18 }; // Furniture / Laundry
    if (num >= 25) return { x: 24, y: 28 }; // Bedding / Bath
    if (num >= 19) return { x: 34, y: 34 }; // Kitchen
    return { x: 24, y: 42 }; // Home
  }
  // Toys & Games (I1–I17), Sports (I19–I27)
  if (lowerAisle.startsWith('i')) {
    if (num >= 19) return { x: 14, y: 22 }; // Sports
    return { x: 14, y: 32 }; // Toys
  }
  // Pets (J1–J9), Arts & Crafts (J11–J23)
  if (lowerAisle.startsWith('j')) {
    if (num >= 11) return { x: 44, y: 12 }; // Arts & Crafts
    return { x: 54, y: 12 }; // Pets
  }
  // Electronics (K11–K21)
  if (lowerAisle.startsWith('k')) {
    return { x: 46, y: 12 };
  }
  // Hardware & Auto (L1–L27, X1–X3)
  if (lowerAisle.startsWith('l') || lowerAisle.startsWith('x')) {
    if (num >= 19) return { x: 14, y: 12 }; // Auto
    return { x: 26, y: 12 }; // Hardware & Paint
  }
  // Garden Center (Y1–Y35)
  if (lowerAisle.startsWith('y')) {
    return { x: 8, y: 72 };
  }
  // Clearance / Party / Office (F1–F27)
  if (lowerAisle.startsWith('f')) {
    return { x: 44, y: 28 };
  }

  // 4. Zone Fallback Positions
  if (item.zoneId === 'ZONE_1_HOUSEHOLD') {
    if (num >= 28) return { x: 74, y: 27 };
    return { x: 74, y: 31 };
  }
  if (item.zoneId === 'ZONE_2_PANTRY_DRY') {
    if (num <= 4) return { x: 74, y: 71 };
    if (num <= 10) return { x: 74, y: 63 };
    if (num <= 16) return { x: 74, y: 51 };
    if (num <= 22) return { x: 74, y: 39 };
    return { x: 74, y: 35 };
  }
  if (item.zoneId === 'ZONE_3_MEAT') {
    return { x: 92, y: 44 };
  }
  if (item.zoneId === 'ZONE_4_DAIRY') {
    return { x: 74, y: 11 };
  }
  if (item.zoneId === 'ZONE_5_PRODUCE_BAKERY') {
    return { x: 82, y: 76 };
  }
  if (item.zoneId === 'ZONE_6_FROZEN') {
    return { x: 74, y: 77 };
  }

  // Zone 7: Checkout
  return { x: 50, y: 88 };
}

export function generateSvgPathD(points: Point2D[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    d += ` Q ${midX} ${prev.y}, ${curr.x} ${curr.y}`;
  }

  return d;
}
