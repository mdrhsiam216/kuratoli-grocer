import { IsInt, IsNotEmpty } from 'class-validator';

export class AddCartItemDto {
  @IsNotEmpty()
  @IsInt()
  productId!: number;

  @IsNotEmpty()
  @IsInt()
  quantity!: number;
}
