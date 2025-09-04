'use strict';

function blobStore() {
  const { getStore } = require("@netlify/blobs");
  // Variant confirmed by your /api/probe: getStore({ name, siteID, token })
  return getStore({ name: "plannings", siteID: "cc36154d-c4e0-4ede-9976-d91a0bb9b9c8", token: "nfp_JgSejZWAKbsnsCCG72Xpr6vq5CFW6A5e22a4" });
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200 };
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Use POST" };
  try {
    const payload = JSON.parse(event.body || "{}");
    const key = payload && payload.key ? String(payload.key) : null;
    const data = payload && payload.data ? payload.data : null;
    const meta = (payload && payload.meta && typeof payload.meta === "object") ? payload.meta : {};
    if (!key || data === null || data === undefined) return { statusCode: 400, body: "Missing key or data" };
    const s = blobStore();
    const fileKey = key.endsWith(".json") ? key : (key + ".json");
    const jsonStr = typeof data === "string" ? data : JSON.stringify(data);
    meta.updatedAt = new Date().toISOString();
    await s.set(fileKey, jsonStr, { contentType: "application/json; charset=utf-8", metadata: meta, addRandomSuffix: false });
    return { statusCode: 200, body: JSON.stringify({ ok: true, key: fileKey }) };
  } catch(e) {
    return { statusCode: 500, body: "save error: " + String(e && e.message ? e.message : e) };
  }
};
