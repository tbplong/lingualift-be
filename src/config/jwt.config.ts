import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import appConfig from './app.config';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => ({
    secret: appConfig().jwtSecret,
    signOptions: { expiresIn: '60s' },
  }),
};
