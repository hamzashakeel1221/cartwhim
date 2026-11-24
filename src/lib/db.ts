import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function db(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}

export const last10 = (phone: string) => phone.replace(/\D/g, "").slice(-10);
