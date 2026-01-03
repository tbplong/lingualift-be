import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { QuizAttempt, QuizAttemptSchema } from '../quiz-attempts/schemas/quiz-attempt.schema';
import { Token, TokenSchema } from '../auth/schemas/token.schema';

import { RedisModule } from 'src/redis/redis.module'; // ✅ import module

@Module({
  imports: [
    RedisModule, // ✅ thêm dòng này
    MongooseModule.forFeature([
      { name: QuizAttempt.name, schema: QuizAttemptSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService], // ✅ bỏ CacheService
})
export class DashboardModule {}
