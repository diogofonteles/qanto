import { ApiProperty } from '@nestjs/swagger';

export class UploadCsvDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
