import { Types } from 'mongoose';

export declare global {
  type AnyObject = Record<string, unknown>;

  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;

      NODE_ENV: string;

      DATABASE_HOST: string;

      JWT_SECRET: string;
      JWT_REFRESH_SECRET: string;

      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;

      MINIO_ENDPOINT: string;
      MINIO_PORT: string;
      MINIO_USE_SSL: string;
      MINIO_ACCESS_KEY: string;
      MINIO_SECRET_KEY: string;
      MINIO_BUCKET: string;

      REDIS_HOST: string;
      REDIS_PORT: string;
    }
  }

  namespace Express {
    interface Request {
      // customProps of pino-http
      customProps: object;
    }

    interface User {
      tokenId: Types.ObjectId;
      userId: Types.ObjectId;
      email: string;
    }
  }
}
