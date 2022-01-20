import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  createDtoCategory,
  findDtoProductOne,
  findDtoProductAll,
} from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/make')
  createCategory(@Body() body: createDtoCategory): object {
    return this.categoryService.createCategory(body);
  }

  @Get('/product')
  findProductAll(@Query() query: findDtoProductAll): object {
    return this.categoryService.findProductAll(query);
  }

  @Get('/product/:productCode')
  findProductOne(@Param() param: findDtoProductOne): object {
    return this.categoryService.findProductOne(param);
  }
}
