import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdTransformPipe implements PipeTransform<string, Types.ObjectId> {
  public transform(value: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Id không hợp lệ');
    }
    return new Types.ObjectId(value);
  }
}
