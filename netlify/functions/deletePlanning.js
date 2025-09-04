const { getStore } = require("@netlify/blobs");

function store(){
  const siteID = process.env.NETLIFY_SITE_ID;
  const token  = process.env.NETLIFY_API_TOKEN;
  if(!siteID || !token){
    throw new Error("Missing NETLIFY_SITE_ID or NETLIFY_API_TOKEN in environment variables.");
  }
  return getStore({ name: "plannings", siteID, token });
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200 };
  if (event.httpMethod !== "DELETE") return { statusCode: 405, body: "Use DELETE" };

  try {
    const payload = JSON.parse(event.body || "{}");
    const key = payload && payload.key ? payload.key : null;
    if (!key) return { statusCode: 400, body: "Missing key" };

    const s = store();
    await s.delete(key);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: "delete error: " + String(e && e.message ? e.message : e) };
  }
};
