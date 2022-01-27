import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class createDtoCategory {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsObject()
  @IsNotEmpty()
  readonly product: {
    productName: string;
    productPrice: number;
    productInformation: string;
    productQuantity: number;
    productCode: string;
  };
}

export class findDtoProductAll {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly page: number;
}

export class findDtoProductOne {
  @IsString()
  @IsNotEmpty()
  readonly productCode: string;
}
