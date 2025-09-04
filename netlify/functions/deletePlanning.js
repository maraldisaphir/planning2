import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200 };
  if (event.httpMethod !== "DELETE") return { statusCode: 405, body: "Use DELETE" };

  try {
    const { key } = JSON.parse(event.body || "{}");
    if (!key) return { statusCode: 400, body: "Missing key" };

    const store = getStore("plannings");
    await store.delete(key);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: `delete error: ${e.message}` };
  }
};