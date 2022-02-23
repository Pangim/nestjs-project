import { Category, CategorySchemas } from 'src/category/schemas/category.schemas';
import { OrderDetail, OrderDetailSchema } from './schemas/order.scheams';
import { User, UserSchemas } from 'src/user/schemas/user.schemas';
import { CategoryModule } from 'src/category/category.module';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { OrderService } from './order.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    MongooseModule.forFeature([
      { name: OrderDetail.name, schema: OrderDetailSchema },
      { name: Category.name, schema: CategorySchemas },
      { name: User.name, schema: UserSchemas },
    ]),

    UserModule,
    CategoryModule,
  ],
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
})
export class OrderModule {}
