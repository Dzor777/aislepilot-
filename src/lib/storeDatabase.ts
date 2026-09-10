import { WalmartZoneId } from './types';

export interface CategoryMapping {
  keywords: string[];
  categoryName: string;
  zoneId: WalmartZoneId;
  aisleTag: string;
  aisleNumber: number;
}

export const WALMART_DEPARTMENT_TAXONOMY: CategoryMapping[] = [
  // ZONE 1: Household, Paper Goods, Cleaning (Aisles A26 - A32 / Household)
  {
    keywords: ['tide', 'detergent', 'downy', 'gain', 'laundry', 'fabric softener', 'bleach', 'stain remover'],
    categoryName: 'Laundry & Detergent',
    zoneId: 'ZONE_1_HOUSEHOLD',
    aisleTag: 'Aisle A30',
    aisleNumber: 30,
  },
  {
    keywords: ['paper towel', 'paper towels', 'bounty', 'toilet paper', 'charmin', 'scott', 'kleenex', 'napkin', 'napkins', 'tissue', 'tissues'],
    categoryName: 'Paper Products & Tissues',
    zoneId: 'ZONE_1_HOUSEHOLD',
    aisleTag: 'Aisle A28',
    aisleNumber: 28,
  },
  {
    keywords: ['trash bag', 'trash bags', 'glad', 'hefty', 'ziploc', 'foil', 'aluminum foil', 'cling wrap', 'parchment paper', 'sponge', 'sponges', 'lysol', 'clorox', 'dish soap', 'cascade', 'dawn'],
    categoryName: 'Cleaning & Food Storage',
    zoneId: 'ZONE_1_HOUSEHOLD',
    aisleTag: 'Aisle A26',
    aisleNumber: 26,
  },
  {
    keywords: ['shampoo', 'conditioner', 'soap', 'body wash', 'toothpaste', 'deodorant', 'razor', 'lotion'],
    categoryName: 'Personal Care & Hygiene',
    zoneId: 'ZONE_1_HOUSEHOLD',
    aisleTag: 'Aisle A32',
    aisleNumber: 32,
  },

  // ZONE 2: Heavy Dry Pantry & Center Aisles (Aisles A1 - A25)
  {
    keywords: ['soup', 'soups', 'campbell', 'progresso', 'broth', 'ramen', 'noodle soup', 'canned tomato', 'tomato paste', 'canned beans', 'black beans', 'pinto beans', 'baked beans', 'canned corn', 'green beans', 'canned tuna', 'canned chicken'],
    categoryName: 'Canned Goods & Soups',
    zoneId: 'ZONE_2_PANTRY_DRY',
    aisleTag: 'Aisle A2',
    aisleNumber: 2,
  },
  {
    keywords: ['pasta', 'spaghetti', 'penne', 'macaroni', 'noodle', 'noodles', 'barilla', 'marinara', 'pasta sauce', 'tomato sauce', 'rice', 'jasmine rice', 'quinoa', 'mac and cheese', 'craft mac'],
    categoryName: 'Pasta, Rice & Grains',
    zoneId: 'ZONE_2_PANTRY_DRY',
    aisleTag: 'Aisle A4',
    aisleNumber: 4,
  },
  {
    keywords: ['ketchup', 'mustard', 'mayo', 'mayonnaise', 'bbq sauce', 'barbecue sauce', 'salad dressing', 'ranch', 'olive oil', 'vegetable oil', 'cooking spray', 'vinegar', 'hot sauce', 'salsa', 'taco seasoning', 'soy sauce', 'teriyaki'],
    categoryName: 'Condiments, Oils & Dressings',
    zoneId: 'ZONE_2_PANTRY_DRY',
    aisleTag: 'Aisle A7',
    aisleNumber: 7,
  },
  {
    keywords: ['flour', 'sugar', 'baking powder', 'baking soda', 'vanilla', 'yeast', 'chocolate chips', 'cake mix', 'brownie mix', 'pancake mix', 'syrup', 'maple syrup', 'honey', 'spices', 'salt', 'pepper', 'cinnamon'],
    categoryName: 'Baking & Spices',
    zoneId: 'ZONE_2_PANTRY_DRY',
    aisleTag: 'Aisle A9',
    aisleNumber: 9,
  },
  {
    keywords: ['cereal', 'cheerios', 'oatmeal', 'oats', 'frosted flakes', 'granola', 'pop tarts', 'cereal bars', 'poptarts'],
    categoryName: 'Breakfast & Cereal',
    zoneId: 'ZONE_2_PANTRY_DRY',
    aisleTag: 'Aisle A12',
    aisleNumber: 12,
  },
  {
    keywords: ['coffee', 'folgers', 'starbucks', 'k-cup', 'k cups', 'coffee pods', 'tea', 'tea bags', 'creamer powder', 'hot cocoa'],
    categoryName: 'Coffee & Tea',
    zoneId: 'ZONE_2_PANTRY_DRY',
    aisleTag: 'Aisle A14',
    aisleNumber: 14,
  },
  {
    keywords: ['chips', 'lay', 'lays', 'doritos', 'cheetos', 'tostitos', 'tortilla chips', 'potato chips', 'pretzels', 'popcorn', 'pringles', 'nuts', 'peanuts', 'almonds', 'crackers', 'cheez it', 'goldfish', 'cookies', 'oreos', 'candy', 'chocolate'],
    categoryName: 'Snacks, Chips & Candy',
    zoneId: 'ZONE_2_PANTRY_DRY',
    aisleTag: 'Aisle A18',
    aisleNumber: 18,
  },
  {
    keywords: ['soda', 'coca-cola', 'coke', 'pepsi', 'sprite', 'dr pepper', 'mountain dew', 'water', 'bottled water', 'gatorade', 'powerade', 'seltzer', 'sparkling water', 'juice', 'apple juice', 'orange juice shelf'],
    categoryName: 'Beverages, Water & Soda',
    zoneId: 'ZONE_2_PANTRY_DRY',
    aisleTag: 'Aisle A22',
    aisleNumber: 22,
  },
  {
    keywords: ['peanut butter', 'jelly', 'jam', 'piff', 'skippy', 'smuckers', 'nutella'],
    categoryName: 'Spreads & PBJ',
    zoneId: 'ZONE_2_PANTRY_DRY',
    aisleTag: 'Aisle A6',
    aisleNumber: 6,
  },

  // ZONE 3: Fresh Meat & Seafood (Back Perimeter)
  {
    keywords: ['ground beef', 'steak', 'beef', 'roast beef', 'ribeye', 'sirloin', 'chicken', 'chicken breast', 'chicken thighs', 'wings', 'turkey', 'ground turkey', 'pork', 'pork chops', 'bacon', 'sausage', 'salmon', 'shrimp', 'tilapia', 'fish fillet', 'crab', 'lobster'],
    categoryName: 'Fresh Meat & Seafood',
    zoneId: 'ZONE_3_MEAT',
    aisleTag: 'Meat Dept',
    aisleNumber: 50,
  },

  // ZONE 4: Dairy & Refrigerated (Back / Side Wall)
  {
    keywords: ['milk', '2% milk', 'whole milk', 'skim milk', 'almond milk', 'oat milk', 'heavy cream', 'half and half', 'creamer', 'coffee creamer', 'butter', 'unsalted butter', 'margarine', 'eggs', 'large eggs', 'egg whites', 'cheese', 'cheddar cheese', 'mozzarella', 'shredded cheese', 'sliced cheese', 'cream cheese', 'sour cream', 'yogurt', 'chobani', 'greek yogurt', 'cottage cheese'],
    categoryName: 'Dairy & Refrigerated',
    zoneId: 'ZONE_4_DAIRY',
    aisleTag: 'Dairy Wall',
    aisleNumber: 60,
  },

  // ZONE 5: Produce & Bakery (Door-Adjacent & Delicate Goods)
  {
    keywords: ['banana', 'bananas', 'apple', 'apples', 'avocado', 'avocados', 'strawberry', 'strawberries', 'blueberry', 'blueberries', 'grapes', 'lemon', 'lemons', 'lime', 'limes', 'orange', 'oranges', 'tomato', 'tomatoes', 'onion', 'onions', 'potato', 'potatoes', 'garlic', 'lettuce', 'spinach', 'salad', 'salad kit', 'cucumber', 'carrots', 'broccoli', 'peppers', 'bell pepper', 'floral', 'flowers'],
    categoryName: 'Fresh Produce',
    zoneId: 'ZONE_5_PRODUCE_BAKERY',
    aisleTag: 'Produce',
    aisleNumber: 70,
  },
  {
    keywords: ['bread', 'french bread', 'white bread', 'wheat bread', 'bagel', 'bagels', 'hamburger buns', 'hot dog buns', 'tortilla', 'tortillas', 'croissant', 'muffin', 'muffins', 'donut', 'donuts', 'cake', 'cupcakes', 'pie', 'deli', 'rotisserie chicken', 'sliced turkey deli', 'ham deli'],
    categoryName: 'Bakery & Fresh Deli',
    zoneId: 'ZONE_5_PRODUCE_BAKERY',
    aisleTag: 'Bakery & Deli',
    aisleNumber: 75,
  },

  // ZONE 6: Frozen Foods & Ice Cream (Always Last Stop!)
  {
    keywords: ['ice cream', 'ben & jerry', 'ben and jerry', 'haagen dazs', 'frozen pizza', 'digiorno', 'tombstone', 'frozen waffles', 'eggo', 'frozen meals', 'stouffers', 'hot pockets', 'frozen chicken nuggets', 'french fries frozen', 'frozen veggies', 'frozen fruit', 'popsicle', 'ice pops'],
    categoryName: 'Frozen Foods & Ice Cream',
    zoneId: 'ZONE_6_FROZEN',
    aisleTag: 'Frozen Aisle F4',
    aisleNumber: 85,
  },

  // ZONE 7: Front End / Checkout
  {
    keywords: ['gum', 'magazines', 'gift card', 'ice bag', 'reusable bag'],
    categoryName: 'Checkout Grab & Go',
    zoneId: 'ZONE_7_FRONT',
    aisleTag: 'Registers',
    aisleNumber: 99,
  },
];

