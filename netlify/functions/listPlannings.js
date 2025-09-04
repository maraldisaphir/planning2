'use strict';

function blobStore() {
  const { getStore } = require("@netlify/blobs");
  // Variant confirmed by your /api/probe: getStore({ name, siteID, token })
  return getStore({ name: "plannings", siteID: "cc36154d-c4e0-4ede-9976-d91a0bb9b9c8", token: "nfp_JgSejZWAKbsnsCCG72Xpr6vq5CFW6A5e22a4" });
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200 };
  if (event.httpMethod !== "GET") return { statusCode: 405, body: "Use GET" };
  try {
    const s = blobStore();
    const items = [];
    let result;
    try {
      result = s.list({ includeMetadata: true });
    } catch (e) {
      return { statusCode: 500, body: "list error: " + String(e && e.message ? e.message : e) };
    }

    const isAsyncIterable = result && typeof result[Symbol.asyncIterator] === "function";

    if (isAsyncIterable) {
      for await (const entry of result) {
        items.push({
          key: entry.key,
          size: entry.size,
          updatedAt: entry && entry.metadata && entry.metadata.updatedAt ? entry.metadata.updatedAt : null,
          meta: entry && entry.metadata ? entry.metadata : {}
        });
      }
    } else {
      // Some runtimes return an array or an object instead of an async iterator.
      const awaited = await result;
      const listArr = Array.isArray(awaited) ? awaited : (awaited && awaited.blobs ? awaited.blobs : []);
      for (const entry of listArr) {
        items.push({
          key: entry.key || entry.name || String(entry),
          size: entry.size || 0,
          updatedAt: entry && entry.metadata && entry.metadata.updatedAt ? entry.metadata.updatedAt : null,
          meta: entry && entry.metadata ? entry.metadata : {}
        });
      }
    }

    items.sort((a,b) => String(b.updatedAt||"").localeCompare(String(a.updatedAt||"")));
    return { statusCode: 200, headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(items) };
  } catch(e) {
    return { statusCode: 500, body: "list error: " + String(e && e.message ? e.message : e) };
  }
};
