import { WalmartZoneId } from './types';

export interface CategoryMapping {
  keywords: string[];
  categoryName: string;
  zoneId: WalmartZoneId;
  aisleTag: string;
  aisleNumber: number;
}

export const WALMART_DEPARTMENT_TAXONOMY: CategoryMapping[] = [
  // ZONE 1: Household, Baby, Toys, Pets, Health/Beauty & General Merchandise
  {
    keywords: ['baby toy', 'baby toys', 'teether', 'rattle', 'pacifier', 'diaper', 'diapers', 'pampers', 'huggies', 'baby wipes', 'wipes', 'baby food', 'gerber', 'formula', 'enfamil', 'similac'],
    categoryName: 'Baby & Infant Care',
    zoneId: 'ZONE_1_HOUSEHOLD',
    aisleTag: 'Aisle E7',
    aisleNumber: 7,
  },
  {
    keywords: ['toy', 'toys', 'game', 'board game', 'puzzle', 'lego', 'barbie', 'hot wheels', 'action figure', 'doll'],
    categoryName: 'Toys & Games',
    zoneId: 'ZONE_1_HOUSEHOLD',
    aisleTag: 'Aisle I9',
    aisleNumber: 9,
  },
  {
    keywords: ['dog food', 'cat food', 'dog treats', 'cat litter', 'pet toy', 'dog toy', 'purina', 'blue buffalo', 'pedigree', 'tidy cats'],
    categoryName: 'Pet Supplies',
    zoneId: 'ZONE_1_HOUSEHOLD',
    aisleTag: 'Aisle J5',
    aisleNumber: 5,
  },
  {
    keywords: ['fabric', 'yarn', 'craft', 'crafts', 'paint brush', 'acrylic paint', 'glue gun', 'scissors'],
    categoryName: 'Arts & Crafts',
    zoneId: 'ZONE_1_HOUSEHOLD',
    aisleTag: 'Aisle J15',
    aisleNumber: 15,
  },
  {
    keywords: ['tv', 'television', 'headphone', 'headphones', 'earbuds', 'charger', 'phone case', 'hdmi', 'video game', 'ps5', 'xbox', 'switch controller'],
    categoryName: 'Electronics',
    zoneId: 'ZONE_1_HOUSEHOLD',
    aisleTag: 'Aisle K15',
    aisleNumber: 15,
  },
  {
    keywords: ['motor oil', 'car battery', 'wiper blades', 'car wash', 'tire shine', 'antifreeze'],
    categoryName: 'Auto Care',
    zoneId: 'ZONE_1_HOUSEHOLD',
    aisleTag: 'Aisle L23',
    aisleNumber: 23,
  },
  {
    keywords: ['hammer', 'screwdriver', 'tape measure', 'light bulb', 'air filter', 'drill', 'nails', 'screws', 'paint bucket'],
    categoryName: 'Hardware & Paint',
    zoneId: 'ZONE_1_HOUSEHOLD',
    aisleTag: 'Aisle L11',
    aisleNumber: 11,
  },
  {
    keywords: ['potting soil', 'fertilizer', 'garden hose', 'lawn mower', 'patio chair', 'plant pot'],
    categoryName: 'Garden Center',
    zoneId: 'ZONE_1_HOUSEHOLD',
    aisleTag: 'Aisle Y11',
    aisleNumber: 11,
  },
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
    keywords: ['shampoo', 'conditioner', 'soap', 'body wash', 'toothpaste', 'deodorant', 'razor', 'lotion', 'band aid', 'vitamins', 'advil', 'tylenol', 'tums', 'makeup', 'lipstick', 'mascara', 'sunscreen'],
    categoryName: 'Health & Beauty',
    zoneId: 'ZONE_1_HOUSEHOLD',
    aisleTag: 'Aisle G15',
    aisleNumber: 15,
  },
  {
    keywords: ['pillow', 'towel', 'bed sheets', 'blanket', 'curtain', 'cookware', 'frying pan', 'pot', 'blender', 'toaster', 'microwave'],
    categoryName: 'Home & Kitchen',
    zoneId: 'ZONE_1_HOUSEHOLD',
    aisleTag: 'Aisle H21',
    aisleNumber: 21,
  },
  {
    keywords: ['socks', 'underwear', 't-shirt', 'shirt', 'pants', 'jeans', 'shoes', 'boots', 'flip flops', 'jacket'],
    categoryName: 'Apparel & Shoes',
    zoneId: 'ZONE_1_HOUSEHOLD',
    aisleTag: 'Aisle B15',
    aisleNumber: 15,
  },

  // ZONE 2: Heavy Dry Pantry & Specialty Center Aisles (Aisles A1 - A25)
  {
    keywords: ['gluten free pasta', 'gluten-free pasta', 'almond flour', 'chia seeds', 'flax seed', 'keto tortilla', 'keto tortillas', 'gluten free flour', 'organic rice'],
    categoryName: 'Specialty & Organic Grains',
    zoneId: 'ZONE_2_PANTRY_DRY',
    aisleTag: 'Aisle A4',
    aisleNumber: 4,
  },
  {
    keywords: ['soup', 'soups', 'campbell', 'progresso', 'broth', 'ramen', 'noodle soup', 'canned tomato', 'tomato paste', 'canned beans', 'black beans', 'pinto beans', 'baked beans', 'canned corn', 'green beans', 'canned tuna', 'canned chicken', 'canned salmon'],
    categoryName: 'Canned Goods & Soups',
    zoneId: 'ZONE_2_PANTRY_DRY',
    aisleTag: 'Aisle A2',
    aisleNumber: 2,
  },
  {
    keywords: ['pasta', 'spaghetti', 'penne', 'macaroni', 'noodle', 'noodles', 'barilla', 'marinara', 'pasta sauce', 'tomato sauce', 'rice', 'jasmine rice', 'quinoa', 'mac and cheese', 'kraft mac'],
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
    keywords: ['soda', 'coca-cola', 'coke', 'pepsi', 'sprite', 'dr pepper', 'mountain dew', 'water', 'bottled water', 'gatorade', 'powerade', 'seltzer', 'sparkling water', 'juice', 'apple juice', 'orange juice shelf', 'beer', 'wine', 'hard seltzer'],
    categoryName: 'Beverages, Water & Beer',
    zoneId: 'ZONE_2_PANTRY_DRY',
    aisleTag: 'Aisle A22',
    aisleNumber: 22,
  },
  {
    keywords: ['peanut butter', 'jelly', 'jam', 'jif', 'skippy', 'smuckers', 'nutella'],
    categoryName: 'Spreads & PBJ',
    zoneId: 'ZONE_2_PANTRY_DRY',
    aisleTag: 'Aisle A6',
    aisleNumber: 6,
  },

  // ZONE 3: Fresh Meat & Seafood (Right Perimeter Wall)
  {
    keywords: ['ground beef', 'steak', 'beef', 'roast beef', 'ribeye', 'sirloin', 'chicken', 'chicken breast', 'chicken thighs', 'wings', 'turkey', 'ground turkey', 'pork', 'pork chops', 'bacon', 'sausage', 'salmon', 'shrimp', 'tilapia', 'fish fillet', 'crab', 'lobster'],
    categoryName: 'Fresh Meat & Seafood',
    zoneId: 'ZONE_3_MEAT',
    aisleTag: 'Meat Wall A34',
    aisleNumber: 34,
  },

  // ZONE 4: Dairy & Refrigerated (Top Perimeter Wall)
  {
    keywords: ['milk', '2% milk', 'whole milk', 'skim milk', 'almond milk', 'oat milk', 'heavy cream', 'half and half', 'creamer', 'coffee creamer', 'butter', 'unsalted butter', 'margarine', 'eggs', 'large eggs', 'egg whites', 'cheese', 'cheddar cheese', 'mozzarella', 'shredded cheese', 'sliced cheese', 'cream cheese', 'sour cream', 'yogurt', 'chobani', 'greek yogurt', 'cottage cheese'],
    categoryName: 'Dairy & Refrigerated',
    zoneId: 'ZONE_4_DAIRY',
    aisleTag: 'Dairy Wall A33',
    aisleNumber: 33,
  },

  // ZONE 5: Produce & Bakery (Front Right Door Area & Perimeter)
  {
    keywords: ['gluten free bread', 'gluten-free bread', 'keto bread', 'udi bread', 'canyon bakehouse'],
    categoryName: 'Specialty Bakery (GF)',
    zoneId: 'ZONE_5_PRODUCE_BAKERY',
    aisleTag: 'Bakery A5',
    aisleNumber: 74,
  },
  {
    keywords: ['banana', 'bananas', 'apple', 'apples', 'avocado', 'avocados', 'strawberry', 'strawberries', 'blueberry', 'blueberries', 'grapes', 'lemon', 'lemons', 'lime', 'limes', 'orange', 'oranges', 'tomato', 'tomatoes', 'onion', 'onions', 'potato', 'potatoes', 'garlic', 'lettuce', 'spinach', 'salad', 'salad kit', 'cucumber', 'carrots', 'broccoli', 'peppers', 'bell pepper', 'floral', 'flowers'],
    categoryName: 'Fresh Produce',
    zoneId: 'ZONE_5_PRODUCE_BAKERY',
    aisleTag: 'Produce Islands',
    aisleNumber: 70,
  },
  {
    keywords: ['bread', 'french bread', 'white bread', 'wheat bread', 'bagel', 'bagels', 'hamburger buns', 'hot dog buns', 'tortilla', 'tortillas', 'croissant', 'muffin', 'muffins', 'donut', 'donuts', 'cake', 'cupcakes', 'pie'],
    categoryName: 'Fresh Bakery',
    zoneId: 'ZONE_5_PRODUCE_BAKERY',
    aisleTag: 'Bakery',
    aisleNumber: 75,
  },
  {
    keywords: ['deli', 'rotisserie chicken', 'sliced turkey deli', 'ham deli', 'sub sandwich', 'deli cheese', 'potato salad', 'coleslaw'],
    categoryName: 'Fresh Deli (AD1)',
    zoneId: 'ZONE_5_PRODUCE_BAKERY',
    aisleTag: 'Deli AD1',
    aisleNumber: 76,
  },

  // ZONE 6: Frozen Foods & Ice Cream (Aisles A1–A3)
  {
    keywords: ['ice cream', 'ben & jerry', 'ben and jerry', 'haagen dazs', 'frozen pizza', 'digiorno', 'tombstone', 'frozen waffles', 'eggo', 'frozen meals', 'stouffers', 'hot pockets', 'frozen chicken nuggets', 'french fries frozen', 'frozen veggies', 'frozen fruit', 'popsicle', 'ice pops'],
    categoryName: 'Frozen Foods & Ice Cream',
    zoneId: 'ZONE_6_FROZEN',
    aisleTag: 'Frozen Aisle A1',
    aisleNumber: 1,
  },

  // ZONE 7: Front End / Checkout (Registers Z1–Z43)
  {
    keywords: ['gum', 'magazines', 'gift card', 'ice bag', 'reusable bag'],
    categoryName: 'Checkout Grab & Go',
    zoneId: 'ZONE_7_FRONT',
    aisleTag: 'Registers Z1-Z43',
    aisleNumber: 99,
  },
];

