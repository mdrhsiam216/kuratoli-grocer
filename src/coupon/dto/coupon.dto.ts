import {
  IsInt,
  IsOptional,
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CouponDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsNotEmpty()
  @IsString()
  code!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage!: number;

  @IsNotEmpty()
  @IsInt()
  maxUsage!: number;

  @IsOptional()
  @IsInt()
  usedCount?: number;
}
