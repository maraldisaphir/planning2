'use strict';

function blobStore() {
  const { getStore } = require("@netlify/blobs");
  return getStore("plannings", { siteID: "cc36154d-c4e0-4ede-9976-d91a0bb9b9c8", token: "nfp_JgSejZWAKbsnsCCG72Xpr6vq5CFW6A5e22a4" });
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200 };
  if (event.httpMethod !== "DELETE") return { statusCode: 405, body: "Use DELETE" };
  try {
    const payload = JSON.parse(event.body || "{}");
    const key = payload && payload.key ? payload.key : null;
    if (!key) return { statusCode: 400, body: "Missing key" };
    const s = blobStore();
    await s.delete(key);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch(e) {
    return { statusCode: 500, body: "delete error: " + String(e && e.message ? e.message : e) };
  }
};
