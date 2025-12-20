import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { authConfig, commonConfig, minioConfig } from './common/config';
import { databaseConfig } from './common/config/database.config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ExceptionsFilter } from './common/filters';
import { AuthGuard } from './auth/guards';
import { LoggerModule } from 'nestjs-pino';
import { StorageModule } from './storage/storage.module';
import { NationalExamModule } from './national-exam/national-exam.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [authConfig, databaseConfig, minioConfig, commonConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: (dbConfig: ConfigType<typeof databaseConfig>) => ({
        uri: dbConfig.connectionString,
      }),
      inject: [databaseConfig.KEY],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: () => ({
          context: 'HTTP',
        }),
      },
    }),
    AuthModule,
    UsersModule,
    StorageModule,
    NationalExamModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global Guard, Authentication check on all routers
    // Global Filter, Exception check
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    // Global Pipe, Validation check
    // https://docs.nestjs.com/pipes#global-scoped-pipes
    // https://docs.nestjs.com/techniques/validation
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true, // transform object to DTO class
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
