// Simple in-memory cache with TTL and size limit
export class SimpleCache<K, V> {
  private cache = new Map<K, { value: V; timeout: NodeJS.Timeout }>();
  private maxSize: number;
  private ttl: number;

  constructor(maxSize: number, ttl: number) {
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    return entry ? entry.value : undefined;
  }

  set(key: K, value: V) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.delete(firstKey);
      }
    }
    if (this.cache.has(key)) {
      clearTimeout(this.cache.get(key)!.timeout);
    }
    const timeout = setTimeout(() => this.delete(key), this.ttl);
    this.cache.set(key, { value, timeout });
  }

  delete(key: K) {
    const entry = this.cache.get(key);
    if (entry) clearTimeout(entry.timeout);
    this.cache.delete(key);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear() {
    for (const key of this.cache.keys()) {
      this.delete(key);
    }
  }
}
