import { IsInt, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class OrderItemDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsInt()
  orderId?: number;

  @IsNotEmpty()
  @IsInt()
  productId!: number;

  @IsNotEmpty()
  @IsInt()
  quantity!: number;

  @IsNotEmpty()
  @IsNumber()
  price!: number;
}
