/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';

// Request DTO for creating/saving an attempt (supports both in-progress and completed)
export class CreateAttemptDto {
  @IsNotEmpty()
  @IsString()
  quizId: string;

  @IsNotEmpty()
  @IsString()
  quizTitle: string;

  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @IsOptional()
  @IsDateString()
  endTime?: Date; // Optional - null if in progress

  @IsOptional()
  @IsNumber()
  timeTaken?: number; // Time spent so far

  @IsOptional()
  @IsNumber()
  remainingTime?: number; // Time left on quiz (for resuming later)

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean; // true when quiz is submitted

  @IsOptional()
  @IsNumber()
  score?: number; // Only required when completed

  @IsNotEmpty()
  @IsNumber()
  totalQuestions: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserAnswerDto)
  answers: UserAnswerDto[];

  @IsOptional()
  @IsArray()
  markedForReview?: number[];
}

// DTO for updating an in-progress attempt
export class UpdateAttemptDto {
  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @IsOptional()
  @IsNumber()
  timeTaken?: number;

  @IsOptional()
  @IsNumber()
  remainingTime?: number;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserAnswerDto)
  answers?: UserAnswerDto[];

  @IsOptional()
  @IsArray()
  markedForReview?: number[];
}

export class UserAnswerDto {
  @IsNotEmpty()
  @IsNumber()
  questionIndex: number;

  @IsNotEmpty()
  @IsNumber()
  selectedAnswer: number;

  // @IsNotEmpty()
  // @IsBoolean()
  // isCorrect: boolean;
}

// Response DTO for attempt list (without questions)
export class AttemptListItemDto {
  @Expose()
  @Transform(({ obj }) => (<Types.ObjectId>obj._id).toString())
  _id: string;

  @Expose()
  quizId: Types.ObjectId;

  @Expose()
  quizTitle: string;

  @Expose()
  startTime: Date;

  @Expose()
  endTime: Date;

  @Expose()
  timeTaken: number;

  @Expose()
  remainingTime: number;

  @Expose()
  isCompleted: boolean;

  @Expose()
  score: number;

  @Expose()
  totalQuestions: number;

  @Expose()
  markedForReview: number[];

  @Expose()
  answers: UserAnswerDto[];

  @Expose()
  createdAt: Date;
}

export class AttemptsResponseDto {
  @Expose()
  @Type(() => AttemptListItemDto)
  attempts: AttemptListItemDto[];
}

export class AttemptDetailDto {
  @Expose()
  @Transform(({ obj }) => (<Types.ObjectId>obj._id).toString())
  _id: string;

  @Expose()
  quizId: Types.ObjectId;

  @Expose()
  quizTitle: string;

  @Expose()
  startTime: Date;

  @Expose()
  endTime: Date;

  @Expose()
  timeTaken: number;

  @Expose()
  remainingTime: number;

  @Expose()
  isCompleted: boolean;

  @Expose()
  score: number;

  @Expose()
  totalQuestions: number;

  @Expose()
  @Type(() => UserAnswerDto)
  answers: UserAnswerDto[];

  @Expose()
  markedForReview: number[];

  @Expose()
  createdAt: Date;
}

export class CreateAttemptResponseDto {
  @Expose()
  _id: Types.ObjectId;
}
