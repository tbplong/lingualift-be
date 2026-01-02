import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { NationalExamCollectionName } from 'src/constants/schema';

export type NationalExamDocument = HydratedDocument<NationalExam>;

export enum NationalExamLevel {
  BEGINNER = 1,
  EASY = 2,
  MEDIUM = 3,
  HARD = 4,
  ADVANCED = 5,
}

export enum NationalExamStatus {
  NEW = 'NEW',
  HOT = 'HOT',
}

@Schema({ timestamps: true, collection: NationalExamCollectionName })
export class NationalExam {
  @Prop({ required: true })
  public title: string;

  @Prop({ default: null })
  public status: NationalExamStatus;

  @Prop({ required: true, default: NationalExamLevel.EASY })
  public level: NationalExamLevel;

  @Prop({ required: true })
  public questions: number;

  @Prop({ required: true, default: false })
  public isDeleted: boolean;

  @Prop({ required: true })
  public examBucket: string;

  @Prop({ required: true })
  public examKey: string;

  @Prop({ required: true })
  public videoLink: string;
}

export const NationalExamSchema = SchemaFactory.createForClass(NationalExam);
