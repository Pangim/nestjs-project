import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class GetOrderQueryValidationPipe implements PipeTransform {
  transform(value: number, metadata: ArgumentMetadata) {
    console.log(value, typeof value);

    if (value !== 0 && value !== 1)
      throw new BadRequestException(`${value} isn't in the query options hint: 0 or 1`);
    return value;
  }
}
