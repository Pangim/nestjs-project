import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createDtoOrderDetail {
  @IsString()
  @IsNotEmpty()
  receiverName: string;

  @IsString()
  @IsNotEmpty()
  receiverPhone: string;

  @IsString()
  @IsNotEmpty()
  receiverAddress: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class createDtoOrderDetailParam {
  @IsString()
  @IsNotEmpty()
  productCode: string;
}

export class getDtoOrderDetailOneParam {
  @IsString()
  @IsNotEmpty()
  orderCode: string;
}

export class patchDtoOrderRefundParam {
  @IsString()
  @IsNotEmpty()
  orderCode: string;
}

export class getDtoOrderDetailAllRefundQuery {
  refund: number;
}
