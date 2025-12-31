import { Logger as NestLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import mongoose from 'mongoose';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { join } from 'path';
import { existsSync } from 'fs';

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

  /* =======================
     DEBUG STATIC FILE PATH
     ======================= */
  const cwdUploads = join(process.cwd(), 'uploads');
  const dirUploads = join(__dirname, '..', 'uploads');

  NestLogger.log(`process.cwd()      = ${process.cwd()}`, 'STATIC');
  NestLogger.log(`__dirname          = ${__dirname}`, 'STATIC');
  NestLogger.log(`cwdUploads         = ${cwdUploads}`, 'STATIC');
  NestLogger.log(`dirUploads         = ${dirUploads}`, 'STATIC');
  NestLogger.log(`exists cwdUploads? = ${existsSync(cwdUploads)}`, 'STATIC');
  NestLogger.log(`exists dirUploads? = ${existsSync(dirUploads)}`, 'STATIC');
  NestLogger.log(`exists test.pdf in cwd? = ${existsSync(join(cwdUploads, 'test.pdf'))}`, 'STATIC');
  NestLogger.log(`exists test.pdf in dir? = ${existsSync(join(dirUploads, 'test.pdf'))}`, 'STATIC');

  // 🔴 QUAN TRỌNG: dùng path CHẮC ĂN
  app.useStaticAssets(dirUploads, { prefix: '/uploads' });

  // Express Middleware
  middleware(app);

  // Enable versioning v1,v2,...
  app.enableVersioning({
    defaultVersion: '1',
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
