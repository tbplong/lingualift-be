import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { authConfig, AuthConfigType } from 'src/common/config';
import { ConfigType } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';

@Global()
@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (appAuthConfig: ConfigType<AuthConfigType>) => ({
        secret: appAuthConfig.jwtSecret,
      }),
      inject: [authConfig.KEY],
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
