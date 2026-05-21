const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { getConfig, getDocClient } = require("../lib/db");

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return json(res, 204, {});
  }

  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  try {
    const body = await readBody(req);

    if (body._gotcha) {
      return json(res, 400, { error: "Invalid submission" });
    }

    const firstName = (body.first_name || "").trim();
    const email = (body.email || "").trim();

    if (!firstName || !email) {
      return json(res, 400, { error: "First name and email are required" });
    }

    const { tableName, partitionKey, sortKey } = getConfig();
    if (!tableName) {
      return json(res, 500, { error: "DynamoDB table not configured" });
    }

    const createdAt = new Date().toISOString();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const item = {
      [partitionKey]: "CONTACT",
      [sortKey]: `${createdAt}#${id}`,
      id,
      createdAt,
      source: "webxbeam.com",
      first_name: firstName,
      last_name: (body.last_name || "").trim(),
      email,
      phone: (body.phone || "").trim(),
      business: (body.business || "").trim(),
      industry: body.industry || "",
      services: Array.isArray(body.services) ? body.services : [],
      budget: body.budget || "",
      message: (body.message || "").trim(),
    };

    await getDocClient().send(
      new PutCommand({
        TableName: tableName,
        Item: item,
      })
    );

    return json(res, 201, { ok: true, id });
  } catch (err) {
    console.error("Contact API error:", err);
    return json(res, 500, { error: "Failed to save message" });
  }
};
