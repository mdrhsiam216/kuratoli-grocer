import { IsInt, IsOptional, IsNotEmpty } from 'class-validator';

export class CartItemDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsInt()
  cartId?: number;

  @IsNotEmpty()
  @IsInt()
  productId!: number;

  @IsNotEmpty()
  @IsInt()
  quantity!: number;
}
