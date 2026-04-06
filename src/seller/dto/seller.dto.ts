import { IsNotEmpty, IsEmail, IsOptional, IsString } from 'class-validator';

export class SellerDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
