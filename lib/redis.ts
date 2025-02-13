import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

interface RedisCache {
  client: ReturnType<typeof createClient> | null;
  isConnected: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var redis: RedisCache | undefined;
}

const redisCache: RedisCache = global.redis || {
  client: null,
  isConnected: false,
};

if (!global.redis) {
  global.redis = redisCache;
}

export async function connectRedis() {
  if (redisCache.client && redisCache.isConnected) {
    return redisCache.client;
  }

  try {
    const client = createClient({
      url: redisUrl,
    });

    client.on('error', (err) => console.error('Redis Client Error', err));
    client.on('connect', () => {
      console.log('Redis connected');
      redisCache.isConnected = true;
    });
    client.on('disconnect', () => {
      console.log('Redis disconnected');
      redisCache.isConnected = false;
    });

    await client.connect();
    redisCache.client = client;
    return client;
  } catch (error) {
    console.error('Redis connection error:', error);
    throw error;
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const client = await connectRedis();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

export async function setCache(key: string, value: unknown, expireSeconds = 300) {
  try {
    const client = await connectRedis();
    await client.set(key, JSON.stringify(value), {
      EX: expireSeconds,
    });
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

export async function deleteCache(key: string) {
  try {
    const client = await connectRedis();
    await client.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
}

export async function clearCache() {
  try {
    const client = await connectRedis();
    await client.flushAll();
  } catch (error) {
    console.error('Redis clear error:', error);
  }
} 