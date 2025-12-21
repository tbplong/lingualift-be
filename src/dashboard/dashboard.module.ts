import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { QuizAttempt, QuizAttemptSchema } from '../quiz-attempts/schemas/quiz-attempt.schema';

import { Token, TokenSchema } from '../auth/schemas/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizAttempt.name, schema: QuizAttemptSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
