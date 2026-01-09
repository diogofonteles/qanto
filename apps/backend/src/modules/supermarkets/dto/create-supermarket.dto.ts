import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Matches,
  IsUrl,
  MinLength,
  IsEmail,
  IsObject,
  IsNumber,
} from 'class-validator';
import { IsCNPJ } from '../../../common/decorators/is-cnpj.decorator';

export class CreateSupermarketDto {
  @ApiProperty({ example: 'Supermercado XYZ Ltda' })
  @IsString()
  @MinLength(3)
  companyName: string;

  @ApiProperty({ example: 'Mercado XYZ', required: false })
  @IsString()
  @IsOptional()
  tradingName?: string;

  @ApiProperty({ example: '12.345.678/0001-90' })
  @IsCNPJ()
  cnpj: string;

  @ApiProperty({ example: 'Avenida Paulista' })
  @IsString()
  addressStreet: string;

  @ApiProperty({ example: '1578' })
  @IsString()
  addressNumber: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  addressComplement?: string;

  @ApiProperty({ example: 'Bela Vista' })
  @IsString()
  addressNeighborhood: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  addressCity: string;

  @ApiProperty({ example: 'SP' })
  @IsString()
  @Matches(/^[A-Z]{2}$/, { message: 'State must be 2 uppercase letters' })
  addressState: string;

  @ApiProperty({ example: '01310-100' })
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/, { message: 'Invalid CEP format' })
  addressZipcode: string;

  @ApiProperty({ example: -23.5505199, required: false })
  @IsOptional()
  addressLat?: number;

  @ApiProperty({ example: -46.6333094, required: false })
  @IsOptional()
  addressLng?: number;

  @ApiProperty({ example: 'contact@mercadoxyz.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter and one number',
  })
  password: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, type: 'object' })
  @IsObject()
  @IsOptional()
  openingHours?: Record<string, any>;
}
