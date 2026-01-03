import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { authConfig, commonConfig, minioConfig, redisConfig } from './common/config';
import { databaseConfig } from './common/config/database.config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ExceptionsFilter } from './common/filters';
import { AuthGuard } from './auth/guards';
import { LoggerModule } from 'nestjs-pino';
import { QuizModule } from './quiz/quiz.module';
import { AttemptModule } from './attempt/attempt.module';
import { StorageModule } from './storage/storage.module';
import { NationalExamModule } from './national-exam/national-exam.module';
import { MaterialsModule } from './materials/materials.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [authConfig, databaseConfig, minioConfig, commonConfig, redisConfig],
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
    DashboardModule,
    MaterialsModule,
    QuizModule,
    AttemptModule,
    StorageModule,
    NationalExamModule,
    RedisModule,
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
