// Dropshipping suppliers. Add a new entry here when you start sourcing from another supplier,
// then set `supplier` on each product that comes from it.
export type Supplier = {
  id: string;
  name: string;
  website?: string;
  contact?: string; // WhatsApp / phone of your account manager
  notes?: string;
};

export const suppliers: Supplier[] = [
  { id: "hhc", name: "HHC Dropshipping" },
  { id: "oshi", name: "Oshi Dropshipping" },
];

export function getSupplier(id: string) {
  return suppliers.find((s) => s.id === id);
}
