import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createDtoCategory, findDtoProductOne } from './dto/create-category.dto';
import { Category } from './schemas/category.schemas';

@Injectable()
export class CategoryRepository {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) {}

  async createCategory(body: createDtoCategory): Promise<Category | null> {
    const { name, product } = body;
    const { productName, productPrice, productCode, productQuantity, productInformation } = product;

    const category = await this.categoryModel.create({
      name,
      product: {
        productName,
        productPrice,
        productCode,
        productQuantity,
        productInformation,
      },
    });
    return category;
  }
  async findProductAll(pages: number, name: string): Promise<Category[] | null> {
    const LIMIT = 5;

    const products = await this.categoryModel
      .find({ name })
      .select(['product.productName', 'product.productPrice', 'product.productCode', '-_id'])
      .limit(LIMIT)
      .skip(LIMIT * pages);
    return products;
  }

  async findProductOne(productCode: string): Promise<Category | null> {
    const product = await this.categoryModel
      .findOne({
        'product.productCode': productCode,
      })
      .select([
        'product.productPrice',
        'product.productName',
        'product.productInformation',
        'product.productQuantity',
        '-_id',
      ]);
    return product;
  }

  async isExistProduct(param: findDtoProductOne): Promise<boolean> {
    const { productCode } = param;
    return await this.categoryModel.exists({
      'product.productCode': productCode,
    });
  }
}
