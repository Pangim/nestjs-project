import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Document, SchemaOptions } from 'mongoose';

export type CategoryDocumnet = Category & Document;

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Category {
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({
    required: true,
    type: Schema,
  })
  @IsObject()
  @IsNotEmpty()
  product: [
    {
      productName: string;
      productPrice: number;
      productInformation: string;
      productQuantity: number;
      productCode: string;
    },
  ];
}

export const CategorySchemas = SchemaFactory.createForClass(Category);
