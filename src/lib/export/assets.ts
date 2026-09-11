import "server-only";

// PDF/PNG generation runs in the Workers runtime at request time -- no
// filesystem access, so logo/font bytes are fetched over HTTP from this
// same deployment's own public/ folder rather than read from disk.
export async function fetchAsset(origin: string, path: string): Promise<ArrayBuffer> {
  const res = await fetch(`${origin}${path}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch asset ${path}: ${res.status}`);
  }
  return res.arrayBuffer();
}
