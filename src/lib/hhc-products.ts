import type { Product } from "./catalog";

// Products sourced from HHC Dropshipping, chosen from what Pakistani stores were advertising most on Meta (Nov 2026).
// supplierSku is the product's page on HHC: https://member.hhcdropshipping.com/en/product/<supplierSku>
// Price = HHC cost + about Rs. 500 margin (ending in 9). compareAt is the struck-through price (about 45% off).
// Photos are HHC's own product photos. rating/reviews start at 0 so the store shows "New" instead of made-up reviews.
export const hhcProducts: Product[] = [
  {
    "slug": "tummy-trimmer-single-spring",
    "name": "Tummy Trimmer (Single Spring)",
    "category": "health-fitness",
    "supplier": "hhc",
    "supplierSku": "tummy-trimmer-single-spring-heavy-duty-fitness-equipment-workout-machine-for-home-gym-exercise",
    "cost": 423,
    "price": 999,
    "compareAt": 1799,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "dumbbell",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/29/0fd3f9ce47b5d58761ff8b275dbbc4bd.jpg"
    ],
    "description": "A heavy-duty spring tummy trimmer for home workouts. Work your abs, arms and legs without going to the gym.",
    "highlights": [
      "Heavy-duty spring",
      "Foot holder and padded handles",
      "Works abs, arms and legs",
      "Small enough to keep under the bed"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ],
    "shipsFrom": "Lahore"
  },
  {
    "slug": "posture-corrector-belt",
    "name": "Posture Corrector Belt",
    "category": "health-fitness",
    "supplier": "hhc",
    "supplierSku": "posture-belt-posture-corrector-belt-back-support-belt-back-pain-relief-shoulder-back-support-belt",
    "cost": 477,
    "price": 999,
    "compareAt": 1799,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "sparkles",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/20/f14e05aaf2ed4005980927edde48b6c3.jpeg"
    ],
    "description": "An adjustable back and shoulder support belt that gently pulls your shoulders back while you sit, work or walk.",
    "highlights": [
      "Adjustable straps",
      "Supports shoulders and upper back",
      "Wear under or over clothes",
      "For men and women"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ],
    "shipsFrom": "Karachi"
  },
  {
    "slug": "kids-lcd-writing-tablet-8-5",
    "name": "Kids LCD Writing Tablet 8.5 inch",
    "category": "kids-toys",
    "supplier": "hhc",
    "supplierSku": "lcd-writing-tablet-drawing-pads-for-kids-85-inch-colorful-lines-doodle-scribble-boards-educational-toys-random-color",
    "cost": 369,
    "price": 899,
    "compareAt": 1699,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "pencil",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/08/15/aba14682878ad04daf2ff24c037eefe2.jpeg"
    ],
    "description": "An 8.5 inch LCD drawing board that writes in colourful lines. Clear the screen with one button and start again. No paper, no mess.",
    "highlights": [
      "8.5 inch screen, colourful lines",
      "One-button clear",
      "Comes with a stylus",
      "Colour sent at random"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ],
    "shipsFrom": "Lahore"
  },
  {
    "slug": "sank-magic-practice-books-4",
    "name": "Sank Magic Practice Books (Pack of 4)",
    "category": "kids-toys",
    "supplier": "hhc",
    "supplierSku": "sank-magic-book-practice-pack-of-4-tracing-handwriting-first-preschool-baby-learning-books-for-kids",
    "cost": 303,
    "price": 899,
    "compareAt": 1699,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "pencil",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/09/WhatsApp-Image-2024-09-01-at-1.09.33-AM-1.jpeg"
    ],
    "description": "Reusable tracing books that help kids practise letters, numbers and drawing. The ink fades away so they can practise again and again.",
    "highlights": [
      "Pack of 4 books",
      "Grooved pages guide the pen",
      "Disappearing ink, reusable",
      "Letters, numbers and drawing"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ],
    "shipsFrom": "Karachi"
  },
  {
    "slug": "magic-water-drawing-book",
    "name": "Magic Water Drawing Book",
    "category": "kids-toys",
    "supplier": "hhc",
    "supplierSku": "magic-water-book-painting-drawing-coloring-board-book-magic-water-pen-random-book-2587398",
    "cost": 156,
    "price": 699,
    "compareAt": 1299,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "baby",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/09/WhatsApp-Image-2024-03-25-at-3.48.31-AM.jpeg"
    ],
    "description": "Fill the pen with water and colours appear on the page. When it dries, the page turns white again. Mess-free fun for small kids.",
    "highlights": [
      "Uses only water, no ink",
      "Pages can be used again",
      "Comes with a water pen",
      "Design sent at random"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ],
    "shipsFrom": "Karachi"
  },
  {
    "slug": "montessori-busy-book",
    "name": "Montessori Busy Book for Kids",
    "category": "kids-toys",
    "supplier": "hhc",
    "supplierSku": "busy-book-montessori-method-educational-learning-activity-book-for-kids",
    "cost": 747,
    "price": 1299,
    "compareAt": 2399,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "baby",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/03/b2bf794ff94fcaf4355cd2273002beac.jpg"
    ],
    "description": "A Montessori-style activity book with matching and sticking activities that keep young kids busy while they learn.",
    "highlights": [
      "Learning activities on every page",
      "Reusable stick-on pieces",
      "Screen-free play",
      "Good for travel"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ]
  },
  {
    "slug": "kids-projection-flashlight",
    "name": "Kids Projection Flashlight Torch",
    "category": "kids-toys",
    "supplier": "hhc",
    "supplierSku": "kids-flashlight-projection-torch-toy-with-slides",
    "cost": 315,
    "price": 899,
    "compareAt": 1699,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "lamp",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/19/a4cb19d9d2e3edf33feff3ea0d082a07.jpg"
    ],
    "description": "A torch toy that projects pictures on the wall from its slides. A fun bedtime story light for kids.",
    "highlights": [
      "Projects pictures on the wall",
      "Comes with slides",
      "Fits small hands",
      "Great bedtime toy"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ]
  },
  {
    "slug": "pop-up-card-holder-wallet",
    "name": "Pop-Up Card Holder Wallet (PU Leather)",
    "category": "fashion",
    "supplier": "hhc",
    "supplierSku": "pu-leather-wallet-pop-up-card-holder-brownblack",
    "cost": 369,
    "price": 899,
    "compareAt": 1699,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "wallet",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/08/17/9f861f9c7f185f0507256cff05c8bed2.jpg"
    ],
    "description": "A slim PU leather wallet with a pop-up card holder. Push the lever and your cards slide out.",
    "highlights": [
      "Pop-up card mechanism",
      "Slim, fits a front pocket",
      "PU leather",
      "Brown or black"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ]
  },
  {
    "slug": "markhor-body-spray-delta",
    "name": "Markhor Body Spray Delta 120ml",
    "category": "beauty",
    "supplier": "hhc",
    "supplierSku": "markhor-body-spray-delta-long-lasting-fragrance-perfume-spray-for-men-non-gas-120ml",
    "cost": 818,
    "price": 1399,
    "compareAt": 2599,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "spray-can",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/04/16/cdb5b8094fd21d6f3cc16449c8f5484f.jpeg"
    ],
    "description": "A long-lasting non-gas body spray for men in a 120ml bottle.",
    "highlights": [
      "120ml bottle",
      "Non-gas spray",
      "Long-lasting fragrance",
      "For men"
    ],
    "tags": [
      "deal",
      "new"
    ]
  },
  {
    "slug": "waterproof-bike-cover",
    "name": "Waterproof Bike Cover (70cc and 125cc)",
    "category": "home-kitchen",
    "supplier": "hhc",
    "supplierSku": "bike-cover-dust-amp-water-proof-universal-70-and-125-scratch-amp-rust-proof-cover-random-color",
    "cost": 428,
    "price": 999,
    "compareAt": 1799,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "car",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/09/Untitled-25-1.jpg"
    ],
    "description": "A universal cover that keeps your 70cc or 125cc bike safe from rain, dust and scratches.",
    "highlights": [
      "Fits 70cc and 125cc bikes",
      "Water and dust proof",
      "Helps prevent scratches and rust",
      "Colour sent at random"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ]
  },
  {
    "slug": "mini-air-pump-bike-cycle",
    "name": "Mini Air Pump for Bikes and Cycles",
    "category": "electronics",
    "supplier": "hhc",
    "supplierSku": "mini-air-pump-for-bikes-cycle-compact-inflator-device-designed-for-portable-air-inflation-and-convenient-pumping-maintenance-routine-random-color",
    "cost": 488,
    "price": 999,
    "compareAt": 1799,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "car",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/07/22/d5be612c8a9d5cf020ce89fbe82b0c71.jpg"
    ],
    "description": "A compact hand air pump for bike and cycle tyres. Keep it with you for quick top-ups on the road.",
    "highlights": [
      "Compact and portable",
      "For bike and cycle tyres",
      "Easy to carry",
      "Colour sent at random"
    ],
    "tags": [
      "deal",
      "new"
    ]
  },
  {
    "slug": "digital-kitchen-scale-10kg",
    "name": "Digital Kitchen Weighing Scale (1g to 10kg)",
    "category": "home-kitchen",
    "supplier": "hhc",
    "supplierSku": "weight-scale-1-gram-to-10-kg-digital-mini-kitchen-weighing-scale-machine-cell-operated",
    "cost": 747,
    "price": 1299,
    "compareAt": 2399,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "utensils",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/10/WhatsApp-Image-2024-10-10-at-5.37.25-PM.jpeg"
    ],
    "description": "A digital kitchen scale that weighs from 1 gram up to 10 kg. Good for baking, cooking and small parcels.",
    "highlights": [
      "Weighs 1g to 10kg",
      "Digital display",
      "Runs on cells",
      "Compact size"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ]
  },
  {
    "slug": "digital-luggage-scale-50kg",
    "name": "Digital Luggage Scale 50kg",
    "category": "electronics",
    "supplier": "hhc",
    "supplierSku": "50kg-digital-led-screen-luggage-weight-scale-luggage-weighing-machine-digital-weighing-machine-for-luggage-scale-heavy-duty-portable-50kg110lb-black-2",
    "cost": 909,
    "price": 1499,
    "compareAt": 2699,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "smartphone",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/05/WhatsApp-Image-2024-05-20-at-5.52.24-PM.jpeg"
    ],
    "description": "Weigh your bags at home before you fly and avoid extra baggage charges. Hangs from the handle and shows the weight on a digital screen.",
    "highlights": [
      "Up to 50kg",
      "Digital screen",
      "Hook and strap for any bag",
      "Pocket size for travel"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ]
  },
  {
    "slug": "bathroom-corner-storage-rack",
    "name": "Wall-Mounted Bathroom Corner Rack",
    "category": "home-kitchen",
    "supplier": "hhc",
    "supplierSku": "wall-mounted-corner-storage-rack-multifunctional-bathroom-organizer-strong-carbon-steel-random-colour",
    "cost": 1341,
    "price": 1899,
    "compareAt": 3499,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "sparkles",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/05/06/ee4840f9eaf97ed2b428da0d239124bb.png"
    ],
    "description": "A strong carbon steel corner rack that keeps shampoo, soap and toiletries organised in the bathroom or kitchen.",
    "highlights": [
      "Carbon steel",
      "Fits in a corner",
      "Bathroom or kitchen",
      "Colour sent at random"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ]
  },
  {
    "slug": "crystal-aroma-gel-air-freshener",
    "name": "Crystal Aroma Gel Air Freshener 300g",
    "category": "home-kitchen",
    "supplier": "hhc",
    "supplierSku": "300g-crystal-aroma-gel-air-freshener-long-lasting-lavender-fragrance-beads-odor-eliminator-for-home-office-bathroom-car-premium-room-freshener",
    "cost": 531,
    "price": 1099,
    "compareAt": 1999,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "spray-can",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/11/401e72348d38eef031dc229dda9befe2.jpeg"
    ],
    "description": "Lavender fragrance gel beads that keep rooms, bathrooms, offices and cars smelling fresh.",
    "highlights": [
      "300g jar",
      "Lavender fragrance",
      "For home, office, bathroom or car",
      "No power or refills needed"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ]
  },
  {
    "slug": "a9-mini-wifi-camera",
    "name": "A9 Mini WiFi Camera 1080p",
    "category": "electronics",
    "supplier": "hhc",
    "supplierSku": "a9-mini-wifi-camera-full-hd-1080p-portable-security-camera",
    "cost": 1017,
    "price": 1599,
    "compareAt": 2899,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "smartphone",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2023/08/1-12.jpg"
    ],
    "description": "A tiny 1080p WiFi camera you can place anywhere and watch from your phone.",
    "highlights": [
      "Full HD 1080p",
      "Watch live on your phone over WiFi",
      "Very small and portable",
      "For home or shop"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ]
  },
  {
    "slug": "cockroach-killer-gel",
    "name": "SmartGel Cockroach Killer Gel 20g",
    "category": "home-kitchen",
    "supplier": "hhc",
    "supplierSku": "smartgel-cockroach-killer-gel-20g-professional-strength-odorless-mess-free-solution-kills-within-72-hours-for-home-kitchen-use",
    "cost": 466,
    "price": 999,
    "compareAt": 1799,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "spray-can",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/01/07/232cf5ff3b70d4c2effafda4fa01b864.jpeg"
    ],
    "description": "An odourless cockroach gel for kitchens and homes. Apply small dots in corners and cracks where cockroaches hide.",
    "highlights": [
      "20g syringe",
      "Odourless and mess-free",
      "For kitchen and home",
      "Keep away from children and pets"
    ],
    "tags": [
      "deal",
      "new"
    ]
  },
  {
    "slug": "reusable-mouse-trap",
    "name": "Reusable Plastic Mouse Trap",
    "category": "home-kitchen",
    "supplier": "hhc",
    "supplierSku": "heavy-duty-reusable-plastic-mouse-trap-durable-safe-mouse-catcher-for-effective-rodent-control",
    "cost": 196,
    "price": 699,
    "compareAt": 1299,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "sparkles",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/03/77267a5595f9c796d02235d53d404ddf.jpg"
    ],
    "description": "A heavy-duty plastic snap trap for mice that you can clean and use again.",
    "highlights": [
      "Reusable",
      "Heavy-duty plastic",
      "Easy to set",
      "For home, kitchen and shop"
    ],
    "tags": [
      "deal",
      "new"
    ]
  },
  {
    "slug": "knee-warmers-pair",
    "name": "Knee Warmers (1 Pair)",
    "category": "health-fitness",
    "supplier": "hhc",
    "supplierSku": "knee-warmers-for-comfort-protection-easy-wearing-and-daily-use-with-soft-material-and-reliable-design-1-pair",
    "cost": 299,
    "price": 799,
    "compareAt": 1499,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "sparkles",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2025/11/18/593c71928522c82675ed54866a4af173.png"
    ],
    "description": "Soft knee warmers that keep your knees warm in winter. Easy to wear under clothes every day.",
    "highlights": [
      "1 pair",
      "Soft material",
      "Wear under clothes",
      "For men and women"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ]
  },
  {
    "slug": "hair-colour-stick",
    "name": "Instant Hair Colour Stick 20g",
    "category": "beauty",
    "supplier": "hhc",
    "supplierSku": "hairdressing-wand-instant-root-touch-up-natural-hair-color-stick-for-hair-coverage-20g",
    "cost": 321,
    "price": 899,
    "compareAt": 1699,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "sparkles",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/05/10/b974a5b61c7b342da9186dc82117b012.jpg"
    ],
    "description": "A quick root touch-up stick that covers grey hair at the roots in seconds.",
    "highlights": [
      "20g stick",
      "Instant root touch-up",
      "Easy to carry",
      "Washes out with shampoo"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ]
  },
  {
    "slug": "t9-hair-trimmer",
    "name": "T9 Hair Trimmer (Gold)",
    "category": "beauty",
    "supplier": "hhc",
    "supplierSku": "t9-trimmer-vintage-t9-gold-hair-trimmer-premium-body-dragon-shape-t9-hair-trimmer-plastic-body",
    "cost": 715,
    "price": 1299,
    "compareAt": 2399,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "scissors",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/02/28/fa301b9e9b53bf7d40c6bc94a2e876bc.webp"
    ],
    "description": "The popular T9 trimmer with a gold dragon-design body, for beard lines, fades and detail work.",
    "highlights": [
      "T9 blade for fine lines",
      "Gold dragon design",
      "For beard and hair",
      "Plastic body"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ]
  },
  {
    "slug": "glass-salt-pepper-grinder",
    "name": "Manual Glass Salt and Pepper Grinder",
    "category": "home-kitchen",
    "supplier": "hhc",
    "supplierSku": "manual-glass-pepper-and-salt-grinder-random-color",
    "cost": 369,
    "price": 899,
    "compareAt": 1699,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "utensils",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/12/bac5163bd905bb4c5c411da80e337438.jpg"
    ],
    "description": "A glass grinder for fresh black pepper, salt and spices at the table.",
    "highlights": [
      "Glass body, see what's inside",
      "Grind fresh pepper and salt",
      "Refillable",
      "Colour sent at random"
    ],
    "tags": [
      "deal",
      "new"
    ]
  },
  {
    "slug": "c-shape-side-table",
    "name": "C-Shape Side Table (Laptop / Coffee)",
    "category": "home-kitchen",
    "supplier": "hhc",
    "supplierSku": "modern-c-shape-side-table-laptop-coffee-table",
    "cost": 1394,
    "price": 1899,
    "compareAt": 3499,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "lamp",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/03/f4d6d26ab96a0127d8891d888344d6f8.jpeg"
    ],
    "description": "A modern C-shaped side table that slides under your sofa or bed, so your laptop, tea or snacks are right in front of you.",
    "highlights": [
      "C-shape slides under sofa or bed",
      "For laptop, tea or books",
      "Modern look",
      "Easy to move"
    ],
    "tags": [
      "deal",
      "new"
    ]
  },
  {
    "slug": "half-face-bike-mask",
    "name": "Half Face Bike Mask (Windproof)",
    "category": "fashion",
    "supplier": "hhc",
    "supplierSku": "half-face-bike-mask-windproof-dustproof-cycling-face-shield",
    "cost": 315,
    "price": 899,
    "compareAt": 1699,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "glasses",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/20/ab9afaca8bdc5e71418c25d520f15faa.jpg"
    ],
    "description": "A windproof and dustproof half face mask for bike and cycle riders. Keeps cold air and dust off your face.",
    "highlights": [
      "Windproof",
      "Dustproof",
      "For bike and cycle riders",
      "Good for winter"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ]
  },
  {
    "slug": "folding-pedal-exerciser",
    "name": "Folding Pedal Exerciser (Arms and Legs)",
    "category": "health-fitness",
    "supplier": "hhc",
    "supplierSku": "folding-pedal-exerciser-mini-exercise-bike-under-desk-bike-foot-pedal-exerciser-foot-hand-cycle-portable-peddler-machine-bicycle-exerciser-arm-leg-exerciser-while-sitting",
    "cost": 2864,
    "price": 3399,
    "compareAt": 6199,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "dumbbell",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/04/27/937804a2fba1f0cea007cce20b159386.png"
    ],
    "description": "A folding mini exercise bike you use while sitting. Pedal with your feet, or put it on a table to work your arms.",
    "highlights": [
      "Use with feet or hands",
      "Exercise while sitting",
      "Folds for storage",
      "Good for elders"
    ],
    "tags": [
      "deal",
      "new"
    ]
  },
  {
    "slug": "ac-cover-1-5-ton",
    "name": "AC Cover 1.5 Ton (Waterproof, 2 pcs)",
    "category": "home-kitchen",
    "supplier": "hhc",
    "supplierSku": "ac-cover-15-ton-dust-proof-waterproof-parachute-material-2-pcs-set",
    "cost": 401,
    "price": 999,
    "compareAt": 1799,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "fan",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/16/51cfe600afdc210d798e08bb6424d361.jfif"
    ],
    "description": "A 2 piece set of waterproof parachute covers for split AC indoor and outdoor units, up to 1.5 ton. Keeps out dust and rain in winter.",
    "highlights": [
      "2 piece set",
      "Parachute material, waterproof",
      "Fits up to 1.5 ton",
      "Protects from dust in the off-season"
    ],
    "tags": [
      "deal",
      "new"
    ]
  },
  {
    "slug": "tulip-stainless-steel-bracelet",
    "name": "Tulip Stainless Steel Bracelet (Gold)",
    "category": "fashion",
    "supplier": "hhc",
    "supplierSku": "tulip-bracelet-premium-quality-stainless-steel-elegant-bracelet-for-women-without-box-golden-base",
    "cost": 531,
    "price": 1099,
    "compareAt": 1999,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "sparkles",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/06/13/2e9a23ce647a63259f44527bb9e7d21e.jpeg"
    ],
    "description": "An elegant tulip-design bracelet for women in gold-tone stainless steel. Comes without a box.",
    "highlights": [
      "Stainless steel",
      "Gold tone",
      "Tulip design",
      "Without box"
    ],
    "tags": [
      "deal",
      "new"
    ]
  },
  {
    "slug": "solar-panel-cleaning-brush-head",
    "name": "Solar Panel Cleaning Brush (Head Only)",
    "category": "home-kitchen",
    "supplier": "hhc",
    "supplierSku": "solar-panel-brush-head-only-best-quality-brush-for-cleaning-solar-panel-random-color",
    "cost": 1665,
    "price": 2199,
    "compareAt": 3999,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "sparkles",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/05/13/ed25ce1aebd9218b6c223048898cac1a.png"
    ],
    "description": "A soft brush head for cleaning dust off solar panels. Clean panels make more electricity. Fits on your own pole (pole not included).",
    "highlights": [
      "Brush head only, pole not included",
      "Soft bristles for panels",
      "Removes dust and dirt",
      "Colour sent at random"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ]
  },
  {
    "slug": "mystic-sage-perfume-tester",
    "name": "Mystic Sage Perfume Tester 5ml",
    "category": "beauty",
    "supplier": "hhc",
    "supplierSku": "mystic-sage-perfume-tester-glass-spray-vial-5ml",
    "cost": 369,
    "price": 899,
    "compareAt": 1699,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "spray-can",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/08/27/dc912514882881c4c7934b07825bca2f.webp"
    ],
    "description": "A 5ml glass spray vial of Mystic Sage perfume. Small enough to keep in your pocket or bag.",
    "highlights": [
      "5ml glass spray vial",
      "Pocket size",
      "Try a fragrance before a full bottle",
      "Good as a gift"
    ],
    "tags": [
      "deal",
      "new"
    ]
  },
  {
    "slug": "leaf-garland-fairy-lights",
    "name": "Leaf Garland with LED Fairy Lights (7 ft)",
    "category": "home-kitchen",
    "supplier": "hhc",
    "supplierSku": "artificial-plant-leaves-bail-with-7-ft-led-fairy-lights-battery-operated-and-7-ft-bail-leaf-lights-for-room-decoration-wall-hanging-flowers",
    "cost": 321,
    "price": 899,
    "compareAt": 1699,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "lamp",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/24/c72301e32f57722c5091d9a09a53ffa0.jpg"
    ],
    "description": "A 7 ft artificial leaf garland with battery-operated LED fairy lights for decorating rooms, walls and events.",
    "highlights": [
      "7 ft garland",
      "Battery-operated LED lights",
      "For rooms, walls and events",
      "No wiring needed"
    ],
    "tags": [
      "trending",
      "deal",
      "new"
    ]
  },
  {
    "slug": "compact-diy-tool-kit",
    "name": "Compact DIY Hand Tool Kit",
    "category": "electronics",
    "supplier": "hhc",
    "supplierSku": "tool-kit-2-disassemblers-5-allen-keys-compact-hand-toolkit-for-diy-repairs",
    "cost": 423,
    "price": 999,
    "compareAt": 1799,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "scissors",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2025/09/Copilot_20250904_010241.png"
    ],
    "description": "A compact hand tool kit with 2 opening tools and 5 Allen keys for small repairs at home.",
    "highlights": [
      "2 opening tools",
      "5 Allen keys",
      "Compact case",
      "For small DIY repairs"
    ],
    "tags": [
      "deal",
      "new"
    ]
  },
  {
    "slug": "24-cell-drawer-organizer",
    "name": "24-Cell Drawer Organizer",
    "category": "home-kitchen",
    "supplier": "hhc",
    "supplierSku": "socks-organizer-drawer-organizer-divider-underwear-organizer-24-cell-collapsible-closet-cabinet-organizer-underwear-storage-boxes",
    "cost": 304,
    "price": 899,
    "compareAt": 1699,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "shopping-bag",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/06/WhatsApp-Image-2024-05-31-at-5.53.41-PM.jpeg"
    ],
    "description": "A collapsible 24-cell organizer that keeps socks, underwear and small items neat in drawers and cupboards.",
    "highlights": [
      "24 cells",
      "Collapsible",
      "For socks, underwear and ties",
      "Fits in drawers and cupboards"
    ],
    "tags": [
      "deal",
      "new"
    ]
  }
];
