import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizDto, UpdateQuizDto } from '../dtos';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { QuizCollectionName } from 'src/constants/schema';
import { QuizDocument } from '../schemas/quiz.schema';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(QuizCollectionName)
    private readonly quizModel: Model<QuizDocument>,
  ) {}
  public async createQuiz(quizDto: QuizDto): Promise<Types.ObjectId> {
    const newQuiz = await this.quizModel.create(quizDto);
    return newQuiz._id;
  }

  public async updateQuizById(
    quizDto: QuizDto,
    id: Types.ObjectId,
  ): Promise<string> {
    const updatedQuiz = await this.quizModel
      .findByIdAndUpdate(id, {
        $set: plainToInstance(UpdateQuizDto, { ...quizDto }),
      })
      .lean();
    if (!updatedQuiz) throw new NotFoundException('Quiz not found');
    return 'Quiz Updated Successfully';
  }

  public async readQuiz(): Promise<QuizDto[]> {
    const quizs = await this.quizModel.find().lean();
    if (!quizs.length) throw new NotFoundException('No quizs found');
    return quizs;
  }

  public async readQuizById(id: Types.ObjectId): Promise<QuizDto> {
    const quizById = await this.quizModel.findById(id).lean();
    if (!quizById) throw new NotFoundException('Quiz not found');
    return quizById;
  }

  public async deleteQuizById(id: Types.ObjectId): Promise<string> {
    const result = await this.quizModel.deleteOne({ _id: id });
    if (result.deletedCount === 0)
      throw new NotFoundException('Quiz not found');
    return 'Quiz Deleted Successfully';
  }
}
