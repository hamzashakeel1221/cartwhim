// Sample catalog. Swap this for products imported from your suppliers
// (HHC Dropshipping, Oshi Dropshipping, ...) or a database / CMS.
// `supplier`, `supplierSku` and `cost` are internal and never shown to shoppers.

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  icon: string; // lucide icon name, see components/icon.tsx
  hue: string; // tailwind gradient classes for placeholder art
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  supplier: string; // id from lib/suppliers.ts
  supplierSku?: string; // the product code on the supplier's catalog
  cost?: number; // PKR, what the supplier charges you (for profit tracking)
  price: number; // PKR
  compareAt?: number; // PKR, original price for showing a discount
  rating: number;
  reviews: number;
  stock: number;
  icon: string;
  images?: string[]; // real product photos go here (put files in /public/products)
  description: string;
  highlights: string[];
  tags?: ("trending" | "deal" | "new")[];
};

export const categories: Category[] = [
  { slug: "electronics", name: "Gadgets & Electronics", blurb: "Earbuds, smartwatches, chargers", icon: "headphones", hue: "from-sky-100 to-indigo-200" },
  { slug: "home-kitchen", name: "Home & Kitchen", blurb: "Smart tools for every ghar", icon: "chef-hat", hue: "from-amber-100 to-orange-200" },
  { slug: "fashion", name: "Fashion & Accessories", blurb: "Bags, watches, wallets", icon: "shopping-bag", hue: "from-rose-100 to-pink-200" },
  { slug: "beauty", name: "Beauty & Personal Care", blurb: "Grooming and skincare", icon: "sparkles", hue: "from-fuchsia-100 to-purple-200" },
  { slug: "kids-toys", name: "Kids & Toys", blurb: "Fun that keeps them busy", icon: "baby", hue: "from-lime-100 to-emerald-200" },
  { slug: "health-fitness", name: "Health & Fitness", blurb: "Stay active at home", icon: "dumbbell", hue: "from-teal-100 to-cyan-200" },
];

