import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsBoolean, IsOptional } from 'class-validator';

export class UpdateItemDto {
  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isChecked?: boolean;
}
