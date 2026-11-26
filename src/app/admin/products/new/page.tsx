import Link from "next/link";
import { ProductEditor } from "@/components/admin/product-editor";

export const metadata = { title: "Add product (admin)", robots: { index: false } };

export default function NewProduct() {
  return (
    <div className="container-x max-w-3xl pt-10">
      <Link href="/admin/products" className="text-sm font-semibold text-stone-500 hover:text-ink">← Products</Link>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Add product</h1>
      <div className="mt-6"><ProductEditor /></div>
    </div>
  );
}
