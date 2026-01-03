import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AttemptCollectionName } from 'src/constants/schema';
import { AttemptDocument } from '../schemas/attempt.schema';
import { CreateAttemptDto, UpdateAttemptDto } from '../dtos';

@Injectable()
export class AttemptService {
  constructor(
    @InjectModel(AttemptCollectionName)
    private readonly attemptModel: Model<AttemptDocument>,
  ) {}

  public async createAttempt(
    createAttemptDto: CreateAttemptDto,
    userId: Types.ObjectId,
  ): Promise<Types.ObjectId> {
    const newAttempt = await this.attemptModel.create({
      ...createAttemptDto,
      quizId: new Types.ObjectId(createAttemptDto.quizId),
      userId,
      isCompleted: createAttemptDto.isCompleted ?? false,
      remainingTime: createAttemptDto.remainingTime ?? null,
    });
    return newAttempt._id;
  }

  public async updateAttempt(
    attemptId: string,
    updateAttemptDto: UpdateAttemptDto,
  ): Promise<AttemptDocument> {
    console.log(attemptId);
    console.log(11111);
    const updatedAttempt = await this.attemptModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(attemptId),
        },
        { $set: updateAttemptDto },
        { new: true },
      )
      .lean();
    if (!updatedAttempt) {
      throw new NotFoundException('Attempt not found');
    }
    return updatedAttempt;
  }

  public async getAttemptsByQuizId(
    quizId: string,
    userId: Types.ObjectId,
    completedOnly?: boolean,
  ): Promise<AttemptDocument[]> {
    const query: Record<string, unknown> = {
      quizId: new Types.ObjectId(quizId),
      userId,
    };

    if (completedOnly !== undefined) {
      query.isCompleted = completedOnly;
    }

    const attempts = await this.attemptModel.find(query).sort({ createdAt: -1 }).lean();
    return attempts;
  }

  public async getInProgressAttempt(
    quizId: string,
    userId: Types.ObjectId,
  ): Promise<AttemptDocument | null> {
    const attempt = await this.attemptModel
      .findOne({
        quizId: new Types.ObjectId(quizId),
        userId,
        isCompleted: false,
      })
      .lean();
    return attempt;
  }

  public async getAttemptById(attemptId: string, userId: Types.ObjectId): Promise<AttemptDocument> {
    const attempt = await this.attemptModel
      .findOne({
        _id: new Types.ObjectId(attemptId),
        userId,
      })
      .lean();
    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }
    return attempt;
  }

  public async deleteAttemptById(attemptId: string, userId: Types.ObjectId): Promise<string> {
    const result = await this.attemptModel.deleteOne({
      _id: new Types.ObjectId(attemptId),
      userId,
    });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Attempt not found');
    }
    return 'Attempt deleted successfully';
  }
}
