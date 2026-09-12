import { MappedGroceryItem, WalmartZoneId } from './types';

export interface Point2D {
  x: number; // percentage 0 to 100 on canvas
  y: number; // percentage 0 to 100 on canvas
}

export const STORE_ENTRANCE_POINT: Point2D = { x: 78, y: 92 }; // Grocery Entrance (Anna, TX)
export const STORE_CHECKOUT_POINT: Point2D = { x: 50, y: 88 }; // Registers Z1 - Z43

export function getItemCoordinates(item: MappedGroceryItem): Point2D {
  const lowerAisle = item.aisleTag.toLowerCase();
  const num = item.aisleNumber;

  // Grocery Aisles A1 through A32 (Center-Right Grocery Block in Anna Supercenter)
  if (lowerAisle.startsWith('aisle a') || lowerAisle.startsWith('a')) {
    if (num >= 31) return { x: 80, y: 20 }; // A31 (odd top face) / A32 (even bottom face) - Cleaning
    if (num >= 29) return { x: 80, y: 23 }; // A29 / A30 - Cleaning
    if (num >= 27) return { x: 80, y: 26 }; // A27 / A28 - Household Paper
    if (num >= 25) return { x: 80, y: 29 }; // A25 / A26 - Household / Snacks
    if (num >= 23) return { x: 80, y: 32 }; // A23 / A24 - Snacks & Bev
    if (num >= 21) return { x: 80, y: 35 }; // A21 / A22 - Snacks
    if (num >= 19) return { x: 80, y: 38 }; // A19 / A20 - Grocery
    if (num >= 17) return { x: 80, y: 41 }; // A17 / A18 - Grocery
    if (num >= 15) return { x: 80, y: 44 }; // A15 / A16 - Grocery
    if (num >= 13) return { x: 80, y: 47 }; // A13 / A14 - Grocery
    if (num >= 11) return { x: 80, y: 50 }; // A11 / A12 - Grocery
    if (num >= 9)  return { x: 80, y: 53 }; // A9 / A10 - Alcohol / Bev
    if (num >= 7)  return { x: 80, y: 56 }; // A7 / A8 - Alcohol / Bev
    if (num >= 5)  return { x: 80, y: 59 }; // A5 / A6 - Food / Pantry
    if (num >= 3)  return { x: 80, y: 62 }; // A3 / A4 - Frozen Cases
    if (num >= 1)  return { x: 80, y: 65 }; // A1 / A2 - Frozen Cases
  }

  // Zone 1: Household, Baby, Toys, Pets, Health & Beauty (Anna Layout)
  if (item.zoneId === 'ZONE_1_HOUSEHOLD') {
    if (lowerAisle.startsWith('e') || lowerAisle.includes('baby')) return { x: 58, y: 38 }; // Baby E1–E9
    if (lowerAisle.startsWith('i') || lowerAisle.includes('toy')) return { x: 12, y: 38 }; // Toys I1–I27
    if (lowerAisle.startsWith('j') || lowerAisle.includes('pet')) return { x: 62, y: 15 }; // Pets J1–J21
    if (lowerAisle.startsWith('g')) return { x: 22, y: 78 }; // Health & Beauty G1–G37
    if (num >= 30) return { x: 80, y: 23 }; // A29 / A30 - Detergent / Cleaning
    if (num >= 28) return { x: 80, y: 26 }; // A27 / A28 - Paper Goods
    return { x: 80, y: 29 }; // A25 / A26
  }

  // Zone 2: Heavy Dry Pantry
  if (item.zoneId === 'ZONE_2_PANTRY_DRY') {
    if (num <= 4) return { x: 80, y: 59 }; // Pasta / Canned (A4/A5)
    if (num <= 10) return { x: 80, y: 53 }; // Spices / Oils (A7-A10)
    if (num <= 16) return { x: 80, y: 44 }; // Cereal / Coffee (A11-A16)
    if (num <= 22) return { x: 80, y: 35 }; // Snacks / Chips (A17-A22)
    return { x: 80, y: 32 }; // Beverages (A23-A26)
  }

  // Zone 3: Meat & Seafood (Right Perimeter Wall A34/A35/AC1 in Anna Layout)
  if (item.zoneId === 'ZONE_3_MEAT' || lowerAisle.includes('meat') || lowerAisle.includes('a34') || lowerAisle.includes('a35')) {
    return { x: 94, y: 40 };
  }

  // Zone 4: Dairy Wall (Top Right Back Wall in Anna Layout)
  if (item.zoneId === 'ZONE_4_DAIRY' || lowerAisle.includes('dairy') || lowerAisle.includes('a33')) {
    return { x: 80, y: 14 };
  }

  // Zone 5: Produce & Bakery (Front Right Door Area in Anna Layout)
  if (item.zoneId === 'ZONE_5_PRODUCE_BAKERY') {
    if (lowerAisle.includes('bakery') || lowerAisle.includes('ac1')) return { x: 94, y: 65 };
    return { x: 80, y: 72 }; // Fresh Produce Diagonal Tables
  }

  // Zone 6: Frozen Foods & Ice Cream (A1 - A4 Area)
  if (item.zoneId === 'ZONE_6_FROZEN' || lowerAisle.includes('frozen')) {
    return { x: 80, y: 63 };
  }

  // Zone 7: Front End / Checkout (Registers Z1 - Z43)
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
