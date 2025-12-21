import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AttemptCollectionName } from 'src/constants/schema';

export type AttemptDocument = HydratedDocument<Attempt>;

@Schema({ timestamps: true, collection: AttemptCollectionName })
export class Attempt {
  @Prop({ required: true, type: Types.ObjectId, ref: 'quizs' })
  public quizId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'users' })
  public userId: Types.ObjectId;

  @Prop({ required: true })
  public quizTitle: string;

  @Prop({ required: true })
  public startTime: Date;

  @Prop({ default: null })
  public endTime: Date;

  @Prop({ default: 0 })
  public timeTaken: number;

  @Prop({ default: null })
  public remainingTime: number;

  @Prop({ default: false })
  public isCompleted: boolean;

  @Prop({ default: 0 })
  public score: number;

  @Prop({ required: true })
  public totalQuestions: number;

  @Prop({ required: true })
  public answers: UserAnswer[];

  @Prop({ default: [] })
  public markedForReview: number[];

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

class UserAnswer {
  @Prop({ required: true })
  questionIndex: number;

  @Prop({ required: true })
  selectedAnswer: number;

  @Prop({ required: true })
  isCorrect: boolean;
}

export const AttemptSchema = SchemaFactory.createForClass(Attempt);
