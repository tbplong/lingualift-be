import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class RequiredUserIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!value) {
      throw new BadRequestException('Missing userId in request');
    }
    return value;
  }
}
