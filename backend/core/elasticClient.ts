import { Client } from "@elastic/elasticsearch";

const DEFAULT_ELASTICSEARCH_PREFIX = "nextjs";

let client: Client | null = null;

const getElasticClient = (): Client | null => {
  const node = process.env.ELASTICSEARCH_URL;
  if (!node) {
    return null;
  }
  if (!client) {
    client = new Client({ node });
  }
  return client;
};

const getElasticIndexPrefix = (): string => {
  return process.env.ELASTICSEARCH_PREFIX || DEFAULT_ELASTICSEARCH_PREFIX;
};

export { getElasticClient, getElasticIndexPrefix };
