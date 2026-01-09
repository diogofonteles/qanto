import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter and one number',
  })
  password: string;

  @ApiProperty({ example: '11987654321', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '12345-678', required: false })
  @IsString()
  @IsOptional()
  addressZipCode?: string;

  @ApiProperty({ example: 'Rua Example', required: false })
  @IsString()
  @IsOptional()
  addressStreet?: string;

  @ApiProperty({ example: '123', required: false })
  @IsString()
  @IsOptional()
  addressNumber?: string;

  @ApiProperty({ example: 'Apt 101', required: false })
  @IsString()
  @IsOptional()
  addressComplement?: string;

  @ApiProperty({ example: 'Centro', required: false })
  @IsString()
  @IsOptional()
  addressNeighborhood?: string;

  @ApiProperty({ example: 'São Paulo', required: false })
  @IsString()
  @IsOptional()
  addressCity?: string;

  @ApiProperty({ example: 'SP', required: false })
  @IsString()
  @IsOptional()
  addressState?: string;

  @ApiProperty({ enum: UserRole, default: UserRole.consumer })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
