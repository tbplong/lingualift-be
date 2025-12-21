import { ConfigType, registerAs } from '@nestjs/config';
import { z } from 'zod';

export const minioConfig = registerAs('minio', () => {
  const values = {
    minioEndPoint: process.env.MINIO_ENDPOINT,
    minioAccessKey: process.env.MINIO_ACCESS_KEY,
    minioSecretKey: process.env.MINIO_SECRET_KEY,
    minioPort: parseInt(process.env.MINIO_PORT, 10),
  };

  const validationSchema = z.object({
    minioEndPoint: z.string().min(1),
    minioAccessKey: z.string().min(1),
    minioSecretKey: z.string().min(1),
    minioPort: z.number().min(1),
  });

  validationSchema.parse(values);

  return values;
});

export type MinioConfigType = ConfigType<typeof minioConfig>;
