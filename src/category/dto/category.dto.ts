import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CategoryDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name!: string;
}
