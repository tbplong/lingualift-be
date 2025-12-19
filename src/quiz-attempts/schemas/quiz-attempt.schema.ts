import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuizAttemptDocument = QuizAttempt & Document;

@Schema({ timestamps: true })
export class QuizAttempt {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Quiz',
    required: true,
  })
  quizId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['in_progress', 'finished'],
    default: 'in_progress',
    index: true,
  })
  status: 'in_progress' | 'finished';

  @Prop({
    type: Number,
    default: 0,
  })
  durationSec: number;

  @Prop({
    type: Number,
    min: 0,
    max: 100,
  })
  scorePercent: number;

  @Prop({
    type: Date,
    default: Date.now,
    index: true,
  })
  startedAt: Date;

  @Prop({
    type: Date,
  })
  finishedAt?: Date;
}

export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttempt);
