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