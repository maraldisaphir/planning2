'use strict';
exports.handler = async () => {
  const out = { siteID: "cc36154d-c4e0-4ede-9976-d91a0bb9b9c8", tokenPreview: "nfp_Jg...22a4" };
  try { out.pkg = require("@netlify/blobs/package.json").version; } catch { out.pkg = "unknown"; }
  const mod = require("@netlify/blobs");
  out.exports = Object.keys(mod);

  async function tryVariant(label, maker) {
    const r = { label };
    try {
      const store = maker();
      r.made = !!store;
      try {
        await store.set("__probe__.txt", "ok", { contentType: "text/plain" });
        r.set = "ok";
      } catch(e) { r.set = "err: " + String(e && e.message ? e.message : e); }
      try {
        const v = await store.get("__probe__.txt", { type: "text" });
        r.get = v || null;
      } catch(e) { r.get = "err: " + String(e && e.message ? e.message : e); }
      try {
        const it = store.list({ prefix: "__", includeMetadata: false });
        const keys = [];
        for await (const e of it) { keys.push(e.key); if (keys.length>5) break; }
        r.list = keys;
      } catch(e) { r.list = "err: " + String(e && e.message ? e.message : e); }
    } catch(e) {
      r.error = String(e && e.message ? e.message : e);
    }
    return r;
  }

  const { getStore } = mod;
  out.variants = [];
  out.variants.push(await tryVariant("getStore(name, {siteID, token})", () => getStore("plannings", { siteID: "cc36154d-c4e0-4ede-9976-d91a0bb9b9c8", token: "nfp_JgSejZWAKbsnsCCG72Xpr6vq5CFW6A5e22a4" })));
  out.variants.push(await tryVariant("getStore({name, siteID, token})", () => getStore({ name: "plannings", siteID: "cc36154d-c4e0-4ede-9976-d91a0bb9b9c8", token: "nfp_JgSejZWAKbsnsCCG72Xpr6vq5CFW6A5e22a4" })));
  out.variants.push(await tryVariant("getStore(name, {siteId, token})", () => getStore("plannings", { siteId: "cc36154d-c4e0-4ede-9976-d91a0bb9b9c8", token: "nfp_JgSejZWAKbsnsCCG72Xpr6vq5CFW6A5e22a4" })));
  out.variants.push(await tryVariant("getStore({name, siteId, token})", () => getStore({ name: "plannings", siteId: "cc36154d-c4e0-4ede-9976-d91a0bb9b9c8", token: "nfp_JgSejZWAKbsnsCCG72Xpr6vq5CFW6A5e22a4" })));

  if (typeof mod.createClient === "function") {
    out.variants.push(await tryVariant("createClient(...).getStore(name)", () => mod.createClient({ siteID: "cc36154d-c4e0-4ede-9976-d91a0bb9b9c8", token: "nfp_JgSejZWAKbsnsCCG72Xpr6vq5CFW6A5e22a4" }).getStore("plannings")));
  }
  if (typeof mod.Blobs === "function") {
    out.variants.push(await tryVariant("new Blobs(...).getStore(name)", () => new mod.Blobs({ siteID: "cc36154d-c4e0-4ede-9976-d91a0bb9b9c8", token: "nfp_JgSejZWAKbsnsCCG72Xpr6vq5CFW6A5e22a4" }).getStore("plannings")));
  }

  return { statusCode: 200, headers: {"Content-Type":"application/json; charset=utf-8"}, body: JSON.stringify(out, null, 2) };
};
