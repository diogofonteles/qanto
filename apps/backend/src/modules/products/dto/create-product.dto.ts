import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsUUID,
  Min,
  IsEnum,
  IsDateString,
  IsUrl,
  Matches,
} from 'class-validator';

export enum ProductUnit {
  UN = 'un',
  KG = 'kg',
  G = 'g',
  L = 'l',
  ML = 'ml',
}

export class CreateProductDto {
  @ApiProperty({ example: 'Arroz Tipo 1 Tio João' })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, example: '7891234567890' })
  @IsString()
  @IsOptional()
  @Matches(/^\d{13}$/, { message: 'Barcode must be 13 digits (EAN-13)' })
  barcode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ enum: ProductUnit, example: 'kg' })
  @IsEnum(ProductUnit)
  unit: ProductUnit;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0.001)
  quantity: number;

  @ApiProperty({ example: 2499, description: 'Price in cents (24.99 = 2499)' })
  @IsInt()
  @Min(1)
  priceCents: number;

  @ApiProperty({ required: false, description: 'Promotional price in cents' })
  @IsInt()
  @IsOptional()
  @Min(1)
  promoPriceCents?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  promoStartDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  promoEndDate?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty()
  @IsUUID()
  categoryId: string;
}
