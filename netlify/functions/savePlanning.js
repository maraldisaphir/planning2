'use strict';
const { getStore } = require("@netlify/blobs");

function makeStore() {
  return getStore({ name: "plannings", siteID: "cc36154d-c4e0-4ede-9976-d91a0bb9b9c8", token: "nfp_JgSejZWAKbsnsCCG72Xpr6vq5CFW6A5e22a4" });
}

exports.handler = async function(event) {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200 };
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Use POST" };

  try {
    var body = event.body || "";
    var payload = {}, key = null, data = null, meta = {}, fileKey = null;
    try {
      payload = JSON.parse(body);
    } catch (e) {
      return { statusCode: 400, body: "Bad JSON body" };
    }
    key = payload && payload.key ? String(payload.key) : null;
    data = payload && payload.data ? payload.data : null;
    meta = payload && payload.meta ? payload.meta : {};
    if (!key || data === null || data === undefined) {
      return { statusCode: 400, body: "Missing key or data" };
    }
    var metadata = {}, k;
    if (meta && typeof meta === "object") {
      for (k in meta) { if (Object.prototype.hasOwnProperty.call(meta, k)) metadata[k] = meta[k]; }
    }
    metadata.updatedAt = new Date().toISOString();

    var s = makeStore();
    var jsonStr = (typeof data === "string") ? data : JSON.stringify(data);
    fileKey = key.slice(-5) === ".json" ? key : (key + ".json");

    await s.set(fileKey, jsonStr, {
      contentType: "application/json; charset=utf-8",
      metadata: metadata,
      addRandomSuffix: false
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true, key: fileKey }) };
  } catch (e) {
    return { statusCode: 500, body: "save error: " + String(e && e.message ? e.message : e) };
  }
};
