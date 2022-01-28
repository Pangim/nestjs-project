import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { errorHandlerOrder, ORDER_REQUEST_ERROR } from 'src/order/error/error';

@Injectable()
export class GetOrderQueryValidationPipe implements PipeTransform {
  transform(value: number, metadata: ArgumentMetadata) {
    const { BAD_REQUEST_QUERY_REFUND } = ORDER_REQUEST_ERROR;

    try {
      if (value !== 0 && value !== 1) throw Error(BAD_REQUEST_QUERY_REFUND);

      return value;
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(errorHandlerOrder(error.message));
    }
  }
}
