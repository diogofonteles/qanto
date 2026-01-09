import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ListStatus } from '@prisma/client';

export class UpdateListDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, enum: ListStatus })
  @IsEnum(ListStatus)
  @IsOptional()
  status?: ListStatus;
}
