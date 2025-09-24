import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCollectionName } from 'src/constants/schema';
import { UserSchema } from './schema/user.schema';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserCollectionName, schema: UserSchema },
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
