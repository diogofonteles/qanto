import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsPhoneNumber } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsPhoneNumber('BR')
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  birthDate?: string;
}
