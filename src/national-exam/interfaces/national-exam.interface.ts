import { Types } from 'mongoose';
import { NationalExamLevel, NationalExamStatus } from '../schemas';

export interface CreateNationalExamRequestInterface {
  title: string;
  status: NationalExamStatus | null;
  level: NationalExamLevel;
  questions: number;
  examBucket: string;
  examKey: string;
  answerBucket?: string;
  answerKey?: string;
  videoLink: string;
}

export interface ExamsV2 {
  _id: Types.ObjectId;
  title: string;
  status: NationalExamStatus | null;
  level: NationalExamLevel;
  questions: number;
  isDeleted: boolean;
  examBucket: string;
  examKey: string;
  videoLink: string;
  createdAt: Date;
  createdBy: Types.ObjectId;
}

export interface NationalExamsResultV2 {
  page: number;
  pageSize: number;
  totalPage: number;
  pinnedExams: ExamsV2[];
  result: ExamsV2[];
}

export interface GetNationalExamsV2Interface {
  page: number;
  pageSize: number;
  search?: string;
  sort: string;
  level?: string;
}

export interface UpdateNationalExamRequestInterface {
  title?: string;
  status?: NationalExamStatus | null;
  level?: NationalExamLevel;
  questions?: number;
  videoLink?: string;
}
