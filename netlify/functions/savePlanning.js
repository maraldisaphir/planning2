import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200 };
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Use POST" };

  try {
    const { key, data, meta } = JSON.parse(event.body || "{}");
    if (!key || !data) return { statusCode: 400, body: "Missing key or data" };

    const store = getStore("plannings");
    const jsonStr = typeof data === "string" ? data : JSON.stringify(data);

    await store.set(key.endsWith(".json") ? key : `${key}.json`, jsonStr, {
      contentType: "application/json; charset=utf-8",
      metadata: { ...(meta || {}), updatedAt: new Date().toISOString() },
      addRandomSuffix: false
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true, key }) };
  } catch (e) {
    return { statusCode: 500, body: `save error: ${e.message}` };
  }
};