import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenCollectionName, UserCollectionName } from 'src/constants/schema';
import { UserSchema } from './schema/user.schema';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/user.controller';
import { TokenSchema } from 'src/auth/schemas';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserCollectionName, schema: UserSchema },
      { name: TokenCollectionName, schema: TokenSchema },
    ]),
    JwtModule.register({}),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
