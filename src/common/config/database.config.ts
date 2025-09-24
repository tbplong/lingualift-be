import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const databaseConfig = registerAs('database', () => {
  const values = {
    connectionString: process.env.DATABASE_HOST,
  };

  const validationSchema = z.object({
    connectionString: z.string().min(1),
  });

  validationSchema.parse(values);

  return values;
});
