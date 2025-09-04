'use strict';

function blobStore() {
  const { getStore } = require("@netlify/blobs");
  return getStore("plannings", { siteID: "cc36154d-c4e0-4ede-9976-d91a0bb9b9c8", token: "nfp_JgSejZWAKbsnsCCG72Xpr6vq5CFW6A5e22a4" });
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200 };
  if (event.httpMethod !== "GET") return { statusCode: 405, body: "Use GET" };
  try {
    const s = blobStore();
    const items = [];
    for await (const entry of s.list({ includeMetadata: true })) {
      items.push({
        key: entry.key,
        size: entry.size,
        updatedAt: entry && entry.metadata && entry.metadata.updatedAt ? entry.metadata.updatedAt : null,
        meta: entry && entry.metadata ? entry.metadata : {}
      });
    }
    items.sort((a,b) => String(b.updatedAt||"").localeCompare(String(a.updatedAt||"")));
    return { statusCode: 200, body: JSON.stringify(items) };
  } catch(e) {
    return { statusCode: 500, body: "list error: " + String(e && e.message ? e.message : e) };
  }
};
