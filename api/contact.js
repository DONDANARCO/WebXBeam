const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { getConfig, getDocClient } = require("../lib/db");
const { isPgConfigured, getPool } = require("../lib/pg");

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

    const createdAt = new Date().toISOString();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const lastName = (body.last_name || "").trim();
    const phone = (body.phone || "").trim();
    const business = (body.business || "").trim();
    const industry = body.industry || "";
    const services = Array.isArray(body.services) ? body.services : [];
    const budget = body.budget || "";
    const message = (body.message || "").trim();

    if (isPgConfigured()) {
      await getPool().query(
        `INSERT INTO contact_submissions (
          id, created_at, source, first_name, last_name, email,
          phone, business, industry, services, budget, message
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11, $12)`,
        [
          id,
          createdAt,
          "webxbeam.com",
          firstName,
          lastName,
          email,
          phone,
          business,
          industry,
          JSON.stringify(services),
          budget,
          message,
        ]
      );
    } else {
      const { tableName, partitionKey, sortKey } = getConfig();
      if (!tableName) {
        return json(res, 500, {
          error: "Database not configured (Postgres or DynamoDB)",
        });
      }

      const item = {
        [partitionKey]: "CONTACT",
        [sortKey]: `${createdAt}#${id}`,
        id,
        createdAt,
        source: "webxbeam.com",
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        business,
        industry,
        services,
        budget,
        message,
      };

      await getDocClient().send(
        new PutCommand({
          TableName: tableName,
          Item: item,
        })
      );
    }

    return json(res, 201, { ok: true, id });
  } catch (err) {
    console.error("Contact API error:", err);
    return json(res, 500, { error: "Failed to save message" });
  }
};
