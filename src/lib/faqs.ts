import { formatPKR } from "./format";
import { store } from "./store-config";

export const storeFaqs = [
  { q: "Is Cash on Delivery available all over Pakistan?", a: `Yes. You can pay in cash when your parcel arrives in Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar and 50+ other cities.` },
  { q: "How long does delivery take?", a: `Orders are dispatched within 24 hours and usually arrive in ${store.shipping.deliveryDays}. Big cities are often faster.` },
  { q: "How much is the delivery charge?", a: `Delivery is free on orders over ${formatPKR(store.shipping.freeOver)}. Below that, a flat ${formatPKR(store.shipping.flatFee)} is charged anywhere in Pakistan.` },
  { q: "Can I return a product?", a: `Yes. If your item is damaged, faulty or not as described, tell us within ${store.returnDays} days of delivery and we will replace it or refund you.` },
  { q: "How do I track my order?", a: "Use the Track Order page with your order number and mobile number, or log in to your account to see all your orders." },
];