// Common handwritten shorthand abbreviations dictionary
export const SHORTHAND_DICTIONARY: Record<string, string> = {
  'mlk': 'Milk',
  'bns': 'Bananas',
  'chx': 'Chicken',
  'chx brst': 'Chicken Breast',
  'grnd beef': 'Ground Beef',
  'gr beef': 'Ground Beef',
  't-p': 'Toilet Paper',
  'tp': 'Toilet Paper',
  'p-t': 'Paper Towels',
  'pt': 'Paper Towels',
  'pb': 'Peanut Butter',
  'p&j': 'Peanut Butter and Jelly',
  'coke': 'Coca-Cola',
  'g-ade': 'Gatorade',
  'o-j': 'Orange Juice',
  'oj': 'Orange Juice',
  'mac & cheese': 'Macaroni and Cheese',
  'mac and cheese': 'Macaroni and Cheese',
  'chiz': 'Cheese',
  'avos': 'Avocados',
  'tots': 'Tater Tots',
  'b-scuits': 'Biscuits',
};

export function classifyGroceryItem(rawText: string): {
  cleanName: string;
  category: string;
  zoneId: WalmartZoneId;
  aisleTag: string;
  aisleNumber: number;
} {
  let cleaned = rawText
    .trim()
    .replace(/^[-•*\d.]+\s*/, '') // Remove bullet numbers/points
    .replace(/\s*\(\d+.*?\)/g, '') // Remove parenthetical quantities like (2 cans)
    .replace(/\s*\b\d+\s*(lb|oz|gal|ct|pack|pk|box|can|cans|bottle|bottles)\b/gi, ''); // Remove units

  const lowerStr = cleaned.toLowerCase();

  // Check shorthand lookup
  let expanded = cleaned;
  if (SHORTHAND_DICTIONARY[lowerStr]) {
    expanded = SHORTHAND_DICTIONARY[lowerStr];
  } else {
    // Check token replacements
    for (const [abbr, full] of Object.entries(SHORTHAND_DICTIONARY)) {
      if (lowerStr.includes(abbr)) {
        expanded = cleaned.replace(new RegExp(`\\b${abbr}\\b`, 'gi'), full);
        break;
      }
    }
  }

  const searchTarget = expanded.toLowerCase();

  // Search taxonomy for keyword match
  for (const category of WALMART_DEPARTMENT_TAXONOMY) {
    for (const keyword of category.keywords) {
      if (searchTarget.includes(keyword)) {
        return {
          cleanName: expanded,
          category: category.categoryName,
          zoneId: category.zoneId,
          aisleTag: category.aisleTag,
          aisleNumber: category.aisleNumber,
        };
      }
    }
  }

  // Fallback for unknown items: map to Dry Pantry Center Aisles
  return {
    cleanName: expanded || rawText,
    category: 'General Pantry',
    zoneId: 'ZONE_2_PANTRY_DRY',
    aisleTag: 'Aisle A10',
    aisleNumber: 10,
  };
}
