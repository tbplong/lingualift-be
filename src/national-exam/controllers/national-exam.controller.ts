import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import { BlockIfNotManager, User } from 'src/auth/decorators';
import { ObjectIdTransformPipe } from 'src/common/pipes';

import {
  CreateNationalExamRequestDto,
  CreateNationalExamResponseDto,
  GetNationalExamResponseV2Dto,
  GetNationalExamsQueryV2Dto,
  GetNationalExamsResponseV2Dto,
  UpdateNationalExamRequestDto,
} from '../dtos';
import { NationalExamService } from '../services';

@Controller('exams')
export class NationalExamController {
  constructor(private readonly nationalExamService: NationalExamService) {}

  @Post('/')
  @BlockIfNotManager(true)
  public async createNationalExam(
    @User() user: Express.User,
    @Body() createNationalExamRequestDto: CreateNationalExamRequestDto,
  ): Promise<CreateNationalExamResponseDto> {
    const exam = await this.nationalExamService.createNationalExam(
      user.userId,
      createNationalExamRequestDto,
    );
    return plainToInstance(CreateNationalExamResponseDto, exam, {
      excludeExtraneousValues: true,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('/')
  public async getNationalExamsV2(
    @Query() getNationalExamsQueryV2Dto: GetNationalExamsQueryV2Dto,
  ): Promise<GetNationalExamsResponseV2Dto> {
    const exams = await this.nationalExamService.getNationalExamsV2(
      getNationalExamsQueryV2Dto,
    );
    return plainToInstance(GetNationalExamsResponseV2Dto, exams, {
      excludeExtraneousValues: true,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:examId')
  public async getNationalExamByIdV2(
    @Param('examId', ObjectIdTransformPipe) examId: Types.ObjectId,
  ): Promise<GetNationalExamResponseV2Dto> {
    const exam = await this.nationalExamService.getNationalExamByIdV2(examId);
    return plainToInstance(GetNationalExamResponseV2Dto, exam, {
      excludeExtraneousValues: true,
    });
  }

  @Delete('/:examId')
  @BlockIfNotManager(true)
  public async deleteNationalExam(
    @Param('examId', ObjectIdTransformPipe) examId: Types.ObjectId,
  ): Promise<void> {
    await this.nationalExamService.deleteNationalExam(examId);
  }

  @Patch('/:examId')
  @BlockIfNotManager(true)
  public async updateNationalExam(
    @Param('examId', ObjectIdTransformPipe) examId: Types.ObjectId,
    @Body() updateNationalExamRequestDto: UpdateNationalExamRequestDto,
  ): Promise<void> {
    await this.nationalExamService.updateNationalExam(
      examId,
      updateNationalExamRequestDto,
    );
  }
}
