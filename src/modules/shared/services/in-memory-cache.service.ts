import { Injectable } from '@nestjs/common';

export type TCacheEntry<T> = {
  value: T;
  expiresAt: number;
  ttlMs: number;
};

@Injectable()
export class InMemoryCacheService<V = unknown> {
  private readonly cache = new Map<string, TCacheEntry<V>>();

  get(key: string): V | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    const now = Date.now();

    if (entry.expiresAt <= now) {
      this.cache.delete(key);
      return undefined;
    }

    // sliding TTL
    entry.expiresAt = now + entry.ttlMs;

    return entry.value;
  }

  set(key: string, value: V, ttlMs: number): void {
    this.cache.set(key, {
      value,
      ttlMs,
      expiresAt: Date.now() + ttlMs,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}