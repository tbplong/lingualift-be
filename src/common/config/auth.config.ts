import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const authConfig = registerAs('auth', () => {
  const values = {
    jwtSecret: process.env.JWT_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };

  const validationSchema = z.object({
    jwtSecret: z.string().min(1),
    googleClientId: z.string().min(1),
    googleClientSecret: z.string().min(1),
  });

  validationSchema.parse(values);

  return values;
});

export type AuthConfigType = typeof authConfig;
