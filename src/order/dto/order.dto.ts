import {
  IsInt,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class OrderDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsNotEmpty()
  @IsInt()
  customerId!: number;

  @IsOptional()
  @IsInt()
  couponId?: number;

  @IsNotEmpty()
  @IsNumber()
  totalPrice!: number;

  @IsOptional()
  @IsString()
  status?: string;
}
