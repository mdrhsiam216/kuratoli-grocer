import { IsInt, IsOptional } from 'class-validator';

export class CheckoutDto {
  @IsOptional()
  @IsInt()
  couponId?: number;
}
