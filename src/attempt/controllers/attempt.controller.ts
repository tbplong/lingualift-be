import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AttemptService } from '../services/attempt.service';
import {
  AttemptDetailDto,
  AttemptsResponseDto,
  CreateAttemptDto,
  CreateAttemptResponseDto,
} from '../dtos';
import { User } from 'src/auth/decorators';
import { Types } from 'mongoose';

@Controller('attempts')
export class AttemptController {
  constructor(private attemptService: AttemptService) {}

  @Post('/')
  public async create(
    @Body() createAttemptDto: CreateAttemptDto,
    @User() user: { _id: Types.ObjectId },
  ): Promise<CreateAttemptResponseDto> {
    const newAttemptId = await this.attemptService.createAttempt(
      createAttemptDto,
      user._id,
    );
    return plainToInstance(CreateAttemptResponseDto, { _id: newAttemptId });
  }

  @Get('/')
  public async getByQuizId(
    @Query('quizId') quizId: string,
    @User() user: { _id: Types.ObjectId },
  ): Promise<AttemptsResponseDto> {
    const attempts = await this.attemptService.getAttemptsByQuizId(
      quizId,
      user._id,
    );
    return plainToInstance(
      AttemptsResponseDto,
      { attempts },
      { excludeExtraneousValues: true },
    );
  }

  @Get('/:id')
  public async getById(
    @Param('id') id: string,
    @User() user: { _id: Types.ObjectId },
  ): Promise<AttemptDetailDto> {
    const attempt = await this.attemptService.getAttemptById(id, user._id);
    return plainToInstance(AttemptDetailDto, attempt, {
      excludeExtraneousValues: true,
    });
  }

  @Delete('/:id')
  public async deleteById(
    @Param('id') id: string,
    @User() user: { _id: Types.ObjectId },
  ): Promise<string> {
    return await this.attemptService.deleteAttemptById(id, user._id);
  }
}
