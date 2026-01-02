import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { redisConfig, RedisConfigType } from 'src/common/config';

import { CacheService } from './services';

@Module({
  providers: [
    CacheService,
    {
      provide: Redis,
      useFactory: (rdConfig: RedisConfigType): Redis => {
        return new Redis({
          port: rdConfig.port,
          host: rdConfig.host,
        });
      },
      inject: [redisConfig.KEY],
    },
  ],
  exports: [CacheService],
})
export class RedisModule {}
