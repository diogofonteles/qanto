import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Matches,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class UpdateAddressDto {
  @ApiProperty({ example: '01310-100' })
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/, { message: 'Invalid CEP format' })
  addressZipcode: string;

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

  @ApiProperty({ example: -23.5505199, required: false })
  @IsOptional()
  addressLat?: number;

  @ApiProperty({ example: -46.6333094, required: false })
  @IsOptional()
  addressLng?: number;

  @ApiProperty({ example: 5, description: 'Search radius in kilometers' })
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  searchRadiusKm?: number;
}
