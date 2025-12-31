import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenCollectionName } from 'src/constants/schema';
import { TokenSchema } from './schemas/token.schema';
import { forwardRef } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { authConfig, AuthConfigType } from 'src/common/config';
import { ConfigType } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { TokenService } from './services/token.service';
import { GoogleAuthController } from './controllers/google-auth.controller';
import { GoogleAuthService } from './services/google-auth.service';
import { OAuth2Client } from 'google-auth-library';
import { RedisModule } from 'src/redis/redis.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TokenCollectionName, schema: TokenSchema },
    ]),
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      useFactory: (appAuthConfig: ConfigType<AuthConfigType>) => ({
        secret: appAuthConfig.jwtSecret,
      }),
      inject: [authConfig.KEY],
    }),
    RedisModule,
  ],
  providers: [
    AuthService,
    TokenService,
    GoogleAuthService,
    {
      provide: OAuth2Client,
      inject: [authConfig.KEY],
      useFactory: (appAuthConfig: ConfigType<AuthConfigType>): OAuth2Client =>
        new OAuth2Client(
          appAuthConfig.googleClientId,
          appAuthConfig.googleClientSecret,
        ),
    },
  ],
  controllers: [AuthController, GoogleAuthController],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
