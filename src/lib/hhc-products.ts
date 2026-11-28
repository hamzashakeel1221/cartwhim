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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/29/13fdcac0d37e57198be89fc0dab02d00.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/29/2b5b0ad1a49847eb76db419396e9023a.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/29/af839d5ac8d9597a9329cb01f6e4fe5b.jpg",
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/08/15/5fee686d2052676b9e76c5270dfa1737.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/08/15/aba14682878ad04daf2ff24c037eefe2.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/08/15/19763e7b01a70e10ecf8e6548a27ef2b.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/08/15/de461e53b24c8f1e45046f099a3d8337.jpeg"
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
    "shipsFrom": "Lahore",
    "video": "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/08/15/b7d3ebd8852c8806ea46876d522f3e6f.mp4"
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/10/WhatsApp-Image-2024-10-15-at-1.28.56-PM.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/09/WhatsApp-Image-2024-09-01-at-1.09.33-AM-1.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/01/WhatsApp-Image-2024-01-03-at-12.53.09-PM-1.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/01/WhatsApp-Image-2024-01-03-at-12.53.09-PM.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/01/WhatsApp-Image-2024-01-03-at-12.53.10-PM.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/09/5f00b8db-a6c9-49ec-bb3f-531b06c2313f-600x600-1.jpeg"
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2025/01/WhatsApp-Image-2025-01-13-at-11.56.30-AM.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/09/2c9e6036-05f1-4532-ad6f-36cee4b822a9.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/09/a473657c-8bcd-4a58-a06d-ef41803bc226.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2025/01/WhatsApp-Image-2025-01-13-at-11.56.32-AM.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2025/01/WhatsApp-Image-2025-01-13-at-11.56.31-AM.jpeg",
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/03/b2bf794ff94fcaf4355cd2273002beac.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/03/fdec33508f0079a28e598a836effc8f4.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/03/2c75db732eecab44edf12a42d23b31f0.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/03/7ee887db9fc15f34c6be1e4d7ccc49cb.jpeg"
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
    ],
    "video": "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/14/4007c6dab5006c7f6ed942a96c167cb3.mp4"
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/19/b484734884c8ce5eccdd62c918e2d74c.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/19/a4cb19d9d2e3edf33feff3ea0d082a07.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/20/55afacc19e0d5dacf95aa25a1207f562.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/19/6632c56d5450e09a9111d2931234188a.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/19/00cbc7314e9c87461ef9ac72899cc026.jpg"
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
    "slug": "waterproof-bike-cover",
    "name": "Waterproof Bike Cover (70cc and 125cc)",
    "category": "home-kitchen",
    "supplier": "hhc",
    "supplierSku": "bike-cover-dust-amp-water-proof-universal-70-and-125-scratch-amp-rust-proof-cover-random-color",
    "cost": 573,
    "price": 1099,
    "compareAt": 1999,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "car",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/09/Untitled-25-1.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2025/04/472dc51da1e0f1192f748541102e13c4.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2025/04/9ffcc39930a02f45bf4fa12dac31440a.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2025/04/7c53e3d13eea8677ea494cfec37da799.jpg"
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/07/22/b48a72f79a3b8340d2da07fa04216b6d.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/07/22/d5be612c8a9d5cf020ce89fbe82b0c71.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/07/22/1ad23787d6b93e8890251df22107dd2d.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/07/22/8440436de1e70dab5be6f6989db58734.jpg"
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/10/WhatsApp-Image-2024-10-10-at-5.37.25-PM.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/09/WhatsApp-Image-2024-09-20-at-1.09.41-PM-1.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/09/WhatsApp-Image-2024-09-20-at-1.09.40-PM.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/09/WhatsApp-Image-2024-09-20-at-1.09.39-PM-1.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/09/WhatsApp-Image-2024-09-20-at-1.09.38-PM.jpeg"
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/05/1-22.webp",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/05/2-21.webp",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/05/3-19.webp",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/05/4-11.webp",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/05/5-9.webp"
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/05/06/ee4840f9eaf97ed2b428da0d239124bb.png",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/05/06/bc3e2fc512149502e45fb1815792d9ef.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/05/06/9668078b8696d6d6da4b0617f9e0bf6c.png",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/05/06/c1f81792157630ca891c3969a88617ee.jpeg"
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/11/401e72348d38eef031dc229dda9befe2.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/11/18e77590019cd9e468cceb951bbcc271.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/11/40e32506d5938455267af35c151ade6f.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/11/5de6a3bb5474b22c9c2124c22c40d0a4.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/11/8ba57ef44cb75e923e4c82dceebb6570.jpeg"
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
    "slug": "knee-warmers-pair",
    "name": "Knee Warmers (1 Pair)",
    "category": "health-fitness",
    "supplier": "hhc",
    "supplierSku": "knee-warmers-for-comfort-protection-easy-wearing-and-daily-use-with-soft-material-and-reliable-design-1-pair",
    "cost": 369,
    "price": 899,
    "compareAt": 1699,
    "rating": 0,
    "reviews": 0,
    "stock": 20,
    "icon": "sparkles",
    "images": [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2025/11/18/593c71928522c82675ed54866a4af173.png",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2025/11/18/73d7aacc77d3196c3775c909943738b8.png",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2025/11/18/76e6a102747290a9f0f7edaff245f214.png"
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
    ],
    "video": "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2025/12/04/52962faae82bb587efbebb7216f60b02.mp4"
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/05/10/b974a5b61c7b342da9186dc82117b012.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/05/10/7d5e5710609b47cc5bdced413d679179.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/05/10/6e9504e3e6ebf8a82b28f42ef148d94d.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/05/10/f33da49f31cbdf62ea35dea17d6511dd.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/12/a104c4eab1f2017f853ad84ebe868205.jpeg"
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
    ],
    "video": "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/05/10/c3298769c7e813577545f8217bd5155d.mp4"
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/02/28/fa301b9e9b53bf7d40c6bc94a2e876bc.webp",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/02/28/ab7a2b94efd60c7ad78cd8c894f46177.webp",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/02/28/87cfeb775e6f293c0c975a4d958f3805.webp",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/03/02/57e2d310ef8a8b387d385e3371fdf234.jpg"
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
    ],
    "video": "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/03/02/5a3848f15074670a2b812504f53999e2.mp4"
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/12/bac5163bd905bb4c5c411da80e337438.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/14/78e44d2a3826f9378f373e90ad1e4ca4.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/14/25825f113e25009937359a25dfa84547.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/14/69ad8e71a63394c3858ee4709484607e.jpeg"
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/03/f4d6d26ab96a0127d8891d888344d6f8.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/03/74eac05b5e5959b8f0149ef4ed4b63a2.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/03/f1b02e46fc206b5f76f58c90ced3cd1c.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/03/b67260b342c396ddcd07fafffbb33e29.png"
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/20/ab9afaca8bdc5e71418c25d520f15faa.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/20/988b3f091495b63b7eaaa7a004e96a17.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/20/9b10c6c248873c10f860bbe6247e7747.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/20/175fde2d2e842c51b61b0401173f23c7.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/20/1855c367d587d926436224f7307f2e5f.jpg"
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/04/27/937804a2fba1f0cea007cce20b159386.png",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/04/27/1d40037af0c0434922550ee0290b32aa.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/04/27/3a8a6e2ae3982e679313588085d588cc.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/04/27/0061cca1388c58c70a2898d2a737d94c.png"
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
    ],
    "video": "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/04/27/b46a433fa3ce547a681eb423b498d29b.mp4"
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/16/51cfe600afdc210d798e08bb6424d361.jfif",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/16/b760d333c87499fbca67c9df40228129.jfif",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/16/c98f9bfc01d5c8d7d77a3f1107aa4594.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/16/150d2ef964f45ac833ed780aea20a109.jpg"
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/06/13/2e9a23ce647a63259f44527bb9e7d21e.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/06/13/f45e69b9b8b489f2c228770052f5e403.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/06/13/b0abd18d85c4902b9035f47bf62b5b75.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/06/13/5593e0bfc853c028f048f6aa1320b9d6.jpeg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/11/23/e2af7509c0cc56ce544508c9f4bbe5b1.webp"
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
    ],
    "video": "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/06/15/ce2262a615b7946033ff9ec714edd804.mp4"
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
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2024/06/41a5c1c438b36acac4eb40b84dc7026f.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2022/11/1.png",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2022/11/2.png",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2022/11/3.png",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2022/11/6.png"
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
    ],
    "video": "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/08/18/f8a654411ad48041db2b82d2a14ae53c.mp4"
  }
];
