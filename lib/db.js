const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { awsCredentialsProvider } = require("@vercel/functions/oidc");
const { env, AWS_REGION, AWS_ROLE_ARN } = require("./env-keys");

function getConfig() {
  const region = env(...AWS_REGION);
  const roleArn = env(...AWS_ROLE_ARN);
  const tableName = env(
    "DYNAMODB_TABLE_NAME",
    "SPACEKAYSONKELLY_DYNAMODB_TABLE_NAME"
  );
  const partitionKey = env(
    "DYNAMODB_TABLE_PARTITION_KEY",
    "SPACEKAYSONKELLY_DYNAMODB_TABLE_PARTITION_KEY"
  ) || "PK";
  const sortKey = env(
    "DYNAMODB_TABLE_SORT_KEY",
    "SPACEKAYSONKELLY_DYNAMODB_TABLE_SORT_KEY"
  ) || "SK";

  return { region, roleArn, tableName, partitionKey, sortKey };
}

let docClient;

function getDocClient() {
  if (docClient) return docClient;

  const { region, roleArn } = getConfig();
  if (!region || !roleArn) {
    throw new Error(
      "Missing AWS_REGION or AWS_ROLE_ARN (or beamxweb_* / integration-prefixed equivalents)"
    );
  }

  const client = new DynamoDBClient({
    region,
    credentials: awsCredentialsProvider({
      roleArn,
      clientConfig: { region },
    }),
  });

  docClient = DynamoDBDocumentClient.from(client);
  return docClient;
}

module.exports = { getConfig, getDocClient };
