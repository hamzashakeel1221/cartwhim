import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { formatPKR } from "@/lib/format";
import { store } from "@/lib/store-config";

export const metadata = { title: "Order placed" };

export default async function OrderSuccess({ searchParams }: { searchParams: Promise<{ id?: string; total?: string }> }) {
  const { id, total } = await searchParams;
  return (
    <div className="container-x flex flex-col items-center py-20 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-mint/10"><CheckCircle2 className="h-11 w-11 text-mint" /></span>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Shukriya! Your order is placed.</h1>
      {id && (
        <p className="mt-3 text-stone-600">
          Order number <b className="text-ink">{id}</b>{total && <> · Pay <b className="text-ink">{formatPKR(Number(total))}</b> in cash on delivery</>}
        </p>
      )}
      <p className="mt-2 max-w-md text-sm text-stone-500">
        Our team will call or WhatsApp you shortly to confirm. Delivery usually takes {store.shipping.deliveryDays}.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/products" className="btn btn-primary">Continue shopping</Link>
        <Link href="/track-order" className="btn btn-ghost">Track order</Link>
        {id && (
          <a href={`https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(`Hi CartWhim, I just placed order ${id}.`)}`} className="btn btn-ghost">
            <MessageCircle className="h-4 w-4" /> WhatsApp us
          </a>
        )}
      </div>
    </div>
  );
}
