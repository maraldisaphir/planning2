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
  if (event.httpMethod !== "GET") return { statusCode: 405, body: "Use GET" };

  try {
    const s = store();
    const items = [];
    for await (const entry of s.list({ includeMetadata: true })) {
      items.push({
        key: entry.key,
        size: entry.size,
        updatedAt: (entry && entry.metadata && entry.metadata.updatedAt) ? entry.metadata.updatedAt : null,
        meta: entry && entry.metadata ? entry.metadata : {}
      });
    }
    items.sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
    return { statusCode: 200, body: JSON.stringify(items) };
  } catch (e) {
    return { statusCode: 500, body: String(e && e.message ? e.message : e) };
  }
};
