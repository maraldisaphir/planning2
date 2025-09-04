'use strict';
exports.handler = async () => {
  const info = {
    usingSignature: "getStore(name, {siteID, token})",
    siteID: "cc36154d-c4e0-4ede-9976-d91a0bb9b9c8",
    tokenPreview: "nfp_Jg...22a4",
    steps: []
  };
  try {
    const pkg = require("@netlify/blobs/package.json");
    info.blobsVersion = pkg && pkg.version || "unknown";
  } catch(e) {
    info.blobsVersion = "unavailable";
  }
  try {
    const { getStore } = require("@netlify/blobs");
    info.steps.push("require_ok");
    const store = getStore("plannings", { siteID: "cc36154d-c4e0-4ede-9976-d91a0bb9b9c8", token: "nfp_JgSejZWAKbsnsCCG72Xpr6vq5CFW6A5e22a4" });
    info.steps.push("getStore_ok");
    try {
      await store.set("__diag__.txt", "ok", { contentType: "text/plain" });
      info.setDiag = "ok";
    } catch(e) {
      info.setDiag = "error: " + String(e && e.message ? e.message : e);
    }
    try {
      const v = await store.get("__diag__.txt", { type: "text" });
      info.getDiag = v || null;
    } catch(e) {
      info.getDiag = "error: " + String(e && e.message ? e.message : e);
    }
    try {
      const items = [];
      for await (const entry of store.list({ prefix: "", includeMetadata: false })) {
        items.push(entry.key);
        if (items.length >= 10) break;
      }
      info.sampleList = items;
    } catch(e) {
      info.sampleList = "error: " + String(e && e.message ? e.message : e);
    }
  } catch (e) {
    info.error = String(e && e.message ? e.message : e);
  }
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(info)
  };
};
