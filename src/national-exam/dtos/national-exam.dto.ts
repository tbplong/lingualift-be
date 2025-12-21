import { Expose, Transform, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { NationalExamLevel, NationalExamStatus } from '../schemas';

export enum ResourceType {
  VIDEO = 'VIDEO',
  FILE = 'FILE',
}

export class CreateNationalExamRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  status: NationalExamStatus | null;

  @IsEnum(NationalExamLevel)
  @IsNotEmpty()
  level: NationalExamLevel;

  @IsNotEmpty()
  @IsNumber()
  questions: number;

  @IsNotEmpty()
  examBucket: string;

  @IsNotEmpty()
  examKey: string;

  @IsOptional()
  videoLink: string;
}

export class CreateNationalExamResponseDto {
  @Expose()
  @Transform(({ obj }) => (<Types.ObjectId>obj._id).toString())
  _id: string;
}

export class GetNationalExamResponseV2Dto {
  @Expose()
  @Transform(({ obj }) => (<Types.ObjectId>obj._id).toString())
  _id: string;

  @Expose()
  title: string;

  @Expose()
  status: string | null;

  @Expose()
  level: number;

  @Expose()
  questions: number;

  @Expose()
  isDeleted: boolean;

  @Expose()
  examBucket: string;

  @Expose()
  examKey: string;

  @Expose()
  answerBucket: string;

  @Expose()
  answerKey: string;

  @Expose()
  videoLink: string;

  @Expose()
  video: string;

  @Expose()
  createdBy: Date;

  @Expose()
  createdAt: Date;
}

export class GetNationalExamsResponseV2Dto {
  @Expose()
  page: number;

  @Expose()
  pageSize: number;

  @Expose()
  totalPage: number;

  @Expose()
  @Type(() => GetNationalExamResponseV2Dto)
  pinnedExams: GetNationalExamResponseV2Dto[];

  @Expose()
  @Type(() => GetNationalExamResponseV2Dto)
  result: GetNationalExamResponseV2Dto[];
}

export class GetNationalExamsQueryV2Dto {
  @IsOptional()
  @Transform(({ value }) => Number(<string>value))
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(<string>value))
  pageSize: number = 10;

  @IsOptional()
  search: string;

  @IsOptional()
  sort: string = 'desc';

  @IsOptional()
  level: string;
}

export class UpdateNationalExamRequestDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  status: NationalExamStatus | null;

  @IsOptional()
  @IsEnum(NationalExamLevel)
  level: NationalExamLevel;

  @IsOptional()
  @IsNumber()
  questions: number;

  @IsOptional()
  videoLink: string;
}
