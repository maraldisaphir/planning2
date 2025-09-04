'use strict';
const { getStore } = require("@netlify/blobs");

function makeStore() {
  return getStore({ name: "plannings", siteID: "cc36154d-c4e0-4ede-9976-d91a0bb9b9c8", token: "nfp_JgSejZWAKbsnsCCG72Xpr6vq5CFW6A5e22a4" });
}

exports.handler = async function(event) {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200 };
  if (event.httpMethod !== "GET") return { statusCode: 405, body: "Use GET" };

  try {
    var s = makeStore();
    var out = [];
    for await (const entry of s.list({ includeMetadata: true })) {
      out.push({
        key: entry.key,
        size: entry.size,
        updatedAt: entry && entry.metadata && entry.metadata.updatedAt ? entry.metadata.updatedAt : null,
        meta: entry && entry.metadata ? entry.metadata : {}
      });
    }
    out.sort(function(a,b){ 
      var A = String(a.updatedAt || ""); 
      var B = String(b.updatedAt || ""); 
      return B.localeCompare(A); 
    });
    return { statusCode: 200, body: JSON.stringify(out) };
  } catch (e) {
    return { statusCode: 500, body: String(e && e.message ? e.message : e) };
  }
};
