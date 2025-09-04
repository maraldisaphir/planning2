import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200 };
  if (event.httpMethod !== "GET") return { statusCode: 405, body: "Use GET" };

  try {
    const store = getStore("plannings");
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