// Common handwritten & typed shorthand abbreviations dictionary
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
  'pbj': 'Peanut Butter and Jelly',
  'pb&j': 'Peanut Butter and Jelly',
  'p&j': 'Peanut Butter and Jelly',
  'coke': 'Coca-Cola',
  'g-ade': 'Gatorade',
  'gade': 'Gatorade',
  'o-j': 'Orange Juice',
  'oj': 'Orange Juice',
  'mac & cheese': 'Macaroni and Cheese',
  'mac and cheese': 'Macaroni and Cheese',
  'chiz': 'Cheese',
  'avos': 'Avocados',
  'tots': 'Tater Tots',
  'b-scuits': 'Biscuits',
  'gf bread': 'Gluten Free Bread',
  'gf pasta': 'Gluten Free Pasta',
  'bbq': 'Barbecue Sauce',
  'rotisserie': 'Rotisserie Chicken',
  'shampoo': 'Shampoo',
  'wipes': 'Baby Wipes',
  'diapers': 'Diapers',
  'strawberries': 'Strawberries',
  'apples': 'Apples',
  'cereal': 'Cereal',
  'coffee': 'Coffee',
  'water': 'Bottled Water',
  'eggs': 'Eggs',
  'butter': 'Butter',
  'bread': 'Bread',
  'bacon': 'Bacon',
  'pizza': 'Frozen Pizza',
  'ice cream': 'Ice Cream',
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
