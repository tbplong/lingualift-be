/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private readonly logger: Logger = new Logger(CacheService.name);

  constructor(@Inject(Redis) private readonly client: Redis) {}

  public async set<T>(key: string, value: T, ttl: number): Promise<void> {
    const cacheValue = this.parseValue(value);
    if (!cacheValue) {
      this.logger.log(`Parse value fail`);
      return;
    }
    await this.client.set(key, cacheValue, 'EX', ttl);
  }

  public async get<T>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    if (raw === null) return null;

    try {
      const parsed = JSON.parse(raw);
      return <T>parsed.value;
    } catch {
      return <T>raw;
    }
  }

  public async revoke(key: string): Promise<void> {
    await this.client.del(key);
  }

  private parseValue<T>(value: T): string | undefined {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      typeof value === 'bigint'
    ) {
      return value.toString();
    }
    try {
      return JSON.stringify({ value });
    } catch (err) {
      this.logger.log(err.message);
      return undefined;
    }
  }
}
