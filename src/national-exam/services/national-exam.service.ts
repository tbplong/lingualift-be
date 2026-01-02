import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import {
  CreateNationalExamRequestInterface,
  ExamsV2,
  GetNationalExamsV2Interface,
  NationalExamsResultV2,
  UpdateNationalExamRequestInterface,
} from '../interfaces';
import {
  NationalExam,
  NationalExamDocument,
  NationalExamStatus,
} from '../schemas';
import { NationalExamCollectionName } from 'src/constants/schema';

@Injectable()
export class NationalExamService {
  private readonly logger: Logger = new Logger(NationalExamService.name);

  constructor(
    @InjectModel(NationalExamCollectionName)
    private readonly nationalExamModel: Model<NationalExam>,
  ) {}

  public async createNationalExam(
    userId: Types.ObjectId,
    createNationalExamRequestInterface: CreateNationalExamRequestInterface,
  ): Promise<NationalExamDocument> {
    const newExam = await this.nationalExamModel.create({
      ...createNationalExamRequestInterface,
      isDelete: false,
      createdBy: userId,
    });
    return newExam;
  }

  /*
  Version 2 of Get National Exam by Id API
  */
  public async getNationalExamByIdV2(examId: Types.ObjectId): Promise<ExamsV2> {
    const exam = await this.nationalExamModel.aggregate<ExamsV2>([
      {
        $match: {
          $and: [{ _id: examId }, { isDeleted: false }],
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          status: 1,
          level: 1,
          questions: 1,
          isDeleted: 1,
          examBucket: 1,
          examKey: 1,
          answerBucket: 1,
          answerKey: 1,
          videoLink: 1,
          createdAt: 1,
          createdBy: 1,
        },
      },
    ]);
    if (exam.length === 0) {
      throw new NotFoundException('Exam not found');
    }
    return exam[0];
  }

  /*
  Version 2 of Get National Exams API
  */
  public async getNationalExamsV2(
    getNationalExamsV2Interface: GetNationalExamsV2Interface,
  ): Promise<NationalExamsResultV2> {
    const { page, pageSize, search, level, sort } = getNationalExamsV2Interface;
    const dateSort = sort === 'desc' ? -1 : 1;
    const levelRange = level?.split('-').map((e) => Number(e));
    const firstFilter: FilterQuery<NationalExam> = {
      $or: [
        {
          $and: [
            search
              ? {
                  title: { $regex: `${search}`, $options: 'i' },
                }
              : {},
            { isDeleted: false },
            levelRange
              ? { level: { $gte: levelRange[0], $lte: levelRange[1] } }
              : {},
          ],
        },
        { status: NationalExamStatus.HOT },
      ],
    };

    const examFiles = await this.nationalExamModel.aggregate<ExamsV2>([
      {
        $match: firstFilter,
      },
      {
        $sort: { createdAt: dateSort },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          status: 1,
          level: 1,
          questions: 1,
          isDeleted: 1,
          examBucket: 1,
          examKey: 1,
          answerBucket: 1,
          answerKey: 1,
          videoLink: 1,
          createdAt: 1,
          createdBy: 1,
        },
      },
    ]);
    const start = (page - 1) * pageSize;

    const pinnedExams = examFiles.filter(
      (file) => file.status === NationalExamStatus.HOT,
    );
    const unpinnedExams = examFiles.filter(
      (file) => file.status !== NationalExamStatus.HOT,
    );
    const totalPage = Math.ceil(unpinnedExams.length / pageSize);
    const result = unpinnedExams.splice(start, pageSize);

    return {
      page,
      pageSize: Math.min(pageSize, result.length),
      totalPage,
      pinnedExams,
      result,
    };
  }

  public async deleteNationalExam(examId: Types.ObjectId): Promise<void> {
    const exam = await this.nationalExamModel.findById(examId);
    if (!exam) throw new NotFoundException('Không tìm thấy đề thi');
    if (exam.isDeleted) throw new BadRequestException('Đề thi đã được xóa');
    exam.isDeleted = true;
    await exam.save();
  }

  public async updateNationalExam(
    examId: Types.ObjectId,
    updateNationalExamRequestInterface: UpdateNationalExamRequestInterface,
  ): Promise<void> {
    const { title, status, level, questions, videoLink } =
      updateNationalExamRequestInterface;
    const nationalExam = await this.nationalExamModel.findById(examId);
    if (!nationalExam || nationalExam.isDeleted)
      throw new NotFoundException('Không tìm thấy đề thi');

    const updateFields: Partial<UpdateNationalExamRequestInterface> = {};
    if (title) {
      updateFields.title = title;
    }
    if (status || status == null) {
      updateFields.status = status;
    }
    if (level) {
      updateFields.level = level;
    }
    if (questions) {
      updateFields.questions = questions;
    }
    if (videoLink) {
      updateFields.videoLink = videoLink;
    }

    await this.nationalExamModel.findByIdAndUpdate(examId, updateFields, {
      new: true,
    });
  }
}