export const products: Product[] = [
  {
    slug: "anc-wireless-earbuds",
    name: "Wireless Earbuds with ANC",
    category: "electronics",
    supplier: "hhc",
    price: 3499, compareAt: 5999, rating: 4.6, reviews: 812, stock: 42, icon: "headphones",
    description: "Crystal clear sound with active noise cancellation, touch controls and a pocket-size charging case that lasts all day.",
    highlights: ["Active noise cancellation", "Up to 24 hours with case", "Bluetooth 5.3, instant pairing", "Sweat and splash resistant"],
    tags: ["trending", "deal"],
  },
  {
    slug: "smart-watch-ultra",
    name: "Smart Watch Ultra (Calling)",
    category: "electronics",
    supplier: "oshi",
    price: 4999, compareAt: 8499, rating: 4.4, reviews: 536, stock: 30, icon: "watch",
    description: "Big 2.0 inch display, Bluetooth calling, heart rate and SpO2 tracking, and 100+ sports modes.",
    highlights: ["Bluetooth calling", "Heart rate and SpO2", "7 day battery", "Works with Android and iPhone"],
    tags: ["trending"],
  },
  {
    slug: "20000mah-power-bank",
    name: "20000mAh Fast Charging Power Bank",
    category: "electronics",
    supplier: "hhc",
    price: 3299, compareAt: 4499, rating: 4.7, reviews: 1204, stock: 65, icon: "battery-charging",
    description: "Charge your phone up to 5 times. 22.5W fast charging with USB-C in and out. Perfect for loadshedding.",
    highlights: ["22.5W fast charge", "USB-C and 2x USB-A", "LED power display", "Charges 3 devices at once"],
    tags: ["deal"],
  },
  {
    slug: "rechargeable-led-emergency-light",
    name: "Rechargeable LED Emergency Light",
    category: "electronics",
    supplier: "oshi",
    price: 1899, compareAt: 2799, rating: 4.5, reviews: 389, stock: 80, icon: "lamp",
    description: "Bright LED light that switches on automatically during power cuts. Up to 8 hours of backup.",
    highlights: ["Auto on during power cuts", "8 hours backup", "3 brightness levels", "Wall mount or table use"],
    tags: ["new"],
  },
  {
    slug: "electric-vegetable-chopper",
    name: "Electric Vegetable Chopper",
    category: "home-kitchen",
    supplier: "hhc",
    price: 2499, compareAt: 3999, rating: 4.5, reviews: 674, stock: 55, icon: "chef-hat",
    description: "Chop onions, garlic, chillies and herbs in seconds. Cordless, USB rechargeable and easy to wash.",
    highlights: ["Cordless, USB charging", "Stainless steel blades", "250ml bowl", "One button operation"],
    tags: ["trending", "deal"],
  },
  {
    slug: "digital-air-fryer-4l",
    name: "Digital Air Fryer 4L",
    category: "home-kitchen",
    supplier: "oshi",
    price: 12999, compareAt: 17999, rating: 4.7, reviews: 298, stock: 14, icon: "cooking-pot",
    description: "Crispy pakoras, fries and chicken with up to 85% less oil. 8 preset menus and a touch screen.",
    highlights: ["4 litre basket", "8 preset menus", "Non stick, dishwasher safe", "1 year warranty"],
    tags: ["trending"],
  },
  {
    slug: "spin-mop-bucket-set",
    name: "360° Spin Mop & Bucket Set",
    category: "home-kitchen",
    supplier: "hhc",
    price: 2899, compareAt: 3999, rating: 4.3, reviews: 451, stock: 38, icon: "spray-can",
    description: "Hands free wringing with a foot pedal. Comes with 2 microfiber heads for wet and dry cleaning.",
    highlights: ["Foot pedal spin", "2 microfiber refills", "Extendable handle", "Wheels for easy moving"],
  },
  {
    slug: "glass-water-bottle-set",
    name: "Motivational Water Bottle 2L",
    category: "health-fitness",
    supplier: "oshi",
    price: 1299, compareAt: 1999, rating: 4.6, reviews: 902, stock: 120, icon: "glass-water",
    description: "BPA free 2 litre bottle with time markers to help you drink enough water every day.",
    highlights: ["2 litre capacity", "Hourly time markers", "Leak proof lid with straw", "BPA free"],
    tags: ["deal"],
  },
  {
    slug: "leather-wallet-for-men",
    name: "Genuine Leather Wallet for Men",
    category: "fashion",
    supplier: "hhc",
    price: 1499, compareAt: 2499, rating: 4.4, reviews: 233, stock: 70, icon: "wallet",
    description: "Slim bifold wallet in genuine leather with RFID blocking and 8 card slots.",
    highlights: ["Genuine leather", "RFID blocking", "8 card slots", "Gift box included"],
    tags: ["new"],
  },
  {
    slug: "ladies-handbag-3-piece",
    name: "Ladies Handbag 3 Piece Set",
    category: "fashion",
    supplier: "oshi",
    price: 3999, compareAt: 5999, rating: 4.5, reviews: 318, stock: 25, icon: "shopping-bag",
    description: "Stylish set of a shoulder bag, a clutch and a card pouch in premium faux leather.",
    highlights: ["3 matching pieces", "Premium faux leather", "Adjustable strap", "Available in 4 colours"],
    tags: ["trending"],
  },
  {
    slug: "analog-chain-watch",
    name: "Classic Chain Analog Watch",
    category: "fashion",
    supplier: "hhc",
    price: 2299, compareAt: 3499, rating: 4.2, reviews: 147, stock: 40, icon: "watch",
    description: "Elegant stainless steel chain watch with a date display, made for every occasion.",
    highlights: ["Stainless steel chain", "Date display", "Water resistant", "Gift ready packaging"],
  },
  {
    slug: "hair-straightener-brush",
    name: "Ceramic Hair Straightener Brush",
    category: "beauty",
    supplier: "oshi",
    price: 2199, compareAt: 3499, rating: 4.4, reviews: 587, stock: 48, icon: "sparkles",
    description: "Straighten and smooth hair in minutes with ceramic heating and anti scald bristles.",
    highlights: ["Heats up in 60 seconds", "5 temperature settings", "Anti scald design", "Auto shut off"],
    tags: ["trending", "deal"],
  },
  {
    slug: "mens-grooming-trimmer-kit",
    name: "Men's Grooming Trimmer Kit",
    category: "beauty",
    supplier: "hhc",
    price: 2799, compareAt: 3999, rating: 4.5, reviews: 412, stock: 33, icon: "scissors",
    description: "All in one trimmer for beard, hair, nose and body. Rechargeable with 90 minutes runtime.",
    highlights: ["5 interchangeable heads", "90 min runtime", "Washable blades", "LED battery display"],
  },
  {
    slug: "kids-drawing-tablet",
    name: "LCD Drawing Tablet for Kids",
    category: "kids-toys",
    supplier: "oshi",
    price: 999, compareAt: 1599, rating: 4.6, reviews: 1033, stock: 150, icon: "pencil",
    description: "Mess free 10 inch writing pad. Draw, write and erase with one button. Great for learning.",
    highlights: ["10 inch colourful screen", "One tap erase", "Lock button", "Battery lasts months"],
    tags: ["deal", "trending"],
  },
  {
    slug: "remote-control-stunt-car",
    name: "Remote Control Stunt Car",
    category: "kids-toys",
    supplier: "hhc",
    price: 3499, compareAt: 4999, rating: 4.3, reviews: 209, stock: 22, icon: "car",
    description: "Double sided stunt car that flips and spins 360°. Rechargeable battery included.",
    highlights: ["360° flips", "Rechargeable", "2.4GHz remote", "Shock resistant body"],
    tags: ["new"],
  },
  {
    slug: "resistance-bands-set",
    name: "Resistance Bands Set (5 Pcs)",
    category: "health-fitness",
    supplier: "oshi",
    price: 1599, compareAt: 2499, rating: 4.5, reviews: 344, stock: 90, icon: "dumbbell",
    description: "Five resistance levels for a full body workout at home. Includes door anchor and carry bag.",
    highlights: ["5 resistance levels", "Door anchor and handles", "Ankle straps", "Carry bag included"],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function categoryHue(slug: string) {
  return getCategory(slug)?.hue ?? "from-zinc-100 to-zinc-200";
}
