import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { CATEGORY_REQUEST_ERROR, errorHandlerCategory } from 'src/category/error/error';

@Injectable()
export class PageValidationPipe implements PipeTransform {
  transform(value: { page: number }, metadata: ArgumentMetadata) {
    const { DOES_NOT_EXIST_PAGE_PRODUCTS_PIPE } = CATEGORY_REQUEST_ERROR;

    try {
      if (value.page <= 0 || isNaN(value.page) === true)
        throw Error(DOES_NOT_EXIST_PAGE_PRODUCTS_PIPE);

      return value;
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(errorHandlerCategory(error.message));
    }
  }
}
