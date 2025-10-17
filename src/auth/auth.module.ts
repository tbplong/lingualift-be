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
  ],
  providers: [AuthService, TokenService],
  controllers: [AuthController],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
