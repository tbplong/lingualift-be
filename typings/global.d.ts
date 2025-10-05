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
    }
  }

  namespace Express {
    interface Request {
      // customProps of pino-http
      customProps: object;
      user: User;
    }

    interface User {
      tokenId: Types.ObjectId;
      userId: Types.ObjectId;
      email: string;
    }
  }
}
