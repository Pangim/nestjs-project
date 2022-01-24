import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GetOrderQueryValidationPipe } from 'src/common/pipe/custom.pipe';
import {
  createDtoOrderDetail,
  createDtoOrderDetailParam,
  getDtoOrderDetailAllRefundQuery,
  getDtoOrderDetailOneParam,
  patchDtoOrderRefundParam,
} from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/:productCode')
  @UseGuards(AuthGuard())
  createOrderDetail(
    @Body() body: createDtoOrderDetail,
    @Param() param: createDtoOrderDetailParam,
    @Req() req: Request,
  ): object {
    const userId = req.user['id'];
    return this.orderService.createOrderDetail(body, param, userId);
  }

  @Get('/detail')
  @UseGuards(AuthGuard())
  getOrderDetailAll(
    @Req() req: Request,
    @Query('refund', ParseIntPipe, GetOrderQueryValidationPipe)
    query: getDtoOrderDetailAllRefundQuery,
  ): object {
    const userId = req.user['id'];
    return this.orderService.getOrderDetailAll(userId, query);
  }

  @Get('/detail/:orderCode')
  @UseGuards(AuthGuard())
  getOrderDetailOne(@Req() req: Request, @Param() param: getDtoOrderDetailOneParam): object {
    const userId = req.user['id'];
    return this.orderService.getOrderDetailOne(userId, param);
  }

  @Patch('/refund/:orderCode')
  @UseGuards(AuthGuard())
  updateOrderRefund(@Req() req: Request, @Param() param: patchDtoOrderRefundParam): object {
    const userId = req.user['id'];
    return this.orderService.updateOrderRefund(userId, param);
  }
}
