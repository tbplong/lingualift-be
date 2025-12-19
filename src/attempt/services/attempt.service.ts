import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AttemptCollectionName } from 'src/constants/schema';
import { AttemptDocument } from '../schemas/attempt.schema';
import { CreateAttemptDto } from '../dtos';

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
    });
    return newAttempt._id;
  }

  public async getAttemptsByQuizId(
    quizId: string,
    userId: Types.ObjectId,
  ): Promise<AttemptDocument[]> {
    const attempts = await this.attemptModel
      .find({
        quizId: new Types.ObjectId(quizId),
        userId,
      })
      .sort({ createdAt: -1 })
      .lean();
    return attempts;
  }

  public async getAttemptById(
    attemptId: string,
    userId: Types.ObjectId,
  ): Promise<AttemptDocument> {
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

  public async deleteAttemptById(
    attemptId: string,
    userId: Types.ObjectId,
  ): Promise<string> {
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
