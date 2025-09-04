'use strict';
const { getStore } = require("@netlify/blobs");

function makeStore() {
  return getStore({ name: "plannings", siteID: "cc36154d-c4e0-4ede-9976-d91a0bb9b9c8", token: "nfp_JgSejZWAKbsnsCCG72Xpr6vq5CFW6A5e22a4" });
}

exports.handler = async function(event) {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200 };
  if (event.httpMethod !== "DELETE") return { statusCode: 405, body: "Use DELETE" };

  try {
    var body = event.body || "";
    var payload = {}, key = null;
    try { payload = JSON.parse(body); } catch (e) { return { statusCode: 400, body: "Bad JSON body" }; }
    key = payload && payload.key ? payload.key : null;
    if (!key) return { statusCode: 400, body: "Missing key" };
    var s = makeStore();
    await s.delete(key);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: "delete error: " + String(e && e.message ? e.message : e) };
  }
};
