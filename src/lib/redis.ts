import Redis from "ioredis";

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    if (!process.env.REDIS_URL) {
      throw new Error("REDIS_URL is not configured");
    }

    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    redis.on("error", (err) => {
      console.error("Redis connection error:", err);
    });
  }

  return redis;
}

export async function getFromCache<T>(key: string): Promise<T | null> {
  const client = getRedis();

  try {
    const data = await client.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    console.error("Redis get error:", error);
    return null;
  }
}

export async function setCache(
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<void> {
  const client = getRedis();

  try {
    await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (error) {
    console.error("Redis set error:", error);
  }
}
