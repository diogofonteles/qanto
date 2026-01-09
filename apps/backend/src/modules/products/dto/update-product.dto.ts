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
  IsBoolean,
} from 'class-validator';
import { ProductStatus } from '@prisma/client';
import { ProductUnit } from './create-product.dto';

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ required: false, enum: ProductUnit })
  @IsEnum(ProductUnit)
  @IsOptional()
  unit?: ProductUnit;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0.001)
  quantity?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  @Min(1)
  priceCents?: number;

  @ApiProperty({ required: false })
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

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ required: false, enum: ProductStatus })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
