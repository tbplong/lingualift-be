import * as common from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Response } from 'express';

@common.Catch()
export class AllExceptionFilter implements common.ExceptionFilter {
  constructor(private logger: common.LoggerService) {}

  private static handleResponse(
    response: Response,
    exception: common.HttpException | Error,
  ): void {
    let responseBody: any = { message: 'Internal server error' };
    let statusCode = common.HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof common.HttpException) {
      responseBody = exception.getResponse();
      statusCode = exception.getStatus();
    } else if (exception instanceof Error) {
      if (exception.name === 'ValidationError') {
        statusCode = common.HttpStatus.BAD_REQUEST;
      }
      responseBody = {
        statusCode,
        message: 'An error occurred, please try again later',
      };
    }

    response.status(statusCode).json(responseBody);
  }

  public catch(
    exception: common.HttpException | Error,
    host: common.ArgumentsHost,
  ): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();

    // Handling error message and logging
    this.handleMessage(exception);

    // Response to client
    AllExceptionFilter.handleResponse(response, exception);
  }

  private handleMessage(exception: common.HttpException | Error): void {
    let message = 'Internal Server Error';

    if (exception instanceof common.HttpException) {
      message = JSON.stringify(exception.getResponse());
    } else if (exception instanceof Error) {
      message = exception.stack?.toString() ?? '';
    }

    this.logger.error(message);
  }
}
