import Redis, { Redis as RedisClient } from "ioredis";

const DEFAULT_REDIS_URL = "redis://localhost:6379";

let client: RedisClient | null = null;

const getRedisClient = (): RedisClient | null => {
  const url = process.env.REDIS_URL || DEFAULT_REDIS_URL;
  if (!url) {
    return null;
  }
  if (!client) {
    client = new Redis(url, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
    });
  }
  return client;
};

export { getRedisClient };
