import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200 };
  if (event.httpMethod !== "GET") return { statusCode: 405, body: "Use GET" };

  try {
    const store = getStore({
	  name: "plannings",
	  siteID: process.env.cc36154d-c4e0-4ede-9976-d91a0bb9b9c8,
	  token: process.env.nfp_JgSejZWAKbsnsCCG72Xpr6vq5CFW6A5e22a4,
	});
    const items = [];
    for await (const entry of store.list({ includeMetadata: true })) {
      items.push({
        key: entry.key,
        size: entry.size,
        updatedAt: entry?.metadata?.updatedAt || null,
        meta: entry?.metadata || {}
      });
    }
    items.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
    return { statusCode: 200, body: JSON.stringify(items) };
  } catch (e) {
    return { statusCode: 500, body: `list error: ${e.message}` };
  }
};