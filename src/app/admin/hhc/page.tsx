import { AdminNav } from "@/components/admin/admin-nav";
import { HhcImporter } from "@/components/admin/hhc-importer";
import { HhcActivate } from "@/components/admin/hhc-activate";
import { hhcConfigured } from "@/lib/hhc";

export const metadata = { title: "HHC Dropshipping (admin)", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminHhc() {
  const connected = await hhcConfigured();
  return (
    <div className="container-x pt-10">
      <AdminNav active="hhc" />
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight">HHC Dropshipping</h1>
      <p className="mt-1 text-sm text-stone-500">Search HHC&apos;s catalog and import products with their photos, cost and stock. Imported products are marked with HHC as the supplier, so orders show which HHC product to book.</p>
      {connected ? (
        <div className="mt-6 space-y-6">
          <HhcActivate />
          <HhcImporter />
        </div>
      ) : (
        <div className="mt-6 rounded-3xl bg-amber-50 p-6 text-sm text-amber-900">
          <p className="font-bold">HHC is not connected yet.</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>In HHC, open Tools → Integration &amp; Apps and press <b>Create App</b>. Copy the app key.</li>
            <li>In Cloudflare, open Workers &amp; Pages → cartwhim → Settings → Variables and Secrets, and add a secret named <code className="rounded bg-white px-1.5 py-0.5">HHC_APP_KEY</code> with that key.</li>
            <li>Reload this page.</li>
          </ol>
        </div>
      )}
    </div>
  );
}
