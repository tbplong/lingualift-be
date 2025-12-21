import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NationalExamController } from './controllers';
import { NationalExamSchema } from './schemas';
import { NationalExamService } from './services';
import { NationalExamCollectionName } from 'src/constants/schema';
import { UsersModule } from 'src/users/users.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NationalExamCollectionName, schema: NationalExamSchema }]),
    UsersModule,
    StorageModule,
  ],
  controllers: [NationalExamController],
  providers: [NationalExamService],
})
export class NationalExamModule {}
