import { IsInt, IsOptional, IsNotEmpty } from 'class-validator';

export class CartDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsNotEmpty()
  @IsInt()
  customerId!: number;
}
