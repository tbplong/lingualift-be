import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
  UpdateAttemptDto,
} from '../dtos';
import { User } from 'src/auth/decorators';
import { Types } from 'mongoose';

@Controller('attempts')
export class AttemptController {
  constructor(private attemptService: AttemptService) {}

  // Create attempt
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

  // Update attempt
  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateAttemptDto: UpdateAttemptDto,
    @User() user: { _id: Types.ObjectId },
  ): Promise<AttemptDetailDto> {
    const updatedAttempt = await this.attemptService.updateAttempt(
      id,
      updateAttemptDto,
      user._id,
    );
    return plainToInstance(AttemptDetailDto, updatedAttempt, {
      excludeExtraneousValues: true,
    });
  }

  // Get attempts by quizId
  @Get('/')
  public async getByQuizId(
    @Query('quizId') quizId: string,
    @Query('completedOnly') completedOnly: string,
    @User() user: { _id: Types.ObjectId },
  ): Promise<AttemptsResponseDto> {
    const completed = completedOnly === 'true' ? true : undefined;
    const attempts = await this.attemptService.getAttemptsByQuizId(
      quizId,
      user._id,
      completed,
    );
    return plainToInstance(
      AttemptsResponseDto,
      { attempts },
      { excludeExtraneousValues: true },
    );
  }

  // Get in-progress attempt
  @Get('/in-progress/:quizId')
  public async getInProgress(
    @Param('quizId') quizId: string,
    @User() user: { _id: Types.ObjectId },
  ): Promise<AttemptDetailDto | null> {
    const attempt = await this.attemptService.getInProgressAttempt(
      quizId,
      user._id,
    );
    if (!attempt) return null;
    return plainToInstance(AttemptDetailDto, attempt, {
      excludeExtraneousValues: true,
    });
  }

  // Get attempt by ID
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

  // Delete attempt
  @Delete('/:id')
  public async deleteById(
    @Param('id') id: string,
    @User() user: { _id: Types.ObjectId },
  ): Promise<string> {
    return await this.attemptService.deleteAttemptById(id, user._id);
  }
}
