import { Category, CategorySchemas } from './schemas/category.schemas';
import { CategoryRepository } from './category.repository';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchemas }]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryRepository],
})
export class CategoryModule {}
