import { HttpException, Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import {
  createDtoCategory,
  findDtoProductOne,
  findDtoProductAll,
} from './dto/create-category.dto';
import { Category } from './schemas/category.schemas';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(body: createDtoCategory): Promise<Category | null> {
    return await this.categoryRepository.createCategory(body);
  }

  async findProductAll(query: findDtoProductAll): Promise<Category[] | null> {
    const { name, page } = query;

    if (page <= 0) throw new HttpException('Erorr: Not Found Category', 404);

    const pages = page - 1;
    const products = await this.categoryRepository.findProductAll(pages, name);
    const productsData = products[0];

    if (!productsData)
      throw new HttpException('Erorr: Not Found Category', 404);
    return products;
  }

  async findProductOne(param: findDtoProductOne): Promise<Category | null> {
    const product = await this.categoryRepository.findProductOne(param);
    if (product === null)
      throw new HttpException('Erorr: Not Found Product', 404);
    return product;
  }
}
