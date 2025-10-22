import {
  Logger as NestLogger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import mongoose from 'mongoose';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { middleware } from './app.middleware';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filter/exception.filter';

async function bootstrap(): Promise<string> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.useGlobalFilters(new AllExceptionFilter(app.get(Logger)));

  app.useGlobalPipes(new ValidationPipe());

  // Express Middleware
  middleware(app);

  // Enable versioning v1,v2,...
  app.enableVersioning({
    defaultVersion: '1', // default version
    type: VersioningType.URI,
  });

  app.enableShutdownHooks();

  await app.listen(process.env.PORT);

  return app.getUrl();
}

void (async (): Promise<void> => {
  try {
    const url = await bootstrap();
    mongoose.set('debug', true);

    NestLogger.log(url, 'Bootstrap');

    if (process.send) {
      process.send('ready');
    }
  } catch (error) {
    NestLogger.error(error, 'Bootstrap');
  }
})();
