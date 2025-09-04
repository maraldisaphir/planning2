const { getStore } = require("@netlify/blobs");

function store(){
  const siteID = process.env.cc36154d-c4e0-4ede-9976-d91a0bb9b9c8;
  const token  = process.env.nfp_JgSejZWAKbsnsCCG72Xpr6vq5CFW6A5e22a4;
  if(!siteID || !token){
    throw new Error("Missing NETLIFY_SITE_ID or NETLIFY_API_TOKEN in environment variables.");
  }
  return getStore({ name: "plannings", siteID, token });
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200 };
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Use POST" };

  try {
    const payload = JSON.parse(event.body || "{}");
    const key  = payload && payload.key  ? payload.key  : null;
    const data = payload && payload.data ? payload.data : null;
    const meta = payload && payload.meta ? payload.meta : {};
    if (!key || !data) return { statusCode: 400, body: "Missing key or data" };

    const s = store();
    const jsonStr = typeof data === "string" ? data : JSON.stringify(data);
    const fileKey = key.endsWith(".json") ? key : (key + ".json");
    await s.set(fileKey, jsonStr, {
      contentType: "application/json; charset=utf-8",
      metadata: Object.assign({}, meta, { updatedAt: new Date().toISOString() }),
      addRandomSuffix: false
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true, key: fileKey }) };
  } catch (e) {
    return { statusCode: 500, body: "save error: " + String(e && e.message ? e.message : e) };
  }
};
