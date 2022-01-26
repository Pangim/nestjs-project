import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { SchemaOptions } from 'mongoose';
import { Document } from 'mongoose';

export type OrderDetailDocument = OrderDetail & Document;

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class OrderDetail {
  @Prop({
    required: true,
    unique: true,
  })
  @IsString()
  userId: string;

  @Prop({
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  receiverDetail: [
    {
      refund: boolean;
      receiverName: string;
      receiverPhone: number;
      receiverAddress: string;
      orderCode: string;
      quantity: number;
      totalPrice: number;

      productDetail: {
        productId: string;
        productName: string;
        productPrice: number;
        productCode: string;
      };
    },
  ];
}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);
