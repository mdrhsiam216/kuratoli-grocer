import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsInt,
  IsString,
} from 'class-validator';

export class AdminDto {
  @IsOptional()
  @IsInt()
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

  @IsOptional()
  @IsString()
  token?: string;
}
