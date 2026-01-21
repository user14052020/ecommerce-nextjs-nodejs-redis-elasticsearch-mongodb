import { getRedisClient } from "@app/core/redisClient";

const DEFAULT_TTL_SECONDS = Number(process.env.REDIS_TTL_SECONDS || 60);

const getCache = async <T>(key: string): Promise<T | null> => {
  const client = getRedisClient();
  if (!client) {
    return null;
  }
  const value = await client.get(key);
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const setCache = async <T>(
  key: string,
  value: T,
  ttlSeconds = DEFAULT_TTL_SECONDS
): Promise<void> => {
  const client = getRedisClient();
  if (!client) {
    return;
  }
  const payload = JSON.stringify(value);
  if (ttlSeconds && ttlSeconds > 0) {
    await client.set(key, payload, "EX", ttlSeconds);
  } else {
    await client.set(key, payload);
  }
};

const withCache = async <T>(
  key: string,
  ttlSeconds: number | undefined,
  resolver: () => Promise<T>
): Promise<T> => {
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }
  const fresh = await resolver();
  const resolvedTtl =
    typeof ttlSeconds === "number" ? ttlSeconds : DEFAULT_TTL_SECONDS;
  await setCache(key, fresh, resolvedTtl);
  return fresh;
};

const deleteCacheByPrefix = async (prefix: string): Promise<void> => {
  const client = getRedisClient();
  if (!client) {
    return;
  }
  let cursor = "0";
  do {
    const [nextCursor, keys] = await client.scan(
      cursor,
      "MATCH",
      `${prefix}*`,
      "COUNT",
      200
    );
    if (keys.length) {
      await client.del(keys);
    }
    cursor = nextCursor;
  } while (cursor !== "0");
};

export { getCache, setCache, withCache, deleteCacheByPrefix };
