import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class RequiredUserIdPipe implements PipeTransform<any, string> {
  transform(value: any): string {
    if (value === null || value === undefined) {
      throw new BadRequestException('Missing userId in request');
    }

    if (typeof value === 'string' && value.trim().length === 0) {
      throw new BadRequestException('Missing userId in request');
    }

    return String(value);
  }
}
