import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { QuizCollectionName } from 'src/constants/schema';
import { QuizType } from '../constants';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema({ timestamps: true, collection: QuizCollectionName })
export class Quiz {
  @Prop({ required: true })
  public title: string;

  @Prop({ required: true })
  public time: number; // 50 (seconds)

  @Prop({ default: null })
  public maxAttempt: number; // optional

  @Prop({ required: true })
  public questionsNo: number; // total number of questions

  @Prop({ default: null })
  public expiredAt: Date;

  @Prop({ default: false })
  public isShowAnswer: boolean;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;

  @Prop({ required: true })
  public questions: Question[];
}

class Question {
  @Prop({ default: null })
  groupId: string; // for questions sharing a reading passage

  @Prop({ default: false })
  isGroupQ: boolean; // true if part of a passage group

  @Prop({ required: true })
  content: string; // the actual question text

  @Prop({ default: null })
  passage: string; // optional reading passage text

  @Prop({ required: true })
  type: QuizType;

  @Prop({ required: true })
  answerList: AnswerOption[]; // the options (A, B, C, D)

  @Prop({ required: true })
  answerKey: number; // correct option index or indices

  @Prop({ default: null })
  explanation: string;
}

class AnswerOption {
  @Prop({ required: true })
  key: number; // 1, 2, 3, 4 — or match A,B,C,D

  @Prop({ required: true })
  option: string; // e.g. "A. whose"
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
