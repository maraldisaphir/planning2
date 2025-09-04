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
    const key = (event.queryStringParameters && event.queryStringParameters.key) ? event.queryStringParameters.key : null;
    if (!key) return { statusCode: 400, body: "Missing key" };
    const s = blobStore();
    const json = await s.get(key, { type: "json" });
    if (!json) return { statusCode: 404, body: "Not found" };
    return { statusCode: 200, headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(json) };
  } catch(e) {
    return { statusCode: 500, body: "get error: " + String(e && e.message ? e.message : e) };
  }
};
