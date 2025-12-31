import { ConfigType, registerAs } from '@nestjs/config';
import { z } from 'zod';

export const redisConfig = registerAs('redis', () => {
  const values = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
  };

  const validationSchema = z.object({
    host: z.string().min(1),
    port: z.number().min(1),
  });

  validationSchema.parse(values);

  return values;
});

export type RedisConfigType = ConfigType<typeof redisConfig>;
