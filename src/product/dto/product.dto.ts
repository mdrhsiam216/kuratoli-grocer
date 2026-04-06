import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class ProductDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsNotEmpty()
  @IsInt()
  sellerId!: number;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @IsNotEmpty()
  @IsInt()
  stock!: number;

  @IsNotEmpty()
  @IsString()
  image!: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
