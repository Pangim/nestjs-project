import { createDtoCategory, findDtoProductOne, findDtoProductAll } from './dto/create-category.dto';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PageValidationPipe } from '../common/pipe/get-category-all.pipe';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/make')
  createCategory(@Body() body: createDtoCategory): object {
    return this.categoryService.createCategory(body);
  }

  @Get('/product')
  findProductAll(@Query(PageValidationPipe) query: findDtoProductAll): object {
    return this.categoryService.findProductAll(query);
  }

  @Get('/product/:productCode')
  findProductOne(@Param() param: findDtoProductOne): object {
    return this.categoryService.findProductOne(param);
  }
}
