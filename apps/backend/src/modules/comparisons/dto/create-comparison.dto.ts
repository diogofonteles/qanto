import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class CreateComparisonDto {
  @ApiProperty()
  @IsUUID()
  listId: string;

  @ApiProperty({ type: [String], description: 'Array of supermarket IDs to compare' })
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(20)
  supermarketIds: string[];
}
