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
import { Expose, Type } from 'class-transformer';
import { Types } from 'mongoose';

// Request DTO for creating an attempt
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

  @IsNotEmpty()
  @IsDateString()
  endTime: Date;

  @IsNotEmpty()
  @IsNumber()
  timeTaken: number;

  @IsNotEmpty()
  @IsNumber()
  score: number;

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
  markedForReview: number[];
}

export class UserAnswerDto {
  @IsNotEmpty()
  @IsNumber()
  questionIndex: number;

  @IsNotEmpty()
  @IsNumber()
  selectedAnswer: number;

  @IsNotEmpty()
  @IsBoolean()
  isCorrect: boolean;
}

// Response DTO for attempt list (without questions)
export class AttemptListItemDto {
  @Expose()
  _id: Types.ObjectId;

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
  score: number;

  @Expose()
  totalQuestions: number;

  @Expose()
  markedForReview: number[];

  @Expose()
  createdAt: Date;
}

// Response DTO for attempts list
export class AttemptsResponseDto {
  @Expose()
  @Type(() => AttemptListItemDto)
  attempts: AttemptListItemDto[];
}

// Response DTO for single attempt with answers
export class AttemptDetailDto {
  @Expose()
  _id: Types.ObjectId;

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

// Response for create attempt
export class CreateAttemptResponseDto {
  @Expose()
  _id: Types.ObjectId;
}
