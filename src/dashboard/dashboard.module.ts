import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { QuizAttempt, QuizAttemptSchema } from 'src/quiz-attempts/schemas/quiz-attempt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuizAttempt.name,
        schema: QuizAttemptSchema,
      },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
