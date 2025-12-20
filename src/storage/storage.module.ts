import { Module } from '@nestjs/common';
import * as minio from 'minio';

import { MinioStorageService } from './services/minio-storage.service';
import { MinioStorageController } from './storage.controller';
import { minioConfig, MinioConfigType } from 'src/common/config';

@Module({
  controllers: [MinioStorageController],
  providers: [
    MinioStorageService,
    {
      provide: minio.Client,
      useFactory: (appMinioConfig: MinioConfigType): minio.Client | null => {
        const client = new minio.Client({
          endPoint: appMinioConfig.minioEndPoint,
          port: appMinioConfig.minioPort,
          accessKey: appMinioConfig.minioAccessKey,
          useSSL: true,
          secretKey: appMinioConfig.minioSecretKey,
        });

        return client;
      },
      inject: [minioConfig.KEY],
    },
  ],
  exports: [MinioStorageService],
})
export class StorageModule {}
