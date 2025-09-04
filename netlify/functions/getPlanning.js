import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200 };
  if (event.httpMethod !== "GET") return { statusCode: 405, body: "Use GET" };

  try {
    const key = event.queryStringParameters?.key;
    if (!key) return { statusCode: 400, body: "Missing key" };

    const store = getStore("plannings");
    const json = await store.get(key, { type: "json" });
    if (!json) return { statusCode: 404, body: "Not found" };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(json)
    };
  } catch (e) {
    return { statusCode: 500, body: `get error: ${e.message}` };
  }
};