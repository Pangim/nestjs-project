import { createDtoCategory, findDtoProductOne, findDtoProductAll } from './dto/create-category.dto';
import { errorHandlerCategory, CATEGORY_REQUEST_ERROR } from './error/error';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Category } from './schemas/category.schemas';

const { DOES_NOT_EXIST_PAGE_PRODUCTS, DOES_NOT_EXIST_PAGE_PRODUCT } = CATEGORY_REQUEST_ERROR;

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(body: createDtoCategory): Promise<Category | null> {
    return await this.categoryRepository.createCategory(body);
  }

  async findProductAll(query: findDtoProductAll): Promise<Category[] | null> {
    try {
      const { name, page } = query;
      const pages = page - 1;

      const products = await this.categoryRepository.findProductAll(pages, name);
      const productsData = products[0];

      if (!productsData) throw Error(DOES_NOT_EXIST_PAGE_PRODUCTS);

      return products;
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(errorHandlerCategory(error.message));
    }
  }

  async findProductOne(param: findDtoProductOne): Promise<Category | null> {
    const { productCode } = param;

    try {
      const product = await this.categoryRepository.findProductOne(productCode);

      if (product === null) throw Error(DOES_NOT_EXIST_PAGE_PRODUCT);

      return product;
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(errorHandlerCategory(error.message));
    }
  }
}
