import { Module } from '@nestjs/common';
import { AttemptController } from './controllers/attempt.controller';
import { AttemptService } from './services/attempt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AttemptCollectionName } from 'src/constants/schema';
import { AttemptSchema } from './schemas/attempt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AttemptCollectionName, schema: AttemptSchema },
    ]),
  ],
  controllers: [AttemptController],
  providers: [AttemptService],
  exports: [AttemptService],
})
export class AttemptModule {}
