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
    const key = event.queryStringParameters && event.queryStringParameters.key ? event.queryStringParameters.key : null;
    if (!key) return { statusCode: 400, body: "Missing key" };

    const s = store();
    const json = await s.get(key, { type: "json" });
    if (!json) return { statusCode: 404, body: "Not found" };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(json)
    };
  } catch (e) {
    return { statusCode: 500, body: "get error: " + String(e && e.message ? e.message : e) };
  }
};
