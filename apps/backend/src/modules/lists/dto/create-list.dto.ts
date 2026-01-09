import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateListDto {
  @ApiProperty({ example: 'Compras do Mês' })
  @IsString()
  @MinLength(1)
  name: string;
}
