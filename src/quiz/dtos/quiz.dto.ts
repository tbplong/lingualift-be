import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { QuizType } from '../constants';
import { Exclude, Expose, Type } from 'class-transformer';
import { Types } from 'mongoose';

export class QuizDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  time: number; // 50 (seconds)

  @IsOptional()
  @IsNumber()
  maxAttempt: number; // optional

  @IsNotEmpty()
  @IsNumber()
  questionsNo: number; // total number of questions

  @IsOptional()
  @IsDateString()
  expiredAt: Date;

  @IsOptional()
  @IsBoolean()
  isShowAnswer: boolean;

  @IsNotEmpty()
  questions: QuestionDto[];
}

class QuestionDto {
  @IsOptional()
  @IsString()
  groupId: string; // for questions sharing a reading passage

  @IsOptional()
  @IsBoolean()
  isGroupQ: boolean; // true if part of a passage group

  @IsNotEmpty()
  @IsString()
  content: string; // the actual question text

  @IsOptional()
  @IsString()
  passage: string; // optional reading passage text

  @IsNotEmpty()
  type: QuizType;

  @IsNotEmpty()
  answerList: AnswerOptionDto[]; // the options (A, B, C, D)

  @IsNotEmpty()
  @IsNumber()
  answerKey: number; // correct option index or indices

  @IsOptional()
  @IsString()
  explanation: string;
}

class AnswerOptionDto {
  @IsNotEmpty()
  @IsNumber()
  key: number; // 1, 2, 3, 4 — or match A,B,C,D

  @IsNotEmpty()
  @IsString()
  option: string; // e.g. "A. whose"
}

export class CreateQuizResponseDto {
  @Expose()
  _id: Types.ObjectId;
}

export class QuizsResponseDto {
  @Expose()
  @Type(() => QuizDto)
  quizs: QuizDto[];
}

export class QuizResponseDto {
  @Expose()
  @Type(() => QuizDto)
  quiz: QuizDto;
}

export class UpdateQuizDto extends QuizDto {
  @Exclude()
  _id?: never;
}
