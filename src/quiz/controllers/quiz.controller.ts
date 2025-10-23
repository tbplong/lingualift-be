import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreateQuizResponseDto,
  QuizDto,
  QuizResponseDto,
  QuizsResponseDto,
} from '../dtos';
// import { BlockIfNotManager } from 'src/auth/decorators';
import { plainToInstance } from 'class-transformer';
import { QuizService } from '../services/quiz.service';
import { Types } from 'mongoose';

@Controller('quizs')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Post('/')
  // @BlockIfNotManager(true)
  public async create(
    @Body() quizDto: QuizDto,
  ): Promise<CreateQuizResponseDto> {
    const newQuiz = await this.quizService.createQuiz(quizDto);
    return plainToInstance(CreateQuizResponseDto, { newQuiz });
  }

  @Patch('/:id')
  // @BlockIfNotManager(true)
  public async update(
    @Param('id') id: Types.ObjectId,
    @Body() quizDto: QuizDto,
  ): Promise<string> {
    const updatedQuiz = await this.quizService.updateQuizById(quizDto, id);
    return updatedQuiz;
  }

  @Get('/:id')
  // @BlockIfNotManager(true)
  public async readById(
    @Param('id') id: Types.ObjectId,
  ): Promise<QuizResponseDto> {
    const quiz = await this.quizService.readQuizById(id);
    return plainToInstance(QuizResponseDto, { quiz });
  }

  @Get('/')
  // @BlockIfNotManager(true)
  public async readAll(): Promise<QuizsResponseDto> {
    const quizs = await this.quizService.readQuiz();
    return plainToInstance(QuizsResponseDto, { quizs });
  }

  @Delete('/:id')
  // @BlockIfNotManager(true)
  public async deleteById(@Param('id') id: Types.ObjectId): Promise<string> {
    const successMSG = await this.quizService.deleteQuizById(id);
    return successMSG;
  }
}
