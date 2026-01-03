import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { MinioStorageService } from './services/minio-storage.service';
import { BlockIfNotManager } from 'src/auth/decorators';

@Injectable()
@Controller('storage')
export class MinioStorageController {
  constructor(private readonly minioStorageService: MinioStorageService) {}

  @Post('')
  @BlockIfNotManager(true)
  public async getPresignedUrl(@Body() body: { key: string }) {
    const url = await this.minioStorageService.getPresignedUploadUrl(
      process.env.MINIO_BUCKET,
      `${body.key}`,
    );
    return { url };
  }
}
