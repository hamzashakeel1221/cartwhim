import type { Metadata } from "next";
import { formatPKR } from "@/lib/format";
import { store } from "@/lib/store-config";

export const metadata: Metadata = { title: "Shipping, returns & payment" };

export default function Policies() {
  return (
    <div className="container-x max-w-3xl pt-12">
      <h1 className="text-3xl font-extrabold tracking-tight">Shipping, returns & payment</h1>
      <div className="mt-8 space-y-10 leading-relaxed text-stone-700">
        <section id="shipping">
          <h2 className="text-xl font-bold text-ink">Shipping & delivery</h2>
          <p className="mt-2">We deliver all over Pakistan through trusted courier partners. Orders are dispatched within 24 to 48 hours and usually arrive in {store.shipping.deliveryDays}. Delivery is free on orders over {formatPKR(store.shipping.freeOver)}; otherwise a flat fee of {formatPKR(store.shipping.flatFee)} applies.</p>
        </section>
        <section id="cod">
          <h2 className="text-xl font-bold text-ink">Cash on Delivery</h2>
          <p className="mt-2">Pay in cash to the rider when your parcel arrives. We confirm every COD order by phone or WhatsApp before dispatch, so please keep your phone reachable.</p>
        </section>
        <section id="returns">
          <h2 className="text-xl font-bold text-ink">Returns & refunds</h2>
          <p className="mt-2">If your item arrives damaged, faulty or different from what you ordered, contact us within {store.returnDays} days of delivery with photos or a short video of the parcel. We will arrange a replacement or a refund. Items must be unused and in their original packaging.</p>
        </section>
      </div>
    </div>
  );
}
